import { createStackNavigator } from '@react-navigation/stack';
import { type FC } from 'react';

import { CreateAppointmentScreen } from '@/modules/appointment/screens/create-appointment';
import { SignInScreen } from '@/modules/auth/screens/sign-in';
import { SecondaryTopbar } from '@/shared/components/secondary-topbar';
import { routes } from '@/shared/navigation';

import { TabNavigator } from './tab-navigator';

const RootStack = createStackNavigator();

export const RootNavigator: FC = () => {
  return (
    <RootStack.Navigator id={undefined} initialRouteName={routes.SignIn}>
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
      <RootStack.Screen
        name={routes.CreateAppointment}
        component={CreateAppointmentScreen}
        options={{ header: () => <SecondaryTopbar title="Запись на прием" /> }}
      />
    </RootStack.Navigator>
  );
};
