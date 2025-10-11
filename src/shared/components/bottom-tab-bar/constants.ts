import {
  TabBarAppointmentsIcon,
  TabBarProfileIcon,
  TabBarNotificationsIcon,
  TabBarHomeIcon,
  ShieldPlusIcon,
  BanknoteArrowDown,
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
  [routes.Insurance]: {
    Icon: ShieldPlusIcon,
    label: 'Страховка',
  },
  [routes.Compensation]: {
    Icon: BanknoteArrowDown,
    label: 'Возмещение',
  },
  [routes.Profile]: {
    Icon: TabBarProfileIcon,
    label: 'Профиль',
  },
};
