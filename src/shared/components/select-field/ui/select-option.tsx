import { FC } from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';

import { SelectIndicator } from '@/shared/icons';
import { useTheme } from '@/shared/theme';

import { SelectFieldOption } from '../types';

interface SelectOptionProps extends SelectFieldOption {
  onSelect?: (value: string) => void;
  isSelected: boolean;
  isLast?: boolean;
}

export const SelectOption: FC<SelectOptionProps> = ({
  value,
  label,
  isSelected,
  onSelect,
  isLast,
}) => {
  const { colors } = useTheme();

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
  label: {
    fontSize: 18,
    lineHeight: 22,
    fontWeight: 500,
    flex: 1,
  },
});
