import { FC } from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';

import { SelectIndicator } from '@/shared/icons';
import { useTheme } from '@/shared/theme';

interface CheckboxProps {
  checked?: boolean;
  onCheck?: (checked: boolean) => void;
  error?: string | boolean;
}

export const Checkbox: FC<CheckboxProps> = ({ checked, onCheck, error }) => {
  const { colors } = useTheme();

  const borderColor = () => {
    if (error) return colors.error;
    if (checked) return colors.blue['400'];
    return colors.gray['250'];
  };

  return (
    <TouchableOpacity
      onPress={() => onCheck(!checked)}
      style={[
        styles.container,
        {
          backgroundColor: checked ? colors.blue['400'] : colors.gray['250'],
          borderColor: borderColor(),
        },
      ]}
    >
      {checked && (
        <SelectIndicator width={16} height={16} color={colors.white} />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 20,
    height: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderStyle: 'solid',
  },
});
