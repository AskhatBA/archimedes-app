import { FC } from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { SkeletonElement } from '@/shared/components/skeleton-element';
import { useUserCompensationRequests } from '@/shared/lib/insurance';
import { colors, globalStyles } from '@/shared/theme';

import { CompensationCard } from './compensation-card';

export const CompensationHistory: FC = () => {
  const { compensationRequests, loadingCompensationRequests } =
    useUserCompensationRequests();

  if (loadingCompensationRequests) {
    return (
      <View style={styles.loaderContainer}>
        <SkeletonElement height={150} />
        <SkeletonElement height={150} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={globalStyles.sectionHeading}>История возмещений</Text>
      </View>

      {!compensationRequests || compensationRequests.length === 0 ? (
        <Text style={[styles.noItemsText, { color: colors.gray['500'] }]}>
          У вас пока нет заявок на возмещение
        </Text>
      ) : (
        <View style={styles.list}>
          {compensationRequests.map(request => (
            <CompensationCard key={request.id} {...request} />
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 4,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  list: {
    gap: 16,
  },
  noItemsText: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 16,
  },
  showAllText: {
    fontSize: 14,
    fontWeight: '600',
  },
  loaderContainer: {
    marginTop: 16,
    gap: 8,
  },
});
