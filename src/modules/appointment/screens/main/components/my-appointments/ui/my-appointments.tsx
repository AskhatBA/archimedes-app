import dayjs from 'dayjs';
import { FC, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { CalendarIcon } from '@/shared/icons';
import { useTheme } from '@/shared/theme';

import { Appointments } from './appointments';

export const MyAppointments: FC = () => {
  const [date, setDate] = useState(dayjs());
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <View style={styles.heading}>
        <Text style={[styles.title, { color: colors.gray['700'] }]}>
          Мои записи
        </Text>
        <CalendarIcon />
      </View>
      <Appointments startDate={date.format('YYYY-MM-DD')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
    marginHorizontal: -32,
  },
  heading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
  },
  title: {
    fontWeight: '700',
    fontSize: 18,
    lineHeight: 22,
  },
});
