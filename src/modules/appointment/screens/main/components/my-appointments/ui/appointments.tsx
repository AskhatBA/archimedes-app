import dayjs from 'dayjs';
import { FC } from 'react';
import { View, StyleSheet, Text } from 'react-native';

import { useTheme } from '@/shared/theme';

import { data } from '../data';

import { AppointmentCard, AppointmentCardColors } from './appointment-card';

export const Appointments: FC = () => {
  const { colors } = useTheme();

  const separatorColors = {
    blue: colors.blue['500'],
    orange: colors.orange['600'],
    green: colors.green['600'],
  };

  const separatorTypes = Object.keys(separatorColors);

  const groupedAppointments = data.reduce(
    (acc, appointment) => {
      const hour = dayjs(appointment.date).format('HH:00');
      if (!acc[hour]) {
        acc[hour] = [];
      }
      acc[hour].push(appointment);
      return acc;
    },
    {} as Record<string, typeof data>,
  );

  return (
    <View style={styles.container}>
      {Object.entries(groupedAppointments)
        .sort(([timeA], [timeB]) => timeA.localeCompare(timeB))
        .map(([time, appointments], index) => {
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
                {appointments.map(appointment => (
                  <AppointmentCard
                    color={currentSeparatorType as AppointmentCardColors}
                    key={appointment.id}
                    date={appointment.date}
                    doctorName={`${appointment.doctor.lastName} ${appointment.doctor.firstName[0]}.`}
                    specialization={appointment.specialization.name}
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
