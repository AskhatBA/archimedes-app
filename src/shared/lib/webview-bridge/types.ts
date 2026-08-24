/** A message the web page sends to the app. */
export interface BridgeRequest<TPayload = unknown> {
  /** Which native capability the page wants. */
  action: string;
  /** Present when the page awaits a reply; echoed back on the response. */
  requestId?: string;
  payload?: TPayload;
}

/** A message the app sends into the web page. */
export interface BridgeResponse<TPayload = unknown> {
  action: string;
  requestId?: string;
  payload?: TPayload;
  error?: string;
}

/**
 * Handles one action. A returned value (or resolved promise) is sent back to the page
 * when it used `request()`; throwing rejects that promise on the web side.
 */
export type BridgeHandler<TPayload = never> = (
  payload: TPayload,
) => unknown | Promise<unknown>;

// Handlers are stored heterogeneously, so each one is invoked through this looser shape.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type BridgeHandlers = Record<string, BridgeHandler<any>>;

export interface BridgeOptions {
  /**
   * Origins allowed to see the bridge and the injected context.
   *
   * The WebView keeps running the injected script across redirects, so a payment flow
   * that hands the user to a provider's domain would otherwise expose the auth token
   * to that domain. Only these origins get `window.NativeBridge`.
   */
  allowedOrigins: string[];
  /** Read-only data handed to the page, e.g. the auth token and platform. */
  context?: Record<string, unknown>;
  /** Extra JS run inside the origin guard, before the page's own scripts. */
  bootstrap?: string;
  handlers: BridgeHandlers;
}
