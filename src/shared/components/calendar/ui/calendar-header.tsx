import { FC } from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';

import { formatDate } from '@/shared/adapters/date';
import { ArrowBackIcon } from '@/shared/icons';
import { useTheme } from '@/shared/theme';

import { WEEK_DAYS } from '../constants';

interface CalendarHeaderProps {
  onPrev: () => void;
  onNext: () => void;
  selected: string;
}

export const CalendarHeader: FC<CalendarHeaderProps> = ({
  onPrev,
  onNext,
  selected,
}) => {
  const { colors } = useTheme();

  return (
    <View>
      <View style={styles.container}>
        <Text style={[styles.title, { color: colors.textMain }]}>
          {formatDate(selected, 'MMMM YYYY')}
        </Text>
        <View style={styles.controls}>
          <TouchableOpacity style={styles.controlButton} onPress={onPrev}>
            <ArrowBackIcon color={colors.textMain} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={onNext}
            style={[styles.nextButton, styles.controlButton]}
          >
            <ArrowBackIcon color={colors.textMain} />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.weekDays}>
        {WEEK_DAYS.map(weekDay => (
          <Text
            key={weekDay}
            style={[styles.weekDay, { color: colors.textMain }]}
          >
            {weekDay}
          </Text>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  title: {
    fontWeight: 700,
    fontSize: 16,
    textTransform: 'capitalize',
  },
  controlButton: {
    width: 25,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nextButton: {
    transform: [{ rotate: '180deg' }],
  },
  weekDays: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  weekDay: {
    fontWeight: 500,
    fontSize: 14,
  },
});
