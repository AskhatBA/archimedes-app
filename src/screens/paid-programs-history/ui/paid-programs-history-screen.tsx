import { useFocusEffect } from '@react-navigation/native';
import { FC, useCallback } from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PurchaseCard, usePurchases } from '@/modules/paid-programs';
import { usePageHeader } from '@/shared/hooks';
import { useTranslation } from '@/shared/lib/i18n';
import { colors, fonts } from '@/shared/theme';

import { PurchaseFilters } from './purchase-filters';

export const PaidProgramsHistoryScreen: FC = () => {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  usePageHeader({ title: t('paidPrograms:history.title') });

  const {
    visiblePurchases,
    filter,
    setFilter,
    isEmpty,
    isFilterEmpty,
    isRefreshing,
    refreshPending,
    removePurchase,
  } = usePurchases();

  // Payments settle server-side after the WebView closes, so statuses are re-read
  // every time the screen comes into view.
  useFocusEffect(
    useCallback(() => {
      refreshPending();
    }, [refreshPending]),
  );

  /** The filter chips hide the list, so its own "nothing here" copy has to say why. */
  const renderEmpty = () => {
    if (isFilterEmpty) {
      return (
        <View style={styles.empty}>
          <Text style={styles.emptySubtitle}>
            {t('paidPrograms:history.filterEmpty')}
          </Text>
        </View>
      );
    }

    if (!isEmpty) return null;

    return (
      <View style={styles.empty}>
        <Text style={styles.emptyTitle}>
          {t('paidPrograms:history.emptyTitle')}
        </Text>
        <Text style={styles.emptySubtitle}>
          {t('paidPrograms:history.emptySubtitle')}
        </Text>
      </View>
    );
  };

  return (
    <FlatList
      data={visiblePurchases}
      keyExtractor={purchase => purchase.id}
      contentContainerStyle={[
        styles.content,
        { paddingBottom: insets.bottom + 16 },
      ]}
      ListHeaderComponent={
        isEmpty ? null : <PurchaseFilters value={filter} onChange={setFilter} />
      }
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={isRefreshing} onRefresh={refreshPending} />
      }
      ListEmptyComponent={renderEmpty()}
      renderItem={({ item }) => (
        <PurchaseCard
          purchase={item}
          onDelete={
            item.status === 'PENDING'
              ? () => removePurchase(item.id)
              : undefined
          }
        />
      )}
    />
  );
};

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 16,
    paddingTop: 8,
    flexGrow: 1,
  },
  separator: {
    height: 12,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 24,
  },
  emptyTitle: {
    fontSize: 17,
    lineHeight: 22,
    fontWeight: '700',
    fontFamily: fonts.SFPro.Bold,
    color: colors.textMain,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: fonts.SFPro.Regular,
    color: colors.gray['500'],
    textAlign: 'center',
  },
});
