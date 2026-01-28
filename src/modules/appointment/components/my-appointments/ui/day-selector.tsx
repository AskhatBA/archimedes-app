import dayjs from 'dayjs';
import { FC } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

import { useTheme } from '@/shared/theme';

const NUM_OF_DAYS = 11;

interface DaySelectorProps {
  value: dayjs.Dayjs;
  onChange: (value: dayjs.Dayjs) => void;
}

export const DaySelector: FC<DaySelectorProps> = ({ value, onChange }) => {
  const { colors } = useTheme();

  const days = Array.from({ length: NUM_OF_DAYS }, (_, index) => {
    const date = dayjs().add(index, 'day');
    return {
      date: date.date(),
      dayOfWeek: date.format('dd'),
      fullDate: date,
    };
  });

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        contentContainerStyle={styles.daysWrapper}
        showsHorizontalScrollIndicator={false}
      >
        {days.map(day => (
          <TouchableOpacity
            key={day.fullDate.toString()}
            style={[
              styles.dayContainer,
              {
                backgroundColor:
                  value.format('YYYY-MM-DD') ===
                  day.fullDate.format('YYYY-MM-DD')
                    ? colors.blue['150']
                    : colors.gray['200'],
              },
            ]}
            onPress={() => onChange(day.fullDate)}
          >
            <Text
              style={[
                styles.date,
                {
                  color:
                    value.format('YYYY-MM-DD') ===
                    day.fullDate.format('YYYY-MM-DD')
                      ? colors.blue['400']
                      : colors.gray['250'],
                },
              ]}
            >
              {day.date}
            </Text>
            <Text
              style={[
                styles.dayOfWeek,
                {
                  color:
                    value.format('YYYY-MM-DD') ===
                    day.fullDate.format('YYYY-MM-DD')
                      ? colors.blue['400']
                      : colors.gray['250'],
                },
              ]}
            >
              {day.dayOfWeek}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  daysWrapper: {
    marginTop: 20,
    gap: 15,
    paddingHorizontal: 24,
  },
  date: {
    fontSize: 24,
    fontWeight: 700,
    lineHeight: 25,
  },
  dayOfWeek: {
    fontSize: 18,
    fontWeight: 600,
    lineHeight: 25,
    textTransform: 'capitalize',
  },
  dayContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
    width: 70,
    height: 82,
  },
});
