import { FC } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

import { SelectIndicator } from '@/shared/icons';
import { colors } from '@/shared/theme';

import { SelectFieldOption } from '../types';

interface SelectOptionProps extends SelectFieldOption {
  onSelect?: (value: string) => void;
  isSelected: boolean;
  isLast?: boolean;
}

export const SelectOption: FC<SelectOptionProps> = ({
  value,
  label,
  subtitle,
  isSelected,
  onSelect,
  isLast,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          borderBottomWidth: isLast ? 0 : 1,
          borderBottomColor: colors.gray['250'],
        },
      ]}
      onPress={() => onSelect(value)}
    >
      <View style={styles.labelContainer}>
        <Text
          style={[
            styles.label,
            {
              color: isSelected ? colors.blue['400'] : colors.textMain,
            },
          ]}
        >
          {label}
        </Text>
        {subtitle && (
          <Text style={[styles.subtitle, { color: colors.gray['500'] }]}>
            {subtitle}
          </Text>
        )}
      </View>
      {isSelected && (
        <SelectIndicator
          width={24}
          height={24}
          color={colors.blue['400']}
          style={{ flexShrink: 0 }}
        />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    gap: 4,
  },
  labelContainer: {
    flex: 1,
    gap: 2,
  },
  label: {
    fontSize: 18,
    lineHeight: 22,
    fontWeight: 500,
  },
  subtitle: {
    fontSize: 13,
    lineHeight: 17,
    fontWeight: 400,
  },
});
