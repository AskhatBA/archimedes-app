import { useIsFetching, useQueryClient } from '@tanstack/react-query';
import { FC } from 'react';
import { ScrollView, StyleSheet, RefreshControl, View } from 'react-native';

import { Appointments } from '@/modules/appointment';
import { usePageHeader } from '@/shared/hooks';
import { MainLayout } from '@/shared/layout/main-layout';

export const AppointmentHistoryScreen: FC = () => {
  usePageHeader({ title: 'История записей' });

  const queryClient = useQueryClient();
  const isFetchingAppointments = useIsFetching({
    queryKey: ['appointments-history'],
  });

  const onRefresh = () => {
    queryClient.refetchQueries({ queryKey: ['appointments-history'] });
  };

  return (
    <ScrollView
      refreshControl={
        <RefreshControl
          refreshing={!!isFetchingAppointments}
          onRefresh={onRefresh}
        />
      }
    >
      <MainLayout>
        <Appointments mode="past" />
      </MainLayout>
    </ScrollView>
  );
};
