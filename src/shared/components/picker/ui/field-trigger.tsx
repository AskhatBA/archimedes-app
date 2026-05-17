import { FC } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { CalendarIcon } from '@/shared/icons';
import { fonts, useTheme } from '@/shared/theme';

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

  const bg = (() => {
    if (error) return colors.red['100'];
    if (hasValue) return colors.blue['100'];
    return colors.gray['200'];
  })();

  const borderColor = (() => {
    if (error) return colors.error;
    if (hasValue) return colors.blue['200'];
    return colors.gray['250'];
  })();

  const textColor = (() => {
    if (error) return colors.error;
    if (hasValue) return colors.blue['400'];
    return colors.gray['500'];
  })();

  const iconBg = hasValue ? colors.white : 'transparent';
  const iconColor = hasValue ? colors.blue['400'] : colors.gray['500'];

  return (
    <>
      <TouchableOpacity
        style={[styles.trigger, { backgroundColor: bg, borderColor }]}
        onPress={onOpen}
        activeOpacity={0.85}
      >
        <Text numberOfLines={1} style={[styles.value, { color: textColor }]}>
          {value}
        </Text>
        <View style={[styles.iconChip, { backgroundColor: iconBg }]}>
          <CalendarIcon width={18} height={18} color={iconColor} />
        </View>
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
    gap: 12,
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  value: {
    flex: 1,
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '600',
    fontFamily: fonts.SFPro.Semibold,
  },
  iconChip: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  error: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 4,
    paddingHorizontal: 4,
  },
});
