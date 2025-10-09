import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View } from 'react-native';

import { AppointmentsMainScreen } from '@/modules/appointment/screens/main';
import { HomeScreen } from '@/modules/home/screens/home';
import { NotificationsScreen } from '@/modules/notifications/screens/notifications';
import { ProfileScreen } from '@/modules/profile/screens/profile';
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
        name={routes.Notifications}
        component={NotificationsScreen}
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
