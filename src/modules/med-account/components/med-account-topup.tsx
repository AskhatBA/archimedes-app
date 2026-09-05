import { FC, useState } from 'react';
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/shared/components/button';
import { SkeletonElement } from '@/shared/components/skeleton-element';
import { InfoIcon } from '@/shared/icons';
import { useTranslation } from '@/shared/lib/i18n';
import { useToast } from '@/shared/lib/toast';
import { routes, useNavigation } from '@/shared/navigation';
import { colors, fonts } from '@/shared/theme';

import { useTopupCheckout } from '../hooks/use-topup-checkout';
import { useTopupOptions } from '../hooks/use-topup-options';
import { formatAmount } from '../lib/format-amount';

import { TopupInfoDrawer } from './topup-info-drawer';
import { TopupOptionCard } from './topup-option-card';

/**
 * The "пополнить медсчёт" screen: pick one amount, pay for it.
 *
 * Deliberately not the paid-programs cart. A top-up is one sum paid once, so the list is a
 * radio group with a single confirm button rather than a basket that adds up — selecting a
 * second amount replaces the first.
 */
export const MedAccountTopup: FC = () => {
  const { t } = useTranslation();
  const { navigate } = useNavigation();
  const { showToast } = useToast();
  const insets = useSafeAreaInsets();

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [infoVisible, setInfoVisible] = useState(false);

  const { options, loadingOptions, fetchingOptions, refetchOptions } =
    useTopupOptions();

  const selected = options.find(option => option.id === selectedId) ?? null;

  const { startTopup, isStartingTopup } = useTopupCheckout({
    onReady: ({ paymentUrl, paymentId }) => {
      navigate(routes.Payment, { paymentUrl, paymentId });
      // The screen is a one-shot flow: leaving an amount selected would re-arm the same
      // payment on the way back from the provider.
      setSelectedId(null);
    },
    onError: reason =>
      showToast({
        type: 'error',
        message: reason || t('medAccount:topup.error'),
      }),
  });

  const handleSubmit = () => {
    if (!selected) return;

    startTopup({
      option: selected,
      description: t('medAccount:topup.paymentDescription', {
        amount: formatAmount(selected.amount),
      }),
    });
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.hint}>{t('medAccount:topup.hint')}</Text>
      <TouchableOpacity
        onPress={() => setInfoVisible(true)}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        accessibilityRole="button"
        accessibilityLabel={t('medAccount:info.openA11y')}
        style={styles.infoButton}
      >
        <InfoIcon width={18} height={18} color={colors.blue['400']} />
        <Text style={styles.infoLabel}>{t('medAccount:info.link')}</Text>
      </TouchableOpacity>
    </View>
  );

  const renderEmpty = () =>
    loadingOptions ? (
      <View style={styles.skeletons}>
        {[0, 1, 2, 3, 4].map(key => (
          <SkeletonElement key={key} height={68} borderRadius={20} />
        ))}
      </View>
    ) : (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>{t('medAccount:topup.empty')}</Text>
      </View>
    );

  return (
    <View style={styles.wrapper}>
      <FlatList
        data={options}
        keyExtractor={option => option.id}
        renderItem={({ item }) => (
          <TopupOptionCard
            option={item}
            selected={item.id === selectedId}
            onPress={() => setSelectedId(item.id)}
          />
        )}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.content,
          // The confirm bar floats over the list, so the last card needs room to clear it.
          { paddingBottom: selected ? 16 : insets.bottom + 16 },
        ]}
        refreshControl={
          <RefreshControl
            refreshing={fetchingOptions && !loadingOptions}
            onRefresh={refetchOptions}
            tintColor={colors.blue['400']}
          />
        }
      />

      {selected ? (
        <View style={[styles.bar, { paddingBottom: insets.bottom + 12 }]}>
          <View style={styles.barText}>
            <Text style={styles.barCaption}>
              {t('medAccount:topup.selected')}
            </Text>
            <Text style={styles.barAmount}>
              {formatAmount(selected.amount)}
            </Text>
          </View>
          <Button
            style={styles.barButton}
            onPress={handleSubmit}
            isLoading={isStartingTopup}
            disabled={isStartingTopup}
          >
            {t('medAccount:topup.submit')}
          </Button>
        </View>
      ) : null}

      <TopupInfoDrawer
        visible={infoVisible}
        onClose={() => setInfoVisible(false)}
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
  hint: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
    fontFamily: fonts.SFPro.Medium,
    color: colors.blue['370'],
  },
  infoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
  },
  infoLabel: {
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '600',
    fontFamily: fonts.SFPro.Semibold,
    color: colors.blue['400'],
  },
  separator: {
    height: 12,
  },
  skeletons: {
    gap: 12,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
  },
  emptyText: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    fontWeight: '500',
    fontFamily: fonts.SFPro.Medium,
    color: colors.blue['370'],
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingTop: 12,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.blue['200'],
  },
  barText: {
    flex: 1,
  },
  barCaption: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '500',
    fontFamily: fonts.SFPro.Medium,
    color: colors.blue['370'],
  },
  barAmount: {
    fontSize: 18,
    lineHeight: 22,
    fontWeight: '700',
    fontFamily: fonts.SFPro.Bold,
    color: colors.blue['500'],
    fontVariant: ['tabular-nums'],
  },
  barButton: {
    flexShrink: 0,
  },
});
