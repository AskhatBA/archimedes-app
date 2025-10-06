import { FC } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';

import { useAppointments } from '@/modules/appointment/hooks/use-appointments';
import { globalStyles, useTheme } from '@/shared/theme';

import { AppointmentCard } from './appointment-card';

export const CurrentAppointments: FC = () => {
  const { colors } = useTheme();
  const { appointments, loadingAppointments } = useAppointments();

  const renderAppointments = () => {
    if (loadingAppointments) {
      return (
        <View style={styles.loaderContainer}>
          <ActivityIndicator color={colors.primary} />
        </View>
      );
    }

    if (!appointments?.length) {
      return (
        <View style={styles.noAppointmentsContainer}>
          <Text style={styles.noAppointmentsText}>
            Записи на прием отсутствуют
          </Text>
        </View>
      );
    }

    return (
      <ScrollView
        horizontal
        contentContainerStyle={styles.carouselContainer}
        showsHorizontalScrollIndicator={false}
      >
        {appointments.map(appointment => (
          <AppointmentCard
            key={appointment.id}
            doctorName={appointment.doctor_name}
            specialization={appointment.branch_name}
            date={appointment.start_time}
          />
        ))}
      </ScrollView>
    );
  };

  return (
    <View style={{ marginLeft: -32, marginRight: -32 }}>
      <Text style={[globalStyles.sectionHeading, { marginLeft: 32 }]}>
        Текущие записи
      </Text>
      {renderAppointments()}
    </View>
  );
};

const styles = StyleSheet.create({
  carouselContainer: {
    marginTop: 18,
    gap: 8,
    paddingLeft: 32,
    paddingRight: 32,
  },
  loaderContainer: {
    marginTop: 24,
  },
  noAppointmentsContainer: {
    marginTop: 24,
  },
  noAppointmentsText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
  },
});
