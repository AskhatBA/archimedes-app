import { useCallback, useMemo, useRef } from 'react';
import WebView, { WebViewMessageEvent } from 'react-native-webview';

import { BRIDGE_RECEIVE_FN, buildInjectedScript } from './injected-script';
import { BridgeOptions, BridgeRequest, BridgeResponse } from './types';

const originOf = (url: string): string => {
  const match = /^(https?:\/\/[^/?#]+)/i.exec(url);
  return match ? match[1] : '';
};

/**
 * Wires a WebView to the native side: injects `window.NativeBridge` into trusted origins
 * and dispatches the messages it sends to the handlers given here.
 *
 * Spread the returned `webViewProps` onto the `<WebView />`.
 */
export const useWebViewBridge = ({
  allowedOrigins,
  context,
  bootstrap,
  handlers,
}: BridgeOptions) => {
  const ref = useRef<WebView>(null);

  // Handlers are recreated on every render by callers; reading them through a ref keeps
  // `onMessage` stable without forcing every caller to memoise.
  const handlersRef = useRef(handlers);
  handlersRef.current = handlers;

  const injectedJavaScriptBeforeContentLoaded = useMemo(
    () => buildInjectedScript({ allowedOrigins, context, bootstrap }),
    [allowedOrigins, context, bootstrap],
  );

  /** Pushes a message into the page. */
  const postToWeb = useCallback((message: BridgeResponse) => {
    const payload = JSON.stringify(JSON.stringify(message));
    ref.current?.injectJavaScript(
      `window.${BRIDGE_RECEIVE_FN} && window.${BRIDGE_RECEIVE_FN}(${payload}); true;`,
    );
  }, []);

  const onMessage = useCallback(
    async (event: WebViewMessageEvent) => {
      // The page URL is reported by the WebView itself, so a third-party page cannot
      // spoof its way into the handlers by posting a message.
      if (!allowedOrigins.includes(originOf(event.nativeEvent.url))) return;

      let request: BridgeRequest;
      try {
        request = JSON.parse(event.nativeEvent.data);
      } catch {
        return;
      }

      const handler = handlersRef.current[request.action];
      if (!handler) return;

      try {
        const result = await handler(request.payload);
        if (request.requestId) {
          postToWeb({
            action: request.action,
            requestId: request.requestId,
            payload: result,
          });
        }
      } catch (error) {
        if (request.requestId) {
          postToWeb({
            action: request.action,
            requestId: request.requestId,
            error:
              error instanceof Error ? error.message : 'Bridge handler failed',
          });
        }
      }
    },
    [allowedOrigins, postToWeb],
  );

  return {
    ref,
    postToWeb,
    webViewProps: {
      ref,
      onMessage,
      injectedJavaScriptBeforeContentLoaded,
      javaScriptEnabled: true,
    },
  };
};
