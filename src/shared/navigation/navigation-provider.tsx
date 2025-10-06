import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { FC, ReactNode } from 'react';

import { colors } from '@/shared/theme';

export const NavigationProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  return (
    <NavigationContainer
      theme={{
        ...DefaultTheme,
        colors: { ...DefaultTheme.colors, background: colors.backgroundMain },
      }}
    >
      {children}
    </NavigationContainer>
  );
};
