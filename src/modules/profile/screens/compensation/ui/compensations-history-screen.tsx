import { FC } from 'react';

import { MainLayout } from '@/shared/layout/main-layout';

import { History } from '../components/history';

export const CompensationsHistoryScreen: FC = () => {
  return (
    <MainLayout>
      <History />
    </MainLayout>
  );
};
