import { FC } from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { CalendarIcon } from '@/shared/icons';
import { useTheme } from '@/shared/theme';

import { Appointments } from './appointments';
import { DaySelector } from './day-selector';

export const MyAppointments: FC = () => {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <View style={styles.heading}>
        <Text style={[styles.title, { color: colors.gray['700'] }]}>
          Мои записи
        </Text>
        <CalendarIcon />
      </View>
      <DaySelector />
      <Appointments />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 50,
  },
  heading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontWeight: '700',
    fontSize: 18,
    lineHeight: 22,
  },
});
