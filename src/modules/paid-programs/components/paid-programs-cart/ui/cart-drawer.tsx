import { FC } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BottomDrawer } from '@/shared/components/bottom-drawer';
import { Button } from '@/shared/components/button';
import { TrashIcon } from '@/shared/icons';
import { useTranslation } from '@/shared/lib/i18n';
import { colors, fonts } from '@/shared/theme';

import { useCart } from '../../../hooks/use-cart';
import { formatPrice } from '../../../lib/format-price';

interface CartDrawerProps {
  visible: boolean;
  onClose: () => void;
  onCheckout: () => void;
}

export const CartDrawer: FC<CartDrawerProps> = ({
  visible,
  onClose,
  onCheckout,
}) => {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { items, total, isEmpty, removeItem, clearCart } = useCart();

  return (
    <BottomDrawer visible={visible} onClose={onClose} scrollable>
      <View style={[styles.content, { paddingBottom: insets.bottom + 24 }]}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>{t('paidPrograms:cart.title')}</Text>
          {!isEmpty ? (
            <TouchableOpacity onPress={clearCart}>
              <Text style={styles.clear}>{t('paidPrograms:cart.clear')}</Text>
            </TouchableOpacity>
          ) : null}
        </View>

        {isEmpty ? (
          <Text style={styles.empty}>{t('paidPrograms:cart.empty')}</Text>
        ) : (
          <>
            <View style={styles.list}>
              {items.map(program => (
                <View key={program.id} style={styles.item}>
                  <View style={styles.itemText}>
                    <Text numberOfLines={2} style={styles.itemTitle}>
                      {program.title}
                    </Text>
                    <Text style={styles.itemPrice}>
                      {formatPrice(program.price)}
                    </Text>
                  </View>

                  <TouchableOpacity
                    onPress={() => removeItem(program.id)}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    accessibilityLabel={t('paidPrograms:cart.removeA11y')}
                  >
                    <TrashIcon width={18} height={18} color={colors.red[500]} />
                  </TouchableOpacity>
                </View>
              ))}
            </View>

            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>
                {t('paidPrograms:cart.total')}
              </Text>
              <Text style={styles.totalValue}>{formatPrice(total)}</Text>
            </View>

            <Button onPress={onCheckout}>
              {t('paidPrograms:cart.checkout')}
            </Button>
          </>
        )}
      </View>
    </BottomDrawer>
  );
};

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 16,
    gap: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 20,
    lineHeight: 26,
    fontWeight: '700',
    fontFamily: fonts.SFPro.Bold,
    color: colors.blue['500'],
  },
  clear: {
    fontSize: 13,
    fontFamily: fonts.SFPro.Medium,
    color: colors.red[500],
  },
  empty: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    paddingVertical: 24,
    fontFamily: fonts.SFPro.Regular,
    color: colors.gray['500'],
  },
  list: {
    gap: 10,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: colors.gray['200'],
  },
  itemText: {
    flex: 1,
    gap: 2,
  },
  itemTitle: {
    fontSize: 14,
    lineHeight: 18,
    fontFamily: fonts.SFPro.Semibold,
    fontWeight: '600',
    color: colors.gray['700'],
  },
  itemPrice: {
    fontSize: 14,
    lineHeight: 18,
    fontFamily: fonts.SFPro.Bold,
    fontWeight: '700',
    color: colors.blue['500'],
  },
  totalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: colors.gray['250'],
    paddingTop: 14,
  },
  totalLabel: {
    fontSize: 15,
    fontFamily: fonts.SFPro.Medium,
    color: colors.gray['600'],
  },
  totalValue: {
    fontSize: 20,
    fontWeight: '700',
    fontFamily: fonts.SFPro.Bold,
    color: colors.blue['500'],
  },
});
