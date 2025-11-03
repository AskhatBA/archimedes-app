import { FC } from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';

import { useTheme } from '@/shared/theme';

interface TimeSlotsProps {
  slots: string[];
  value?: string;
  onChange?: (slot: string) => void;
}

export const TimeSlots: FC<TimeSlotsProps> = ({ slots, value, onChange }) => {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      {slots.map(slot => {
        const isSelected = value === slot;
        return (
          <TouchableOpacity
            key={slot}
            style={[
              styles.slot,
              {
                backgroundColor: isSelected
                  ? colors.blue['100']
                  : colors.gray['200'],
              },
            ]}
            activeOpacity={0.8}
            onPress={() => onChange && onChange(slot)}
          >
            <Text
              style={[
                styles.slotText,
                {
                  color: isSelected ? colors.blue['400'] : colors.gray['500'],
                },
              ]}
            >
              {slot}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  slot: {
    width: 90,
    borderRadius: 15,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  slotText: {
    fontSize: 18,
    lineHeight: 22,
    fontWeight: 600,
  },
});
