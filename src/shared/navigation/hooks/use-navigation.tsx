import { useNavigation as useReactNativeNavigation } from '@react-navigation/native';

import { Routes } from '../types';

export const useNavigation = () => {
  const { navigate: nativeNavigate } = useReactNativeNavigation();

  const navigate = (routeName: Routes) => {
    nativeNavigate(routeName as never);
  };

  return {
    navigate,
  };
};
