import { FC } from 'react';

export interface TabBarItemType {
  Icon: FC<{ color: string }>;
  label: string;
}

export interface NavigationRoute {
  name: string;
  params: Readonly<object | undefined>;
  key: string;
}
