import dayjs from 'dayjs';
import { FC, useEffect } from 'react';
import { View, StyleSheet, Text, ActivityIndicator } from 'react-native';

import { MISAppointmentHistory } from '@/api';
import { useAppointmentsHistory } from '@/modules/appointment';
import { useTheme } from '@/shared/theme';

import { AppointmentCard, AppointmentCardColors } from './appointment-card';

export const Appointments: FC<{ startDate: string }> = () => {
  const { colors } = useTheme();
  const { appointmentsHistory, loadingAppointmentsHistory } =
    useAppointmentsHistory();

  const separatorColors = {
    blue: colors.blue['500'],
    orange: colors.orange['600'],
    green: colors.green['600'],
  };

  useEffect(() => {
    console.log('appointmentsHistory: ', appointmentsHistory);
  }, [appointmentsHistory]);

  const separatorTypes = Object.keys(separatorColors);

  if (loadingAppointmentsHistory)
    return (
      <View style={{ marginTop: 64 }}>
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    );

  if (!appointmentsHistory?.length)
    return (
      <View style={styles.noAppointmentsContainer}>
        <Text style={styles.noAppointmentsText}>
          Записи на прием отсутствуют
        </Text>
      </View>
    );

  const now = dayjs();
  const groupedAppointments = appointmentsHistory.reduce(
    (acc, appointment) => {
      const day = dayjs(appointment.startTime).format('DD MMM YYYY');
      if (!acc[day]) {
        acc[day] = [];
      }
      acc[day].push(appointment);
      return acc;
    },
    {} as Record<string, MISAppointmentHistory[]>,
  );

  return (
    <View style={styles.container}>
      {Object.entries(groupedAppointments)
        .sort(
          ([timeA], [timeB]) =>
            dayjs(timeB, 'DD MMM YYYY').valueOf() -
            dayjs(timeA, 'DD MMM YYYY').valueOf(),
        )
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
                {appointmentList.map(appointment => {
                  const appointmentTime = dayjs(appointment.startTime);
                  const isAppointmentPast = appointmentTime.isBefore(now);

                  return (
                    <AppointmentCard
                      color={currentSeparatorType as AppointmentCardColors}
                      key={appointment.id}
                      appointmentId={appointment.id}
                      date={appointment.startTime}
                      doctorName={appointment.doctor.name}
                      branchName={appointment.branch.name}
                      branchAddress={appointment.branch.address}
                      appointmentType={appointment.appointmentType}
                      isPast={isAppointmentPast}
                    />
                  );
                })}
              </View>
            </View>
          );
        })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    marginHorizontal: 16,
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
