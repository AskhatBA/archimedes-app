import {
  TabBarAppointmentsIcon,
  TabBarProfileIcon,
  TabBarHomeIcon,
  ShieldPlusIcon,
  BanknoteArrowDown,
} from '@/shared/icons';
import { routes } from '@/shared/navigation';

import { TabBarItemType } from './types';

export const navigationItems: Record<string, TabBarItemType> = {
  [routes.Home]: {
    Icon: TabBarHomeIcon,
    labelKey: 'tabs:home',
  },
  [routes.AppointmentsMain]: {
    Icon: TabBarAppointmentsIcon,
    labelKey: 'tabs:appointments',
  },
  [routes.Programs]: {
    Icon: ShieldPlusIcon,
    labelKey: 'tabs:programs',
  },
  [routes.Compensation]: {
    Icon: BanknoteArrowDown,
    labelKey: 'tabs:compensation',
  },
  [routes.Profile]: {
    Icon: TabBarProfileIcon,
    labelKey: 'tabs:profile',
  },
};
