import { FC } from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';

import { SelectIndicator } from '@/shared/icons';
import { useTheme } from '@/shared/theme';

interface CheckboxProps {
  checked?: boolean;
  onCheck?: () => void;
}

export const Checkbox: FC<CheckboxProps> = ({ checked, onCheck }) => {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      onPress={() => onCheck(!checked)}
      style={[
        styles.container,
        { backgroundColor: checked ? colors.blue['400'] : colors.gray['250'] },
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
  },
});
