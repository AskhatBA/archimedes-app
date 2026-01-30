import { useRoute } from '@react-navigation/native';
import { FC } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { useElectronicReferrals } from '@/modules/insurance';
import { useTheme } from '@/shared/theme';

interface RouteParams {
  programId: string;
}

export const ElectronicReferralsScreen: FC = () => {
  const route = useRoute();
  const { colors } = useTheme();
  const { programId } = route.params as RouteParams;

  const { electronicReferrals, loadingElectronicReferrals } =
    useElectronicReferrals(programId);

  if (loadingElectronicReferrals) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    );
  }

  if (!electronicReferrals?.electronicReferrals?.length) {
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
      data={electronicReferrals.electronicReferrals}
      keyExtractor={item => String(item.id)}
      ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
      renderItem={({ item }) => (
        <View
          style={[
            styles.card,
            {
              backgroundColor: colors.gray['200'],
              borderColor: colors.gray['300'],
            },
          ]}
        >
          {!!item.date && (
            <Text style={[styles.date, { color: colors.gray['500'] }]}>
              {item.date}
            </Text>
          )}

          {!!item.name && (
            <Text style={[styles.title, { color: colors.textMain }]}>
              {item.name}
            </Text>
          )}

          {!!item.medical_institution && (
            <Text style={[styles.subtitle, { color: colors.gray['500'] }]}>
              {item.medical_institution}
            </Text>
          )}

          {!!item.diagnosis && (
            <Text style={[styles.subtitle, { color: colors.gray['500'] }]}>
              Диагноз: {item.diagnosis}
            </Text>
          )}

          {(item.amount != null || item.currency) && (
            <Text style={[styles.amount, { color: colors.primary }]}>
              {item.amount != null ? item.amount : ''}
              {item.currency ? ` ${item.currency}` : ''}
            </Text>
          )}

          {!!item.appointmentDetail?.length && (
            <View style={{ marginTop: 8, gap: 4 }}>
              {item.appointmentDetail.map(detail => (
                <Text
                  key={`${item.id}-${detail.id}-${detail.service}`}
                  style={{ color: colors.gray['500'], fontSize: 12 }}
                >
                  {detail.service}
                  {detail.amount != null ? ` — ${detail.amount}` : ''}
                </Text>
              ))}
            </View>
          )}
        </View>
      )}
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
  card: {
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
  },
  date: {
    fontSize: 12,
  },
  title: {
    marginTop: 4,
    fontSize: 16,
    fontWeight: '600',
  },
  subtitle: {
    marginTop: 2,
    fontSize: 13,
  },
  amount: {
    marginTop: 6,
    fontSize: 14,
    fontWeight: '600',
  },
});
