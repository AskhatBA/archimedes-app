import { FC } from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { SkeletonElement } from '@/shared/components/skeleton-element';
import { useTranslation } from '@/shared/lib/i18n';
import { colors, fonts } from '@/shared/theme';

import { useTopupHistory } from '../hooks/use-topup-history';

import { TopupHistoryCard } from './topup-history-card';

/** The patient's own top-ups and where each one has got to. */
export const TopupHistory: FC = () => {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  const { topups, loadingTopups, fetchingTopups, refetchTopups } =
    useTopupHistory();

  const renderEmpty = () =>
    loadingTopups ? (
      <View style={styles.skeletons}>
        {[0, 1, 2].map(key => (
          <SkeletonElement key={key} height={104} borderRadius={16} />
        ))}
      </View>
    ) : (
      <View style={styles.empty}>
        <Text style={styles.emptyTitle}>
          {t('medAccount:history.emptyTitle')}
        </Text>
        <Text style={styles.emptySubtitle}>
          {t('medAccount:history.emptySubtitle')}
        </Text>
      </View>
    );

  return (
    <FlatList
      data={topups}
      keyExtractor={topup => topup.id}
      renderItem={({ item }) => <TopupHistoryCard topup={item} />}
      ListEmptyComponent={renderEmpty()}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[
        styles.content,
        { paddingBottom: insets.bottom + 16 },
      ]}
      refreshControl={
        <RefreshControl
          refreshing={fetchingTopups && !loadingTopups}
          onRefresh={refetchTopups}
          tintColor={colors.blue['400']}
        />
      }
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
  skeletons: {
    gap: 12,
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
