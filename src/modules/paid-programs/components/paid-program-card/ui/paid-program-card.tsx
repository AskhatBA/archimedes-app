import { FC } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import {
  CheckCircleIcon,
  FamilyIcon,
  HeartIcon,
  ShoppingCartPlusIcon,
} from '@/shared/icons';
import { useTranslation } from '@/shared/lib/i18n';
import { colors, fonts } from '@/shared/theme';

import { formatPrice } from '../../../lib/format-price';
import { PaidProgram } from '../../../types';

interface PaidProgramCardProps {
  program: PaidProgram;
  inCart: boolean;
  onPressInfo: () => void;
  onPressToggleCart: () => void;
}

export const PaidProgramCard: FC<PaidProgramCardProps> = ({
  program,
  inCart,
  onPressInfo,
  onPressToggleCart,
}) => {
  const { t } = useTranslation();

  const CoverageIcon = program.coverage === 'FAMILY' ? FamilyIcon : HeartIcon;

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPressInfo}
      style={styles.card}
    >
      <View style={styles.badge}>
        <CoverageIcon width={20} height={20} color={colors.blue['400']} />
      </View>

      <View style={styles.textBlock}>
        <View style={styles.titleRow}>
          <Text numberOfLines={2} style={styles.title}>
            {program.title}
          </Text>
          {program.popular ? (
            <View style={styles.popularBadge}>
              <Text style={styles.popularText}>
                {t('paidPrograms:card.popular')}
              </Text>
            </View>
          ) : null}
        </View>
        <Text style={styles.price}>{formatPrice(program.price)}</Text>
        {program.duration ? (
          <Text style={styles.duration}>{program.duration}</Text>
        ) : null}
      </View>

      {/* Details open by tapping the card itself. */}
      <TouchableOpacity
        style={[styles.actionButton, inCart && styles.actionButtonActive]}
        onPress={onPressToggleCart}
        hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
        accessibilityLabel={t(
          inCart
            ? 'paidPrograms:card.removeFromCartA11y'
            : 'paidPrograms:card.addToCartA11y',
        )}
      >
        {inCart ? (
          <CheckCircleIcon width={22} height={22} color={colors.white} />
        ) : (
          <ShoppingCartPlusIcon
            width={22}
            height={22}
            color={colors.blue['400']}
          />
        )}
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.blue['100'],
    borderWidth: 1,
    borderColor: colors.blue['200'],
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  badge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.blue['150'],
    alignItems: 'center',
    justifyContent: 'center',
  },
  textBlock: {
    flex: 1,
    gap: 2,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  // The badge keeps its width; long check-up names wrap onto a second line instead.
  title: {
    flexShrink: 1,
    fontSize: 17,
    lineHeight: 22,
    fontWeight: '700',
    fontFamily: fonts.SFPro.Bold,
    color: colors.blue['500'],
  },
  popularBadge: {
    backgroundColor: colors.blue['400'],
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  popularText: {
    fontSize: 10,
    lineHeight: 14,
    fontWeight: '600',
    fontFamily: fonts.SFPro.Semibold,
    color: colors.white,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  price: {
    fontSize: 17,
    lineHeight: 22,
    fontWeight: '700',
    fontFamily: fonts.SFPro.Bold,
    color: colors.blue['500'],
  },
  duration: {
    fontSize: 12,
    lineHeight: 16,
    fontFamily: fonts.SFPro.Regular,
    color: colors.blue['370'],
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.blue['200'],
  },
  actionButtonActive: {
    backgroundColor: colors.blue['400'],
    borderColor: colors.blue['400'],
  },
});
