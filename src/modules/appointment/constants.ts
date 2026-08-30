/**
 * How often the appointment lists re-read MIS while their screen is open.
 *
 * These lists are proxied live from MIS, so they are the only place a patient sees the
 * front desk cancelling a visit, a request being approved, or a paid booking appearing
 * once its payment settles — none of which the app is notified about. A minute keeps the
 * status honest without turning an open screen into a load generator: polling is already
 * limited to the focused screen of a foregrounded app.
 */
export const APPOINTMENTS_REFRESH_INTERVAL_MS = 40_000;
