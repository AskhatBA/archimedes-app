import { FC, useCallback, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  CATEGORY_HINT_KEYS,
  CartBar,
  CartDrawer,
  PaidProgramCard,
  PaidProgramDetailsDrawer,
  useCart,
  useCheckout,
  usePaidPrograms,
  type PaidProgram,
  type PaidProgramCategory,
} from '@/modules/paid-programs';
import { usePageHeader } from '@/shared/hooks';
import { useTranslation } from '@/shared/lib/i18n';
import { useToast } from '@/shared/lib/toast';
import { routes, useNavigation } from '@/shared/navigation';
import { colors, fonts } from '@/shared/theme';

import { CategoryTabs } from './category-tabs';

export const PaidProgramsScreen: FC = () => {
  const { t } = useTranslation();
  const { navigate } = useNavigation();
  const { showToast } = useToast();
  const insets = useSafeAreaInsets();

  usePageHeader({ title: t('paidPrograms:title') });

  const [category, setCategory] = useState<PaidProgramCategory>('MED_PLAN');
  const [detailsProgram, setDetailsProgram] = useState<PaidProgram | null>(
    null,
  );
  const [cartVisible, setCartVisible] = useState(false);

  const { programs, loadingPrograms, fetchingPrograms, refetchPrograms } =
    usePaidPrograms(category);
  const { items, count, total, hasItem, addItem, removeItem, clearCart } =
    useCart();

  const { checkout, isCheckingOut } = useCheckout({
    onReady: ({ paymentUrl }) => {
      navigate(routes.Payment, { paymentUrl });
      // The catalogue is a one-shot purchase flow: leaving the cart filled after handing
      // off to payment would re-add the same programs on the next visit.
      clearCart();
    },
    onError: reason =>
      showToast({
        type: 'error',
        message: reason || t('paidPrograms:cart.checkoutError'),
      }),
  });

  // A program is bought once, so the cart button is a toggle rather than a counter.
  const handleToggleCart = useCallback(
    (program: PaidProgram) => {
      const wasInCart = hasItem(program.id);

      if (wasInCart) {
        removeItem(program.id);
      } else {
        addItem(program);
      }

      showToast({
        type: 'success',
        message: t(
          wasInCart ? 'paidPrograms:toast.removed' : 'paidPrograms:toast.added',
          { title: program.title },
        ),
      });
    },
    [addItem, hasItem, removeItem, showToast, t],
  );

  /**
   * Hands the cart to the backend rather than opening a bare payment form: the payment
   * carries the cart as its metadata, so the order is written to our database the
   * moment the payment settles — the app does not have to be around for it.
   */
  const handleCheckout = () => {
    setCartVisible(false);

    checkout({
      items,
      total,
      description: t('paidPrograms:cart.paymentDescription', { count }),
    });
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <CategoryTabs value={category} onChange={setCategory} />
      <View style={styles.hintRow}>
        <Text style={styles.hint}>{t(CATEGORY_HINT_KEYS[category])}</Text>
        <TouchableOpacity
          onPress={() => navigate(routes.PaidProgramsHistory)}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Text style={styles.historyLink}>
            {t('paidPrograms:history.link')}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.wrapper}>
      <FlatList
        data={programs}
        keyExtractor={program => program.id}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: count > 0 ? 16 : insets.bottom + 16 },
        ]}
        ListHeaderComponent={renderHeader}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={!loadingPrograms && fetchingPrograms}
            onRefresh={refetchPrograms}
          />
        }
        ListEmptyComponent={
          loadingPrograms ? (
            <ActivityIndicator
              style={styles.loader}
              color={colors.blue['400']}
              size="large"
            />
          ) : (
            <Text style={styles.empty}>{t('paidPrograms:empty')}</Text>
          )
        }
        renderItem={({ item }) => (
          <PaidProgramCard
            program={item}
            inCart={hasItem(item.id)}
            onPressInfo={() => setDetailsProgram(item)}
            onPressToggleCart={() => handleToggleCart(item)}
          />
        )}
      />

      <CartBar
        count={count}
        total={total}
        onPress={() => setCartVisible(true)}
      />

      <PaidProgramDetailsDrawer
        program={detailsProgram}
        inCart={!!detailsProgram && hasItem(detailsProgram.id)}
        onClose={() => setDetailsProgram(null)}
        onToggleCart={program => {
          handleToggleCart(program);
          setDetailsProgram(null);
        }}
      />

      <CartDrawer
        visible={cartVisible}
        onClose={() => setCartVisible(false)}
        onCheckout={handleCheckout}
        isSubmitting={isCheckingOut}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: colors.backgroundMain,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 8,
    flexGrow: 1,
  },
  header: {
    gap: 10,
    paddingBottom: 16,
  },
  hintRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
  },
  hint: {
    flex: 1,
    fontSize: 12,
    lineHeight: 16,
    fontFamily: fonts.SFPro.Regular,
    color: colors.gray['500'],
  },
  historyLink: {
    fontSize: 13,
    lineHeight: 16,
    fontWeight: '600',
    fontFamily: fonts.SFPro.Semibold,
    color: colors.blue['400'],
  },
  separator: {
    height: 12,
  },
  loader: {
    paddingTop: 48,
  },
  empty: {
    textAlign: 'center',
    paddingTop: 48,
    fontSize: 14,
    fontFamily: fonts.SFPro.Regular,
    color: colors.gray['500'],
  },
});
