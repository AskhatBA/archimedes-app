import { FC } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

import { CalendarIcon, ShieldPlusIcon } from '@/shared/icons';
import { formatDate } from '@/shared/lib/date';
import { useNavigation, routes } from '@/shared/navigation';
import { fonts, useTheme } from '@/shared/theme';

import { levelColors } from '../constants';

interface InsuranceCardProps {
  level: string;
  price: string;
  programId: string;
  dateEnd: string;
}

export const ProgramCard: FC<InsuranceCardProps> = ({
  level,
  price,
  programId,
  dateEnd,
}) => {
  const { colors } = useTheme();
  const { navigate } = useNavigation();

  const palette = levelColors[level] || levelColors.Standard;

  const openDetails = () => navigate(routes.ProgramDetails, { programId });

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={openDetails}
      style={[
        styles.card,
        {
          backgroundColor: palette.background,
          borderColor: palette.button,
        },
      ]}
    >
      <View style={styles.topRow}>
        <View style={[styles.badge, { backgroundColor: palette.button }]}>
          <ShieldPlusIcon width={18} height={18} color={palette.text} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.eyebrow, { color: palette.text, opacity: 0.7 }]}>
            Программа
          </Text>
          <Text
            numberOfLines={1}
            style={[styles.title, { color: palette.text }]}
          >
            {level}
          </Text>
        </View>
      </View>

      <View style={[styles.divider, { backgroundColor: palette.button }]} />

      <View style={styles.chipsRow}>
        <View
          style={[
            styles.chip,
            { backgroundColor: colors.white, borderColor: palette.button },
          ]}
        >
          <Text style={[styles.chipLabel, { color: colors.gray['500'] }]}>
            Карта №
          </Text>
          <Text
            numberOfLines={1}
            style={[styles.chipValue, { color: palette.text }]}
          >
            {price}
          </Text>
        </View>
        <View
          style={[
            styles.chip,
            { backgroundColor: colors.white, borderColor: palette.button },
          ]}
        >
          <View style={styles.chipHeader}>
            <CalendarIcon width={12} height={12} color={colors.gray['500']} />
            <Text style={[styles.chipLabel, { color: colors.gray['500'] }]}>
              Активен до
            </Text>
          </View>
          <Text style={[styles.chipValue, { color: palette.text }]}>
            {formatDate(dateEnd, 'DD.MM.YYYY')}
          </Text>
        </View>
      </View>

      <View style={styles.ctaRow}>
        <View style={[styles.cta, { backgroundColor: palette.button }]}>
          <Text style={[styles.ctaText, { color: palette.text }]}>
            Подробнее
          </Text>
          <Text style={[styles.ctaArrow, { color: palette.text }]}>›</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    padding: 18,
    gap: 14,
    borderWidth: 1,
    overflow: 'hidden',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  badge: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    lineHeight: 28,
    fontFamily: fonts.SFPro.Bold,
    marginTop: 2,
  },
  divider: {
    height: 1,
    opacity: 0.6,
  },
  chipsRow: {
    gap: 10,
  },
  chip: {
    flex: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 4,
    borderWidth: 1,
  },
  chipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  chipLabel: {
    fontSize: 11,
    fontWeight: '500',
  },
  chipValue: {
    fontSize: 14,
    fontWeight: '700',
    fontFamily: fonts.SFPro.Semibold,
  },
  ctaRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  cta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
  },
  ctaText: {
    fontSize: 13,
    fontWeight: '600',
    fontFamily: fonts.SFPro.Semibold,
  },
  ctaArrow: {
    fontSize: 18,
    lineHeight: 18,
    fontWeight: '700',
    marginTop: -2,
  },
});
