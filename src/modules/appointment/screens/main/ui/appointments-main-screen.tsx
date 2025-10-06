import { FC } from 'react';
import { StyleSheet, ScrollView } from 'react-native';

import { Button } from '@/shared/components/button';
import { MainLayout } from '@/shared/layout/main-layout';
import { useNavigation, routes } from '@/shared/navigation';

import { MyAppointments } from '../components/my-appointments';

export const AppointmentsMainScreen: FC = () => {
  const { navigate } = useNavigation();

  return (
    <ScrollView style={styles.wrapper}>
      <MainLayout>
        <Button
          onPress={() => {
            navigate(routes.CreateAppointment);
          }}
        >
          Записаться на прием
        </Button>
        <MyAppointments />
      </MainLayout>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  content: {
    flex: 1,
    gap: 24,
  },
});
