import { FC, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text } from 'react-native';

import { BookingSuccessPopup } from '@/shared/components/booking-success-popup';
import { FindSpecialistBanner } from '@/shared/components/find-specialist-banner';
import { MainLayout } from '@/shared/layout/main-layout';
import { useTheme } from '@/shared/theme';

import { CreateAppointmentContextProvider } from '../context/create-appointment-context';
import { CreateAppointmentForm } from '../forms/create-appointment-form';

export const CreateAppointmentScreen: FC = () => {
  const { colors } = useTheme();

  return (
    <SafeAreaView style={styles.wrapper}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <MainLayout>
          <FindSpecialistBanner />
          <Text style={[styles.title, { color: colors.textMain }]}>
            Запись на прием
          </Text>
          <CreateAppointmentContextProvider>
            <CreateAppointmentForm />
          </CreateAppointmentContextProvider>
        </MainLayout>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  scrollContainer: {},
  title: {
    marginTop: 40,
    fontSize: 24,
    lineHeight: 22,
    fontWeight: 700,
    letterSpacing: 0,
  },
});
