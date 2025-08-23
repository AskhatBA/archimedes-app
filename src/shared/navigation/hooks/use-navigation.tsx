import { useNavigation as useReactNativeNavigation } from '@react-navigation/native';

import { Routes } from '../types';

export const useNavigation = () => {
  const {
    navigate: nativeNavigate,
    canGoBack,
    reset,
    goBack: nativeGoBack,
  } = useReactNativeNavigation();

  const navigate = (
    routeName: Routes,
    params?: Record<string, string | number>,
  ) => {
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
