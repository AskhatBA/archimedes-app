import {
  TabBarAppointmentsIcon,
  TabBarProfileIcon,
  TabBarNotificationsIcon,
  TabBarHomeIcon,
} from '@/shared/icons';
import { routes } from '@/shared/navigation';

import { TabBarItemType } from './types';

export const navigationItems: Record<string, TabBarItemType> = {
  [routes.Home]: {
    Icon: TabBarHomeIcon,
    label: 'Home',
  },
  [routes.AppointmentsMain]: {
    Icon: TabBarAppointmentsIcon,
    label: 'Appointments',
  },
  [routes.Notifications]: {
    Icon: TabBarNotificationsIcon,
    label: 'NotificationsScreen',
  },
  [routes.Profile]: {
    Icon: TabBarProfileIcon,
    label: 'Profile',
  },
};
