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

import { useTranslation } from '@/shared/lib/i18n';
import { useToast } from '@/shared/lib/toast';
import { routes, useNavigation } from '@/shared/navigation';
import { colors, fonts } from '@/shared/theme';

import { useCart } from '../../../hooks/use-cart';
import { useCheckout } from '../../../hooks/use-checkout';
import { usePaidPrograms } from '../../../hooks/use-paid-programs';
import { PaidProgram, PaidProgramCategory } from '../../../types';
import { PaidProgramCard } from '../../paid-program-card';
import { PaidProgramDetailsDrawer } from '../../paid-program-details';
import { CartBar, CartDrawer } from '../../paid-programs-cart';

interface PaidProgramsCatalogProps {
  category: PaidProgramCategory;
  /** Short explainer under the header — each catalogue speaks for itself. */
  hint: string;
}

/**
 * The catalogue of one category: list, details drawer, cart and checkout.
 *
 * Med plans and check-ups are separate screens, but everything below the header is
 * identical — only the category the list is filled from differs. The cart is
 * deliberately shared across both: one checkout can pay for a mixed selection, and
 * the backend already receives a per-item category.
 */
export const PaidProgramsCatalog: FC<PaidProgramsCatalogProps> = ({
  category,
  hint,
}) => {
  const { t } = useTranslation();
  const { navigate } = useNavigation();
  const { showToast } = useToast();
  const insets = useSafeAreaInsets();

  const [detailsProgram, setDetailsProgram] = useState<PaidProgram | null>(
    null,
  );
  const [cartVisible, setCartVisible] = useState(false);

  const { programs, loadingPrograms, fetchingPrograms, refetchPrograms } =
    usePaidPrograms(category);
  const { items, count, total, hasItem, addItem, removeItem, clearCart } =
    useCart();

  const { checkout, isCheckingOut } = useCheckout({
    onReady: ({ paymentUrl, paymentId }) => {
      navigate(routes.Payment, { paymentUrl, paymentId });
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

  /**
   * History is shared between the catalogues, so it opens pre-filtered to the one the
   * link was tapped from.
   */
  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.hint}>{hint}</Text>
      <TouchableOpacity
        onPress={() =>
          navigate(routes.PaidProgramsHistory, { filter: category })
        }
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Text style={styles.historyLink}>{t('paidPrograms:history.link')}</Text>
      </TouchableOpacity>
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
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
    paddingBottom: 16,
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
