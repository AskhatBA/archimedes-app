import { FC } from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

import { Radio } from '@/shared/components/radio';
import { useTheme } from '@/shared/theme';

import { useCardRadioGroup } from '../card-radio-group-context';

interface RadioCardProps {
  value: string;
  label: string;
}

export const RadioCard: FC<RadioCardProps> = ({ value, label }) => {
  const { colors } = useTheme();
  const { onChange, value: activeValue } = useCardRadioGroup();
  const isActive = value === activeValue;

  return (
    <TouchableOpacity
      onPress={() => onChange(value)}
      style={[
        styles.container,
        { backgroundColor: isActive ? colors.blue['100'] : colors.gray['200'] },
      ]}
    >
      <Radio value={value} onChange={onChange} checked={isActive} />
      <Text
        style={[
          styles.label,
          { color: isActive ? colors.blue['400'] : colors.gray['500'] },
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 18,
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  label: {
    fontSize: 18,
    lineHeight: 22,
    fontWeight: 600,
    paddingRight: 22,
  },
});
