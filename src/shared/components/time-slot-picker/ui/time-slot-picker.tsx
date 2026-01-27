import dayjs from 'dayjs';
import React, { FC, useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { ArrowBackIcon } from '@/shared/icons';
import { colors, fonts } from '@/shared/theme';

import { TimeSlot, DaySlots } from '../types';

interface TimeSlotPickerProps {
  days: DaySlots[];
  selectedDate?: string;
  selectedTime?: string;
  onSelect: (date: string, time: string) => void;
  maxDays?: number;
}

const COLUMN_WIDTH = 60;
const COLUMN_GAP = 12;

export const TimeSlotPicker: FC<TimeSlotPickerProps> = ({
  days,
  selectedDate,
  selectedTime,
  onSelect,
  maxDays = 14,
}) => {
  const [startIndex, setStartIndex] = useState(0);
  const DAYS_PER_PAGE = 4;

  // Use useEffect to reset startIndex if it goes out of bounds when maxDays changes
  useEffect(() => {
    if (startIndex >= maxDays) {
      setStartIndex(0);
    }
  }, [maxDays, startIndex]);

  const visibleDays = useMemo(() => {
    const result: DaySlots[] = [];
    const today = dayjs().startOf('day');

    for (let i = 0; i < DAYS_PER_PAGE; i += 1) {
      const currentDate = today.add(startIndex + i, 'day');
      const dateStr = currentDate.format('YYYY-MM-DD');

      const foundDay = days.find(d => dayjs(d.date).isSame(currentDate, 'day'));

      if (foundDay) {
        result.push(foundDay);
      } else {
        result.push({
          date: dateStr,
          slots: [],
        });
      }
    }
    return result;
  }, [days, startIndex]);

  const formattedDays = useMemo(() => {
    return visibleDays.map(day => {
      const d = dayjs(day.date);
      const isToday = d.isSame(dayjs(), 'day');
      const isTomorrow = d.isSame(dayjs().add(1, 'day'), 'day');

      let dayLabel = d.format('dd').toLowerCase();
      const dateLabel = d.format('D MMM').replace('.', '');

      if (isToday) {
        dayLabel = 'сегодня';
      } else if (isTomorrow) {
        dayLabel = 'завтра';
      }

      return {
        ...day,
        dayLabel,
        dateLabel,
      };
    });
  }, [visibleDays]);

  const renderSlot = (slot: TimeSlot, date: string) => {
    const isSelected = selectedDate === date && selectedTime === slot.time;
    const isAvailable = slot.available;

    if (!isAvailable && !isSelected) {
      return (
        <View key={`${date}-${slot.time}`} style={styles.slotPlaceholder}>
          <View style={styles.placeholderLine} />
        </View>
      );
    }

    return (
      <TouchableOpacity
        key={`${date}-${slot.time}`}
        style={[
          styles.slot,
          isSelected && styles.slotSelected,
          !isAvailable && styles.slotDisabled,
        ]}
        disabled={!isAvailable}
        onPress={() => onSelect(date, slot.time)}
      >
        <Text
          style={[
            styles.slotText,
            isSelected && styles.slotTextSelected,
            !isAvailable && styles.slotTextDisabled,
          ]}
        >
          {slot.time}
        </Text>
      </TouchableOpacity>
    );
  };

  const handlePrev = () => {
    setStartIndex(Math.max(0, startIndex - DAYS_PER_PAGE));
  };

  const handleNext = () => {
    if (startIndex + DAYS_PER_PAGE < maxDays) {
      setStartIndex(startIndex + DAYS_PER_PAGE);
    }
  };

  const hasPrev = startIndex > 0;
  const hasNext = startIndex + DAYS_PER_PAGE < maxDays;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.prevButton}
          onPress={handlePrev}
          disabled={!hasPrev}
        >
          <View style={hasPrev ? styles.iconCircle : styles.disabledIconCircle}>
            <ArrowBackIcon
              width={20}
              height={20}
              color={hasPrev ? colors.blue[500] : colors.gray[300]}
            />
            {!hasPrev && <View style={styles.iconStrike} />}
          </View>
        </TouchableOpacity>

        <View style={styles.daysContainer}>
          {formattedDays.map((day, index) => (
            <View
              key={day.date}
              style={[
                styles.column,
                {
                  marginRight:
                    index === formattedDays.length - 1 ? 0 : COLUMN_GAP,
                },
              ]}
            >
              <View style={styles.dayHeader}>
                <Text
                  style={[
                    styles.dayLabel,
                    dayjs(day.date).isSame(dayjs(), 'day') &&
                      styles.activeDayLabel,
                  ]}
                >
                  {day.dayLabel}
                </Text>
                <Text
                  style={[
                    styles.dateLabel,
                    dayjs(day.date).isSame(dayjs(), 'day') &&
                      styles.activeDayLabel,
                  ]}
                >
                  {day.dateLabel}
                </Text>
              </View>

              <View style={styles.slotsContainer}>
                {day.slots.map(slot => renderSlot(slot, day.date))}
              </View>
            </View>
          ))}
        </View>

        <TouchableOpacity
          style={styles.nextButton}
          onPress={handleNext}
          disabled={!hasNext}
        >
          <View style={hasNext ? styles.iconCircle : styles.disabledIconCircle}>
            <View style={{ transform: [{ rotate: '180deg' }] }}>
              <ArrowBackIcon
                width={20}
                height={20}
                color={hasNext ? colors.blue[500] : colors.gray[300]}
              />
            </View>
            {!hasNext && <View style={styles.iconStrike} />}
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  daysContainer: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between',
  },
  column: {
    width: COLUMN_WIDTH,
    alignItems: 'center',
  },
  dayHeader: {
    alignItems: 'center',
    marginBottom: 16,
    height: 40,
    justifyContent: 'center',
  },
  dayLabel: {
    fontFamily: fonts.SFPro.Regular,
    fontSize: 13,
    color: colors.gray[500],
    textAlign: 'center',
  },
  dateLabel: {
    fontFamily: fonts.SFPro.Regular,
    fontSize: 14,
    color: colors.gray[500],
    textAlign: 'center',
  },
  activeDayLabel: {
    color: colors.blue[500],
    fontFamily: fonts.SFPro.Medium,
  },
  slotsContainer: {
    width: '100%',
  },
  slot: {
    width: '100%',
    height: 30,
    backgroundColor: colors.blue[400],
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  slotSelected: {
    backgroundColor: colors.blue[300],
  },
  slotDisabled: {
    backgroundColor: colors.gray[200],
  },
  slotText: {
    fontFamily: fonts.SFPro.Bold,
    fontSize: 12,
    color: colors.white,
  },
  slotTextSelected: {
    color: colors.blue[500],
  },
  slotTextDisabled: {
    color: colors.gray[500],
  },
  slotPlaceholder: {
    width: '100%',
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  placeholderLine: {
    width: 24,
    height: 1,
    backgroundColor: colors.textMain,
  },
  prevButton: {
    paddingTop: 8,
    zIndex: 1,
  },
  nextButton: {
    paddingTop: 8,
    zIndex: 1,
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.gray[200],
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.gray[200],
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.5,
  },
  iconStrike: {
    position: 'absolute',
    width: 20,
    height: 1,
    backgroundColor: colors.gray[300],
    transform: [{ rotate: '45deg' }],
  },
});
