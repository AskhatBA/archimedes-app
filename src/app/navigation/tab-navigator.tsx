import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { AppointmentsMainScreen } from '@/modules/appointment/screens/main';
import { HomeScreen } from '@/modules/home/screens/home';
import { NotificationsScreen } from '@/modules/notifications/screens/notifications';
import { ProfileScreen } from '@/modules/profile/screens/profile';
import { BottomTabBar } from '@/shared/components/bottom-tab-bar';
import { routes } from '@/shared/navigation';

import type { FC } from 'react';

const Tab = createBottomTabNavigator();

export const TabNavigator: FC = () => {
  return (
    <Tab.Navigator initialRouteName={routes.Home} tabBar={BottomTabBar}>
      <Tab.Screen
        name={routes.Home}
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name={routes.AppointmentsMain}
        component={AppointmentsMainScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name={routes.Notifications}
        component={NotificationsScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name={routes.Profile}
        component={ProfileScreen}
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
};
