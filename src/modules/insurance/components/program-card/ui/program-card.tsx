import { FC } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';

import { SkeletonElement } from '@/shared/components/skeleton-element';
import { SelectCaretIcon, ShieldPlusIcon } from '@/shared/icons';
import { formatDate } from '@/shared/lib/date';
import { useTranslation } from '@/shared/lib/i18n';
import { useNavigation, routes } from '@/shared/navigation';
import { fonts } from '@/shared/theme';

import { useMedAccount } from '../../../hooks/use-med-account';
import { formatBalance } from '../../../lib/format-balance';
import { getProgramCardNo, getProgramTitle } from '../../../lib/program-title';
import { levelColors } from '../constants';

interface Palette {
  background: string;
  button: string;
  text: string;
}

interface ProgramCardProps {
  /** The insurer's programme name, possibly with the card number in parentheses. */
  title: string;
  cardNo?: string;
  programId: string;
  dateEnd: string;
  /** The programme carrying the медсчёт — shows its balance instead of card and date. */
  isMedAccount?: boolean;
}

/**
 * The card's background, as on the home screen: the level's tint in the top-left corner,
 * deepening diagonally towards its accent colour. The id is per card, since the list
 * draws several gradients at once.
 */
const ProgramGradient: FC<{ id: string; palette: Palette }> = ({
  id,
  palette,
}) => (
  <Svg style={StyleSheet.absoluteFill} pointerEvents="none">
    <Defs>
      <LinearGradient id={id} x1="0" y1="0" x2="1" y2="1">
        <Stop offset="0" stopColor={palette.background} />
        <Stop offset="1" stopColor={palette.button} stopOpacity={0.75} />
      </LinearGradient>
    </Defs>
    <Rect width="100%" height="100%" fill={`url(#${id})`} />
  </Svg>
);

/**
 * What the med-account programme shows in place of the card number: the money on the
 * медсчёт is what the patient opens it for. Same wording as the card on the home screen.
 */
const MedAccountBalance: FC<{ palette: Palette }> = ({ palette }) => {
  const { t } = useTranslation();
  const { balance, isLoading } = useMedAccount();

  if (isLoading) {
    return <SkeletonElement width={140} height={18} borderRadius={6} />;
  }

  return (
    <Text
      style={[styles.subtitle, styles.tabularNums, { color: palette.text }]}
      numberOfLines={1}
    >
      {balance === null
        ? t('home:programBalanceUnavailable')
        : t('home:programBalance', { amount: formatBalance(balance) })}
    </Text>
  );
};

export const ProgramCard: FC<ProgramCardProps> = ({
  title,
  cardNo,
  programId,
  dateEnd,
  isMedAccount = false,
}) => {
  const { navigate } = useNavigation();
  const { t } = useTranslation();

  const programTitle = getProgramTitle(title);
  const programCardNo = getProgramCardNo(title, cardNo);
  const palette =
    levelColors[programTitle as keyof typeof levelColors] ||
    levelColors.Standard;

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => navigate(routes.ProgramDetails, { programId })}
      style={[
        styles.card,
        { backgroundColor: palette.background, borderColor: palette.button },
      ]}
    >
      <ProgramGradient id={`programGradient-${programId}`} palette={palette} />

      <View style={styles.header}>
        <ShieldPlusIcon width={18} height={18} color={palette.text} />
        <Text style={[styles.label, { color: palette.text }]}>
          {t('programs:card.eyebrow')}
        </Text>
      </View>

      <View style={styles.body}>
        <Text
          style={[styles.title, { color: palette.text }]}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {programTitle}
        </Text>

        {isMedAccount ? <MedAccountBalance palette={palette} /> : null}

        {!isMedAccount && programCardNo ? (
          <Text
            style={[
              styles.subtitle,
              styles.tabularNums,
              { color: palette.text },
            ]}
            numberOfLines={1}
            ellipsizeMode="middle"
          >
            {programCardNo}
          </Text>
        ) : null}

        <View style={[styles.divider, { backgroundColor: palette.button }]} />

        <View style={styles.footer}>
          {isMedAccount ? null : (
            <Text
              style={[styles.meta, { color: palette.text }]}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {t('home:programValidUntil', {
                date: formatDate(dateEnd, 'DD.MM.YYYY'),
              })}
            </Text>
          )}
          <View style={styles.detailsRow}>
            <Text style={[styles.detailsText, { color: palette.text }]}>
              {t('programs:card.details')}
            </Text>
            <View style={styles.chevron}>
              <SelectCaretIcon width={12} height={12} color={palette.text} />
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

/** Mirrors the home screen's `statCardStyles`, so the list reads as the same card. */
const styles = StyleSheet.create({
  card: {
    borderRadius: 24,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 8,
    // Clips the gradient to the card's rounded corners.
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  label: {
    fontSize: 11,
    lineHeight: 16,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    opacity: 0.6,
    fontFamily: fonts.SFPro.Semibold,
    fontWeight: '600',
  },
  body: {
    gap: 6,
  },
  title: {
    fontSize: 20,
    lineHeight: 24,
    fontFamily: fonts.SFPro.Bold,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 18,
    opacity: 0.75,
    fontFamily: fonts.SFPro.Medium,
    fontWeight: '500',
  },
  tabularNums: {
    fontVariant: ['tabular-nums'],
  },
  divider: {
    height: 1,
    marginTop: 4,
    opacity: 0.7,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  meta: {
    flexShrink: 1,
    fontSize: 12,
    lineHeight: 16,
    opacity: 0.65,
    fontFamily: fonts.SFPro.Regular,
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    // Stays on the right when the med-account programme has no end date beside it.
    marginLeft: 'auto',
  },
  detailsText: {
    fontSize: 12,
    lineHeight: 16,
    fontFamily: fonts.SFPro.Semibold,
    fontWeight: '600',
  },
  chevron: {
    transform: [{ rotate: '-90deg' }],
  },
});
