import { QueryClient } from '@tanstack/react-query';

/**
 * Shared QueryClient singleton so non-React modules (e.g. the auth context's
 * unlock flow) can invalidate cached queries after the session is refreshed.
 */
export const queryClient = new QueryClient();

export { subscribeQueryFocusToAppState } from './app-focus';
