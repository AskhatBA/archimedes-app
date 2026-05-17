import { FC } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

import { ClipboardListIcon, StethoscopeIcon } from '@/shared/icons';
import { fonts, useTheme } from '@/shared/theme';

interface HistoryCardProps {
  name: string;
  subtitle?: string;
  color: 'orange' | 'blue';
  onPress?: () => void;
}

export const HistoryCard: FC<HistoryCardProps> = ({
  name,
  color,
  subtitle,
  onPress,
}) => {
  const { colors } = useTheme();

  const palette = {
    blue: {
      background: colors.blue['100'],
      border: colors.blue['200'],
      accent: colors.blue['400'],
      text: colors.textMain,
    },
    orange: {
      background: colors.orange['50'],
      border: colors.orange['300'],
      accent: colors.orange['600'],
      text: colors.textMain,
    },
  }[color];

  const Icon = color === 'blue' ? StethoscopeIcon : ClipboardListIcon;

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      accessibilityRole="button"
      style={[
        styles.card,
        {
          backgroundColor: palette.background,
          borderColor: palette.border,
        },
      ]}
    >
      <View style={[styles.iconBadge, { backgroundColor: palette.accent }]}>
        <Icon width={20} height={20} color={colors.white} />
      </View>

      <View style={styles.content}>
        <Text numberOfLines={2} style={[styles.name, { color: palette.text }]}>
          {name}
        </Text>
        {!!subtitle && (
          <Text
            numberOfLines={1}
            style={[styles.subtitle, { color: colors.gray['500'] }]}
          >
            {subtitle}
          </Text>
        )}
      </View>

      <View style={[styles.chevron, { backgroundColor: colors.white }]}>
        <Text style={[styles.chevronGlyph, { color: palette.accent }]}>›</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1,
  },
  iconBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    gap: 2,
  },
  name: {
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 20,
    fontFamily: fonts.SFPro.Semibold,
  },
  subtitle: {
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 16,
  },
  chevron: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chevronGlyph: {
    fontSize: 18,
    lineHeight: 18,
    fontWeight: '700',
    marginTop: -2,
  },
});
