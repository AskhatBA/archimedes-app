import { FC } from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { SkeletonElement } from '@/shared/components/skeleton-element';
import { useTranslation } from '@/shared/lib/i18n';
import { colors, fonts } from '@/shared/theme';

import { useBookingHistory } from '../../../hooks/use-booking-history';

import { BookingHistoryCard } from './booking-history-card';

/** Every visit the patient booked through the app, from our own backend. */
export const BookingHistory: FC = () => {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  const {
    bookings,
    loadingBookings,
    fetchingBookings,
    bookingsError,
    refetchBookings,
  } = useBookingHistory();

  const renderEmpty = () => {
    if (loadingBookings) {
      return (
        <View style={styles.skeletons}>
          {[0, 1, 2].map(key => (
            <SkeletonElement key={key} height={148} borderRadius={16} />
          ))}
        </View>
      );
    }

    return (
      <View style={styles.empty}>
        <Text style={styles.emptyTitle}>
          {bookingsError
            ? t('appointments:bookingHistory.error')
            : t('appointments:emptyHistory')}
        </Text>
        {!bookingsError && (
          <Text style={styles.emptySubtitle}>
            {t('appointments:bookingHistory.emptySubtitle')}
          </Text>
        )}
      </View>
    );
  };

  return (
    <FlatList
      data={bookings}
      keyExtractor={booking => booking.id}
      renderItem={({ item }) => <BookingHistoryCard booking={item} />}
      ListEmptyComponent={renderEmpty()}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[
        styles.content,
        { paddingBottom: insets.bottom + 16 },
      ]}
      refreshControl={
        <RefreshControl
          refreshing={fetchingBookings && !loadingBookings}
          onRefresh={refetchBookings}
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
