import { FC } from 'react';
import { SafeAreaView, StyleSheet, ScrollView } from 'react-native';

import { Button } from '@/shared/components/button';
import { MainLayout } from '@/shared/layout/main-layout';

import { MyAppointments } from '../components/my-appointments';

export const AppointmentsMainScreen: FC = () => {
  return (
    <SafeAreaView style={styles.wrapper}>
      <ScrollView style={styles.wrapper}>
        <MainLayout>
          <Button>Записаться на прием</Button>
          <MyAppointments />
        </MainLayout>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
  },
  content: {
    flex: 1,
    gap: 24,
  },
});
