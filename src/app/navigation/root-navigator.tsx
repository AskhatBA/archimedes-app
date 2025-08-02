import { createStackNavigator } from '@react-navigation/stack';
import { type FC } from 'react';

import { SignInScreen } from '@/modules/auth/screens/sign-in';
import { routes } from '@/shared/navigation';

import { TabNavigator } from './tab-navigator';

const RootStack = createStackNavigator();

export const RootNavigator: FC = () => {
  return (
    <RootStack.Navigator id={undefined} initialRouteName={routes.TabNavigation}>
      <RootStack.Screen
        name={routes.SignIn}
        component={SignInScreen}
        options={{ headerShown: false }}
      />
      <RootStack.Screen
        name={routes.TabNavigation}
        component={TabNavigator}
        options={{ headerShown: false }}
      />
    </RootStack.Navigator>
  );
};
