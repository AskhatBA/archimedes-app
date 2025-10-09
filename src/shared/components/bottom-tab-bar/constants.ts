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
    label: 'Главная',
  },
  [routes.AppointmentsMain]: {
    Icon: TabBarAppointmentsIcon,
    label: 'Записи',
  },
  [routes.Notifications]: {
    Icon: TabBarNotificationsIcon,
    label: 'Уведомл-я',
  },
  [routes.Profile]: {
    Icon: TabBarProfileIcon,
    label: 'Профиль',
  },
};
