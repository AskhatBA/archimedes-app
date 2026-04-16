import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { AppointmentsScreen } from '@/screens/appointments';
import { CompensationScreen } from '@/screens/compensation';
import { HomeScreen } from '@/screens/home';
import { ProfileScreen } from '@/screens/profile';
import { ProgramsScreen } from '@/screens/programs';
import { BottomTabBar } from '@/shared/components/bottom-tab-bar';
import { TabTopBar } from '@/shared/components/tab-top-bar';
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
        options={{ header: () => <TabTopBar variant="greeting" /> }}
      />
      <Tab.Screen
        name={routes.AppointmentsMain}
        component={AppointmentsScreen}
        options={{ header: () => <TabTopBar title="Записи" /> }}
      />
      <Tab.Screen
        name={routes.Programs}
        component={ProgramsScreen}
        options={{ header: () => <TabTopBar title="Программы" /> }}
      />
      <Tab.Screen
        name={routes.Compensation}
        component={CompensationScreen}
        options={{ header: () => <TabTopBar title="Возмещение" /> }}
      />
      <Tab.Screen
        name={routes.Profile}
        component={ProfileScreen}
        options={{ header: () => <TabTopBar variant="greeting" /> }}
      />
    </Tab.Navigator>
  );
};
