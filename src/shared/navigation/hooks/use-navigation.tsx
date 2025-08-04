import { useNavigation as useReactNativeNavigation } from '@react-navigation/native';

import { Routes } from '../types';

export const useNavigation = () => {
  const {
    navigate: nativeNavigate,
    canGoBack,
    goBack: nativeGoBack,
  } = useReactNativeNavigation();

  const navigate = (routeName: Routes) => {
    nativeNavigate(routeName as never);
  };

  const goBack = () => {
    if (canGoBack()) {
      nativeGoBack();
    }
  };

  return {
    navigate,
    goBack,
  };
};
