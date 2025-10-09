import { FC } from 'react';

export interface TabBarItemType {
  Icon: FC<{ color: string; width?: number; height?: number }>;
  label: string;
}

export interface NavigationRoute {
  name: string;
  params: Readonly<object | undefined>;
  key: string;
}
