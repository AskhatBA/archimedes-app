import { useRoute } from '@react-navigation/native';
import { FC, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  useElectronicReferrals,
  ElectronicReferralCard,
} from '@/modules/insurance';
import { usePageHeader } from '@/shared/hooks';
import { useTheme } from '@/shared/theme';

interface RouteParams {
  programId: string;
}

export const ElectronicReferralsScreen: FC = () => {
  usePageHeader({ title: 'Электронные направления' });

  const route = useRoute();
  const { colors } = useTheme();
  const { programId } = route.params as RouteParams;

  const [expandedCardId, setExpandedCardId] = useState<number | null>(null);
  const { electronicReferrals, loadingElectronicReferrals } =
    useElectronicReferrals(programId);

  const toggleCardExpansion = (id: number) => {
    setExpandedCardId(prev => (prev === id ? null : id));
  };

  if (loadingElectronicReferrals) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    );
  }

  if (!electronicReferrals?.length) {
    return (
      <View style={[styles.container]}>
        <Text style={{ color: colors.gray['500'], textAlign: 'center' }}>
          Электронные направления отсутствуют
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      contentContainerStyle={styles.container}
      data={electronicReferrals}
      keyExtractor={item => String(item.id)}
      ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
      renderItem={({ item }) => {
        return (
          <ElectronicReferralCard
            key={item.id}
            electronicReferralItem={item}
            onCardPress={id => toggleCardExpansion(id)}
            isExpanded={expandedCardId === item.id}
          />
        );
      }}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  centered: {
    marginTop: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
