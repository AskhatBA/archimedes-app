import { useIsFocused } from '@react-navigation/native';
import { useEffect, useRef } from 'react';

/**
 * A `refetchInterval` that only ticks while its screen is the one being looked at.
 *
 * Screens stay mounted behind the tab bar and under whatever is pushed on top of them, so
 * a plain interval keeps polling for lists nobody can see. Pairs with the app-state focus
 * manager: that stops polling when the app is backgrounded, this stops it when the screen
 * is not the one in front.
 */
export const useScreenRefetchInterval = (
  intervalMs: number,
): number | false => {
  const isFocused = useIsFocused();
  return isFocused ? intervalMs : false;
};

/**
 * Reads a query again the moment its screen comes back into view.
 *
 * Without it, coming back to a screen whose polling was paused means looking at whatever
 * was on it when it was left until the next tick — which is the stale status this polling
 * exists to avoid. Deliberately silent on the first render: the query fetches on mount.
 */
export const useRefetchOnScreenFocus = (refetch: () => unknown) => {
  const isFocused = useIsFocused();
  const wasFocused = useRef(isFocused);

  useEffect(() => {
    if (isFocused && !wasFocused.current) refetch();
    wasFocused.current = isFocused;
  }, [isFocused, refetch]);
};
