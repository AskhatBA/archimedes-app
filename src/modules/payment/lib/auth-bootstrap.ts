import { WEB_AUTH_STORAGE_KEY, WEB_AUTH_STORAGE_VERSION } from '../constants';

/**
 * JS that seeds the web dashboard's persisted auth store with the app's access token.
 *
 * Runs before the page's own scripts, so the store hydrates already authenticated and the
 * very first API call carries a Bearer token. The token deliberately travels in injected
 * script rather than the URL — query strings end up in history and server logs.
 */
export const buildAuthBootstrap = (accessToken: string): string => `
  window.localStorage.setItem(
    ${JSON.stringify(WEB_AUTH_STORAGE_KEY)},
    JSON.stringify({
      state: { token: ${JSON.stringify(accessToken)} },
      version: ${WEB_AUTH_STORAGE_VERSION},
    })
  );
`;
