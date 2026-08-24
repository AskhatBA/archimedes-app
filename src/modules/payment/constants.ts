/** Actions the payment web page may invoke on the native side. */
export const PAYMENT_BRIDGE_ACTIONS = {
  /** Page finished booting; nothing to do beyond hiding the loader. */
  ready: 'payment:ready',
  /** Close the payment screen and go back. */
  close: 'payment:close',
  /** Show a native toast: `{ message, type }`. */
  toast: 'payment:toast',
  /** Set the native screen title: `{ title }`. */
  setTitle: 'payment:set-title',
  /** Payment reached a final state: `{ status, paymentId, amount }`. */
  result: 'payment:result',
} as const;

/**
 * Storage key the web dashboard's zustand auth store persists under.
 *
 * Seeding it before the page boots is what stops the web app from firing unauthenticated
 * requests and getting a 401. It couples the app to the dashboard's persist key — if that
 * store is renamed or its persist `version` bumped, update this too.
 */
export const WEB_AUTH_STORAGE_KEY = 'auth-store';
export const WEB_AUTH_STORAGE_VERSION = 0;

/** Fixed amount used by the profile test entry point until a real top-up UI exists. */
export const TEST_PAYMENT_AMOUNT = 5102;
