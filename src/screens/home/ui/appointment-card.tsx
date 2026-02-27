import { FC } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

import { formatDate, getDayOfWeek, getTimeOfDay } from '@/shared/lib/date';
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
      style={[
        styles.container,
        {
          backgroundColor: colors.blue['100'],
        },
      ]}
      activeOpacity={0.9}
    >
      <View
        style={[styles.dateContainer, { backgroundColor: colors.gray['50'] }]}
      >
        <Text style={[styles.date, { color: colors.blue['400'] }]}>
          {formatDate(date, 'DD.MM')}
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
    borderRadius: 16,
    padding: 16,
    gap: 16,
    width: '100%',
  },
  doctorName: {
    fontSize: 16,
    lineHeight: 20,
    fontWeight: 700,
    marginTop: 12,
    marginBottom: 4,
  },
  specialization: {
    fontWeight: '400' as any,
    fontSize: 13,
    lineHeight: 18,
  },
  dateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 62,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 12,
  },
  date: {
    fontSize: 12,
    fontWeight: 700,
    lineHeight: 25,
  },
  dayOfWeek: {
    fontSize: 14,
    fontWeight: 700,
    lineHeight: 25,
    textTransform: 'capitalize',
  },
  timeContainer: {
    flexDirection: 'row',
    gap: 4,
  },
  timeOfDay: {
    fontSize: 13,
    lineHeight: 20,
  },
  time: {
    fontSize: 14,
    fontWeight: 600,
    lineHeight: 20,
  },
});
