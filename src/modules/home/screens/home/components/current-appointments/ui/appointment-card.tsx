import { FC } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

import { formatDate, getDayOfWeek, getTimeOfDay } from '@/shared/adapters/date';
import { useTheme } from '@/shared/theme';

interface AppointmentCardProps {
  doctorName: string;
  specialization: string;
  date: string;
}

export const AppointmentCard: FC<AppointmentCardProps> = ({
  doctorName,
  specialization,
  date,
}) => {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: colors.blue['100'] }]}
    >
      <View
        style={[styles.dateContainer, { backgroundColor: colors.gray['50'] }]}
      >
        <Text style={[styles.date, { color: colors.blue['400'] }]}>
          {formatDate(date, 'DD')}
        </Text>
        <Text style={[styles.dayOfWeek, { color: colors.blue['400'] }]}>
          {getDayOfWeek(date, 'short')}
        </Text>
      </View>
      <View style={{ flexShrink: 1 }}>
        <View style={styles.timeContainer}>
          <Text style={[styles.timeOfDay, { color: colors.blue['400'] }]}>
            {getTimeOfDay(date)}
          </Text>
          <Text style={[styles.time, { color: colors.blue['400'] }]}>
            {formatDate(date, 'HH:mm')}
          </Text>
        </View>
        <Text
          style={[styles.doctorName, { color: colors.blue['400'] }]}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {doctorName}
        </Text>
        <Text style={[styles.specialization, { color: colors.blue['400'] }]}>
          {specialization}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: 20,
    padding: 16,
    gap: 16,
    maxWidth: 340,
  },
  doctorName: {
    fontSize: 14,
    lineHeight: 14,
    fontWeight: 700,
    marginTop: 12,
    marginBottom: 4,
  },
  specialization: {
    fontWeight: 300,
    fontSize: 12,
    lineHeight: 14,
  },
  dateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 62,
    borderRadius: 15,
    paddingVertical: 16,
    paddingHorizontal: 12,
  },
  date: {
    fontSize: 24,
    fontWeight: 700,
    lineHeight: 25,
  },
  dayOfWeek: {
    fontSize: 18,
    fontWeight: 700,
    lineHeight: 25,
    textTransform: 'capitalize',
  },
  timeContainer: {
    flexDirection: 'row',
    gap: 4,
  },
  timeOfDay: {
    fontSize: 14,
    lineHeight: 25,
  },
  time: {
    fontSize: 14,
    fontWeight: 600,
    lineHeight: 25,
  },
});
