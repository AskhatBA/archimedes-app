import { BridgeOptions } from './types';

/** Name of the global the app calls to deliver a message into the page. */
export const BRIDGE_RECEIVE_FN = '__archimedesBridgeReceive';

/**
 * Builds the script injected before the page's own scripts run.
 *
 * Everything lives behind an origin check: the WebView re-runs this on every navigation,
 * including redirects to third-party payment pages, and those must not receive the auth
 * token or a handle on native capabilities.
 */
export const buildInjectedScript = ({
  allowedOrigins,
  context = {},
  bootstrap = '',
}: Pick<BridgeOptions, 'allowedOrigins' | 'context' | 'bootstrap'>): string => `
(function () {
  try {
    var allowedOrigins = ${JSON.stringify(allowedOrigins)};
    if (allowedOrigins.indexOf(window.location.origin) === -1) return;

    var pending = {};
    var listeners = {};
    var nextId = 0;

    function send(message) {
      window.ReactNativeWebView.postMessage(JSON.stringify(message));
    }

    window.${BRIDGE_RECEIVE_FN} = function (raw) {
      var message;
      try {
        message = JSON.parse(raw);
      } catch (error) {
        return;
      }

      var settle = message.requestId && pending[message.requestId];
      if (settle) {
        delete pending[message.requestId];
        if (message.error) settle.reject(new Error(message.error));
        else settle.resolve(message.payload);
        return;
      }

      (listeners[message.action] || []).forEach(function (listener) {
        listener(message.payload);
      });
    };

    window.NativeBridge = {
      isAvailable: true,
      context: ${JSON.stringify(context)},

      /** Fire-and-forget call into the app. */
      post: function (action, payload) {
        send({ action: action, payload: payload });
      },

      /** Call the app and await its reply. */
      request: function (action, payload) {
        var requestId = 'req-' + nextId++;
        return new Promise(function (resolve, reject) {
          pending[requestId] = { resolve: resolve, reject: reject };
          send({ action: action, requestId: requestId, payload: payload });
        });
      },

      /** Subscribe to messages pushed by the app. Returns an unsubscribe function. */
      on: function (action, listener) {
        listeners[action] = (listeners[action] || []).concat(listener);
        return function () {
          listeners[action] = (listeners[action] || []).filter(function (item) {
            return item !== listener;
          });
        };
      },
    };

    ${bootstrap}

    window.dispatchEvent(new Event('nativebridgeready'));
  } catch (error) {
    // Never let bridge setup break the page itself.
  }
})();
true;
`;
