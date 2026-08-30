import { focusManager } from '@tanstack/react-query';
import { AppState, AppStateStatus } from 'react-native';

/**
 * Teaches TanStack Query what "focused" means on a phone.
 *
 * Its focus manager is built around a browser's `visibilitychange`, so with nothing
 * listening it reports the app as focused forever: `refetchOnWindowFocus` never fires,
 * and polling queries keep hitting the network from the background. Wired to `AppState`
 * both behave — intervals stop when the app is backgrounded (queries default to
 * `refetchIntervalInBackground: false`) and every focused query refetches the moment the
 * user comes back, which is exactly when their data is most likely to have gone stale.
 *
 * Returns the unsubscribe function.
 */
export const subscribeQueryFocusToAppState = (): (() => void) => {
  const subscription = AppState.addEventListener(
    'change',
    (status: AppStateStatus) => {
      focusManager.setFocused(status === 'active');
    },
  );

  return () => subscription.remove();
};
