import {
  DefaultTheme,
  NavigationContainer,
  useNavigationContainerRef,
} from '@react-navigation/native';
import { FC, ReactNode, useRef } from 'react';

import { logScreenView } from '@/shared/lib/analytics';
import { colors } from '@/shared/theme';

export const NavigationProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const navigationRef = useNavigationContainerRef();
  const currentRouteName = useRef<string | undefined>(undefined);

  // Firebase's own screen reporting is off (firebase.json): natively the whole app is one
  // view controller / activity, so the screens are only known here.
  const trackScreen = () => {
    const routeName = navigationRef.getCurrentRoute()?.name;

    if (routeName && routeName !== currentRouteName.current) {
      logScreenView(routeName);
    }

    currentRouteName.current = routeName;
  };

  return (
    <NavigationContainer
      ref={navigationRef}
      onReady={trackScreen}
      onStateChange={trackScreen}
      theme={{
        ...DefaultTheme,
        colors: { ...DefaultTheme.colors, background: colors.backgroundMain },
      }}
    >
      {children}
    </NavigationContainer>
  );
};
