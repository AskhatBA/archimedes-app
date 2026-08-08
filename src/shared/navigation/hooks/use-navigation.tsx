import { useNavigation as useReactNativeNavigation } from '@react-navigation/native';

import { Routes } from '../types';

export const useNavigation = () => {
  const {
    navigate: nativeNavigate,
    canGoBack,
    reset,
    goBack: nativeGoBack,
  } = useReactNativeNavigation();

  // Params are structured data, not just scalars — screens like the second
  // registration step receive a whole prefill object.
  const navigate = (routeName: Routes, params?: Record<string, unknown>) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    nativeNavigate(routeName as never, params as never);
  };

  const goBack = () => {
    if (canGoBack()) {
      nativeGoBack();
    }
  };

  const resetNavigation = (routeName: Routes) => {
    reset({
      index: 0,
      routes: [{ name: routeName as never }],
    });
  };

  return {
    navigate,
    goBack,
    resetNavigation,
  };
};
