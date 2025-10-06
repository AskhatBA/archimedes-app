import { FC, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Calendar as RNCalendar } from 'react-native-calendars';

import { formatDate, addMonths, subtractMonths } from '@/shared/adapters/date';
import { useTheme } from '@/shared/theme';

import { CalendarHeader } from './calendar-header';

interface CalendarProps {
  value: string;
  onChange?: (value: string) => void;
}

export const Calendar: FC<CalendarProps> = ({ value, onChange }) => {
  const INITIAL_DATE = formatDate(new Date(), 'YYYY-MM-DD');
  const { colors } = useTheme();
  const [currentMonth, setCurrentMonth] = useState(INITIAL_DATE);

  return (
    <View style={styles.container}>
      <RNCalendar
        onDayPress={day => {
          if (onChange) onChange(day.dateString);
        }}
        markedDates={{
          [value]: {
            selected: true,
            disableTouchEvent: true,
          },
        }}
        initialDate={currentMonth}
        customHeader={() => (
          <CalendarHeader
            selected={currentMonth}
            onPrev={() =>
              setCurrentMonth(prevState => subtractMonths(prevState, 1))
            }
            onNext={() => setCurrentMonth(prevState => addMonths(prevState, 1))}
          />
        )}
        style={[styles.calendar, { backgroundColor: colors.gray['200'] }]}
        theme={{
          backgroundColor: colors.gray['200'],
          calendarBackground: colors.gray['200'],
          todayTextColor: colors.blue['400'],
          selectedDayTextColor: colors.white,
          selectedDayBackgroundColor: colors.blue['400'],
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  calendar: {
    borderRadius: 15,
  },
});
