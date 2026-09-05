import { FC } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { CheckCircleIcon, WalletIcon } from '@/shared/icons';
import { useTranslation } from '@/shared/lib/i18n';
import { colors, fonts } from '@/shared/theme';

import { formatAmount } from '../lib/format-amount';
import { TopupOption } from '../types';

interface TopupOptionCardProps {
  option: TopupOption;
  selected: boolean;
  onPress: () => void;
}

/**
 * One amount the account can be topped up by.
 *
 * A radio rather than a cart button: a top-up is a single payment for a single sum, so
 * two amounts can never be selected at once and there is nothing to add up.
 */
export const TopupOptionCard: FC<TopupOptionCardProps> = ({
  option,
  selected,
  onPress,
}) => {
  const { t } = useTranslation();

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      style={[styles.card, selected && styles.cardSelected]}
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      accessibilityLabel={formatAmount(option.amount)}
    >
      <View style={[styles.badge, selected && styles.badgeSelected]}>
        <WalletIcon
          width={20}
          height={20}
          color={selected ? colors.white : colors.blue['400']}
        />
      </View>

      <View style={styles.textBlock}>
        <View style={styles.titleRow}>
          <Text style={styles.amount}>{formatAmount(option.amount)}</Text>
          {option.popular ? (
            <View style={styles.popularBadge}>
              <Text style={styles.popularText}>
                {t('medAccount:card.popular')}
              </Text>
            </View>
          ) : null}
        </View>
        {option.label ? (
          <Text numberOfLines={2} style={styles.label}>
            {option.label}
          </Text>
        ) : null}
      </View>

      {selected ? (
        <CheckCircleIcon width={24} height={24} color={colors.blue['400']} />
      ) : (
        <View style={styles.radio} />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.blue['100'],
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.blue['200'],
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  // Selection is carried by the border and the badge rather than by the tick alone, so
  // the chosen amount stays obvious with the button bar covering the bottom of the list.
  cardSelected: {
    borderColor: colors.blue['400'],
    backgroundColor: colors.white,
  },
  badge: {
    width: 40,
    height: 40,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
  },
  badgeSelected: {
    backgroundColor: colors.blue['400'],
  },
  textBlock: {
    flex: 1,
    gap: 2,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  amount: {
    fontSize: 18,
    lineHeight: 22,
    fontWeight: '700',
    fontFamily: fonts.SFPro.Bold,
    color: colors.blue['500'],
    fontVariant: ['tabular-nums'],
  },
  label: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '500',
    fontFamily: fonts.SFPro.Medium,
    color: colors.blue['370'],
  },
  popularBadge: {
    backgroundColor: colors.green['100'],
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  popularText: {
    fontSize: 10,
    lineHeight: 13,
    fontWeight: '700',
    fontFamily: fonts.SFPro.Bold,
    color: colors.green['600'],
  },
  radio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.blue['200'],
  },
});
