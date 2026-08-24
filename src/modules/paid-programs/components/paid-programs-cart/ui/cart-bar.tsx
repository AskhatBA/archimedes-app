import { FC } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ShoppingCartPlusIcon } from '@/shared/icons';
import { useTranslation } from '@/shared/lib/i18n';
import { colors, fonts } from '@/shared/theme';

import { formatPrice } from '../../../lib/format-price';

interface CartBarProps {
  count: number;
  total: number;
  onPress: () => void;
}

/** Sticky summary above the safe area — the only way into the cart from the list. */
export const CartBar: FC<CartBarProps> = ({ count, total, onPress }) => {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  if (count === 0) return null;

  return (
    <View style={[styles.wrapper, { paddingBottom: insets.bottom + 12 }]}>
      <TouchableOpacity
        activeOpacity={0.9}
        style={styles.bar}
        onPress={onPress}
      >
        <View style={styles.iconWrap}>
          <ShoppingCartPlusIcon width={20} height={20} color={colors.white} />
          <View style={styles.counter}>
            <Text style={styles.counterText}>{count}</Text>
          </View>
        </View>

        <View style={styles.textBlock}>
          <Text style={styles.label}>{t('paidPrograms:cart.barLabel')}</Text>
          <Text style={styles.total}>{formatPrice(total)}</Text>
        </View>

        <Text style={styles.action}>{t('paidPrograms:cart.open')}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 16,
    paddingTop: 10,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.gray['200'],
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.blue['400'],
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.blue['500'],
  },
  counter: {
    position: 'absolute',
    top: -4,
    right: -4,
    minWidth: 18,
    height: 18,
    paddingHorizontal: 4,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
  },
  counterText: {
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '700',
    fontFamily: fonts.SFPro.Bold,
    color: colors.blue['500'],
  },
  textBlock: {
    flex: 1,
    gap: 2,
  },
  label: {
    fontSize: 12,
    lineHeight: 16,
    fontFamily: fonts.SFPro.Medium,
    color: colors.blue['200'],
  },
  total: {
    fontSize: 17,
    lineHeight: 22,
    fontWeight: '700',
    fontFamily: fonts.SFPro.Bold,
    color: colors.white,
  },
  action: {
    fontSize: 14,
    fontFamily: fonts.SFPro.Semibold,
    fontWeight: '600',
    color: colors.white,
  },
});
