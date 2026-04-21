import { FC } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { CalendarIcon } from '@/shared/icons';
import { useTheme } from '@/shared/theme';

interface FieldTriggerProps {
  onOpen: () => void;
  value?: string;
  error?: string;
}

export const FieldTrigger: FC<FieldTriggerProps> = ({
  onOpen,
  value,
  error,
}) => {
  const { colors } = useTheme();
  const hasValue = !!value;

  const bg = () => {
    if (error) return colors.red['100'];
    if (hasValue) return colors.blue['100'];
    return colors.gray['200'];
  };

  const borderColor = () => {
    if (error) return colors.error;
    if (hasValue) return colors.blue['350'];
    return colors.gray['250'];
  };

  const textColor = () => {
    if (error) return colors.error;
    if (hasValue) return colors.blue['400'];
    return colors.gray['500'];
  };

  return (
    <>
      <TouchableOpacity
        style={[styles.trigger, { backgroundColor: bg(), borderColor: borderColor() }]}
        onPress={onOpen}
        activeOpacity={0.8}
      >
        <Text style={[styles.value, { color: textColor() }]}>{value}</Text>
        <CalendarIcon width={20} height={20} color={hasValue ? colors.blue['400'] : colors.gray['500']} />
      </TouchableOpacity>
      {error && (
        <Text style={[styles.error, { color: colors.error }]}>{error}</Text>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 15,
    borderWidth: 1.5,
    paddingHorizontal: 18,
    paddingVertical: 16,
  },
  value: {
    fontSize: 18,
    lineHeight: 22,
    fontWeight: '600',
  },
  error: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 4,
    paddingHorizontal: 4,
  },
});
