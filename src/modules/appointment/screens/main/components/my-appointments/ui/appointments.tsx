import dayjs from 'dayjs';
import { FC } from 'react';
import { View, StyleSheet, Text, ActivityIndicator } from 'react-native';

import { MISAppointment } from '@/api';
import { useAppointments } from '@/modules/appointment/hooks/use-appointments';
import { useTheme } from '@/shared/theme';

import { AppointmentCard, AppointmentCardColors } from './appointment-card';

export const Appointments: FC = () => {
  const { colors } = useTheme();
  const { appointments, loadingAppointments } = useAppointments();

  const separatorColors = {
    blue: colors.blue['500'],
    orange: colors.orange['600'],
    green: colors.green['600'],
  };

  const separatorTypes = Object.keys(separatorColors);

  if (loadingAppointments)
    return (
      <View style={{ marginTop: 64 }}>
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    );

  if (!appointments?.length)
    return (
      <View style={styles.noAppointmentsContainer}>
        <Text style={styles.noAppointmentsText}>
          Записи на прием отсутствуют
        </Text>
      </View>
    );

  const groupedAppointments = appointments.reduce(
    (acc, appointment) => {
      const hour = dayjs(appointment.start_time).format('HH:00');
      if (!acc[hour]) {
        acc[hour] = [];
      }
      acc[hour].push(appointment);
      return acc;
    },
    {} as Record<string, MISAppointment[]>,
  );

  return (
    <View style={styles.container}>
      {Object.entries(groupedAppointments)
        .sort(([timeA], [timeB]) => timeA.localeCompare(timeB))
        .map(([time, appointmentList], index) => {
          const currentSeparatorType =
            separatorTypes[index % separatorTypes.length];
          const currentSeparatorColor = separatorColors[currentSeparatorType];

          return (
            <View key={time} style={styles.timeSection}>
              <View style={styles.timeIndicatorContainer}>
                <Text
                  style={[styles.timeHeader, { color: currentSeparatorColor }]}
                >
                  {time}
                </Text>
                <View
                  style={[
                    styles.timeIndicatorDot,
                    { backgroundColor: currentSeparatorColor },
                  ]}
                />
                <View
                  style={[
                    styles.timeIndicatorLine,
                    { backgroundColor: currentSeparatorColor },
                  ]}
                />
              </View>
              <View style={styles.appointments}>
                {appointmentList.map(appointment => (
                  <AppointmentCard
                    color={currentSeparatorType as AppointmentCardColors}
                    key={appointment.id}
                    date={appointment.start_time}
                    doctorName={appointment.doctor_name}
                    specialization={appointment.branch_name}
                  />
                ))}
              </View>
            </View>
          );
        })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
  },
  appointments: {
    gap: 8,
  },
  timeSection: {
    marginBottom: 16,
  },
  noAppointmentsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
  },
  noAppointmentsText: {
    fontSize: 16,
    color: '#666',
  },
  timeHeader: {
    fontSize: 15,
    fontWeight: 700,
    lineHeight: 22,
  },
  timeIndicatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeIndicatorDot: {
    width: 8,
    borderRadius: 8,
    height: 8,
    marginLeft: 8,
  },
  timeIndicatorLine: {
    flex: 1,
    height: 1,
  },
});
