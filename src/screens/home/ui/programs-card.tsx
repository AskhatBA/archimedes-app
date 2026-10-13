import { FC } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';

import {
  formatBalance,
  levelColors,
  useMedAccount,
  usePrograms,
} from '@/modules/insurance';
import { ShieldPlusIcon } from '@/shared/icons';
import { formatDate } from '@/shared/lib/date';
import { useTranslation } from '@/shared/lib/i18n';
import { routes, useNavigation } from '@/shared/navigation';
import { colors, fonts } from '@/shared/theme';

import { ChevronRight, statCardStyles as card } from './home-stat-card';

const TRAILING_PARENTHESES = /\s*\(([^()]*)\)\s*$/;

const getProgramTitle = (title?: string) => {
  const raw = (title ?? '').trim();
  return raw.replace(TRAILING_PARENTHESES, '').trim() || raw;
};

const getProgramCardNo = (title?: string, cardNo?: string) => {
  if (cardNo) return cardNo;
  return (title ?? '').trim().match(TRAILING_PARENTHESES)?.[1]?.trim() ?? '';
};

const GRADIENT_ID = 'homeProgramsCardGradient';

/**
 * The card's background: the programme level's own tint in the top-left corner, deepening
 * diagonally towards its accent colour, so a Gold programme still reads as gold at a glance.
 */
const ProgramGradient: FC<{ from: string; to: string }> = ({ from, to }) => (
  <Svg style={StyleSheet.absoluteFill} pointerEvents="none">
    <Defs>
      <LinearGradient id={GRADIENT_ID} x1="0" y1="0" x2="1" y2="1">
        <Stop offset="0" stopColor={from} />
        <Stop offset="1" stopColor={to} stopOpacity={0.75} />
      </LinearGradient>
    </Defs>
    <Rect width="100%" height="100%" fill={`url(#${GRADIENT_ID})`} />
  </Svg>
);

export const ProgramsCard: FC = () => {
  const { programs } = usePrograms();
  const { navigate } = useNavigation();
  const { t } = useTranslation();

  const activePrograms = programs.filter(p => p.status !== 'EXPIRED');
  const activeProgram = activePrograms[0];
  const extraProgramsCount = Math.max(0, activePrograms.length - 1);
  const activeProgramTitle = getProgramTitle(activeProgram?.title);
  const isMedAccountProgram = !!activeProgram?.isMedAccount;
  const { balance, isLoading: loadingBalance } = useMedAccount({
    enabled: isMedAccountProgram,
  });

  /**
   * The line under the programme title: its card number, or — for the programme carrying
   * the медсчёт — the balance on it instead, the same as in the programmes list.
   */
  const getActiveProgramSubtitle = () => {
    if (!isMedAccountProgram) {
      return getProgramCardNo(activeProgram?.title, activeProgram?.cardNo);
    }
    if (loadingBalance) return '';
    return balance === null
      ? t('home:programBalanceUnavailable')
      : t('home:programBalance', { amount: formatBalance(balance) });
  };
  const activeProgramSubtitle = getActiveProgramSubtitle();
  const programPalette =
    levelColors[activeProgramTitle as keyof typeof levelColors] ||
    levelColors.Standard;

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      style={[
        card.card,
        activeProgram && [
          styles.gradientCard,
          {
            backgroundColor: programPalette.background,
            borderColor: programPalette.button,
          },
        ],
      ]}
      onPress={() =>
        activeProgram
          ? navigate(routes.ProgramDetails, { programId: activeProgram.id })
          : navigate(routes.PaidPrograms)
      }
    >
      {activeProgram ? (
        <ProgramGradient
          from={programPalette.background}
          to={programPalette.button}
        />
      ) : null}

      <View style={card.header}>
        <ShieldPlusIcon
          width={18}
          height={18}
          color={activeProgram ? programPalette.text : colors.blue['400']}
        />
        <Text
          style={[card.label, activeProgram && { color: programPalette.text }]}
        >
          {t('home:myPrograms')}
        </Text>
        {extraProgramsCount > 0 ? (
          <View
            style={[card.badge, { backgroundColor: programPalette.button }]}
          >
            <Text style={[card.badgeText, { color: programPalette.text }]}>
              +{extraProgramsCount}
            </Text>
          </View>
        ) : null}
      </View>

      {activeProgram ? (
        <View style={card.body}>
          <Text
            style={[card.title, { color: programPalette.text }]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {activeProgramTitle}
          </Text>

          {activeProgramSubtitle ? (
            <Text
              style={[
                card.subtitle,
                styles.tabularNums,
                { color: programPalette.text },
              ]}
              numberOfLines={1}
              ellipsizeMode="middle"
            >
              {activeProgramSubtitle}
            </Text>
          ) : null}

          <View
            style={[card.divider, { backgroundColor: programPalette.button }]}
          />

          <View style={card.footer}>
            {isMedAccountProgram ? null : (
              <Text
                style={[card.meta, { color: programPalette.text }]}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {t('home:programValidUntil', {
                  date: formatDate(activeProgram.dateEnd, 'DD.MM.YYYY'),
                })}
              </Text>
            )}
            <TouchableOpacity
              style={styles.showAllRow}
              hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
              onPress={() => navigate(routes.Programs)}
            >
              <Text
                style={[styles.showAllText, { color: programPalette.text }]}
              >
                {t('home:showAll')}
              </Text>
              <ChevronRight color={programPalette.text} size={12} />
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={card.body}>
          <Text style={card.emptyValue}>{t('home:noActivePrograms')}</Text>
          <View style={card.ctaRow}>
            <Text style={card.ctaText}>{t('home:connectProgram')}</Text>
            <ChevronRight color={colors.green['600']} />
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  gradientCard: {
    // Clips the gradient to the card's rounded corners.
    overflow: 'hidden',
  },
  tabularNums: {
    fontVariant: ['tabular-nums'],
  },
  showAllRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    // Stays on the right when the med-account programme has no end date beside it.
    marginLeft: 'auto',
  },
  showAllText: {
    fontSize: 12,
    lineHeight: 16,
    fontFamily: fonts.SFPro.Semibold,
    fontWeight: '600',
  },
});
