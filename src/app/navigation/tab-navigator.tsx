import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { AppointmentsMainScreen } from '@/modules/appointment';
import { HomeScreen } from '@/modules/home';
import { CompensationScreen } from '@/modules/insurance';
import { InsuranceScreen } from '@/screens/insurance';
import { ProfileScreen } from '@/screens/profile';
import { BottomTabBar } from '@/shared/components/bottom-tab-bar';
import { StatusBarUnderlay } from '@/shared/components/status-bar-underlay';
import { routes } from '@/shared/navigation';

import type { FC } from 'react';

const Tab = createBottomTabNavigator();

export const TabNavigator: FC = () => {
  return (
    <Tab.Navigator
      id={undefined}
      initialRouteName={routes.Home}
      tabBar={props => <BottomTabBar {...props} />}
    >
      <Tab.Screen
        name={routes.Home}
        component={HomeScreen}
        options={{ header: () => <StatusBarUnderlay /> }}
      />
      <Tab.Screen
        name={routes.AppointmentsMain}
        component={AppointmentsMainScreen}
        options={{ header: () => <StatusBarUnderlay /> }}
      />
      <Tab.Screen
        name={routes.Insurance}
        component={InsuranceScreen}
        options={{ header: () => <StatusBarUnderlay /> }}
      />
      <Tab.Screen
        name={routes.Compensation}
        component={CompensationScreen}
        options={{ header: () => <StatusBarUnderlay /> }}
      />
      <Tab.Screen
        name={routes.Profile}
        component={ProfileScreen}
        options={{ header: () => <StatusBarUnderlay /> }}
      />
    </Tab.Navigator>
  );
};
