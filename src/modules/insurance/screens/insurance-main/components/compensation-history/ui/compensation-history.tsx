import { FC } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';

import { CompensationCard } from '@/modules/insurance/screens/compensation/components/history/ui/compensation-card';
import { SkeletonElement } from '@/shared/components/skeleton-element';
import { useUserCompensationRequests } from '@/shared/lib/insurance';
import { useNavigation, routes } from '@/shared/navigation';
import { colors, globalStyles, useTheme } from '@/shared/theme';

export const CompensationHistory: FC = () => {
  const { colors: themeColors } = useTheme();
  const { navigate } = useNavigation();
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
        {!!(compensationRequests && compensationRequests.length > 0) && (
          <TouchableOpacity
            onPress={() => navigate(routes.CompensationsHistory)}
          >
            <Text style={[styles.showAllText, { color: themeColors.primary }]}>
              Показать все
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {!compensationRequests || compensationRequests.length === 0 ? (
        <Text style={[styles.noItemsText, { color: colors.gray['500'] }]}>
          У вас пока нет заявок на возмещение
        </Text>
      ) : (
        <View style={styles.list}>
          {compensationRequests.slice(0, 3).map(request => (
            <CompensationCard key={request.id} {...request} />
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
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
