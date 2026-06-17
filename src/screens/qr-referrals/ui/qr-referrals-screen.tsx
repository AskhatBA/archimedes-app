import { useRoute } from '@react-navigation/native';
import { FC, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { useQrAppointments } from '@/modules/insurance';
import { usePageHeader } from '@/shared/hooks';
import { HospitalIcon } from '@/shared/icons';
import { useTheme } from '@/shared/theme';

import { QrReferralCard } from './qr-referral-card';

interface RouteParams {
  clinicId: string;
  clinicName?: string;
}

export const QrReferralsScreen: FC = () => {
  const route = useRoute();
  const { colors } = useTheme();
  const { clinicId, clinicName } = route.params as RouteParams;

  usePageHeader({ title: 'Направления' });

  const { appointments, isLoading } = useQrAppointments(clinicId);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const handleCardPress = (id: number) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  const handleConfirm = (id: number) => {
    Alert.alert('Подтверждение', `Подтвердить направление #${id}?`, [
      { text: 'Отмена', style: 'cancel' },
      { text: 'Подтвердить', onPress: () => {} },
    ]);
  };

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    );
  }

  if (!appointments.length) {
    return (
      <View style={styles.centered}>
        <Text style={[styles.emptyText, { color: colors.gray['500'] }]}>
          Направления не найдены
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={appointments}
      keyExtractor={item => String(item.id)}
      contentContainerStyle={styles.container}
      ListHeaderComponent={
        clinicName ? (
          <View
            style={[
              styles.clinicHeader,
              {
                backgroundColor: colors.blue['100'],
                borderColor: colors.blue['200'],
              },
            ]}
          >
            <View
              style={[
                styles.clinicIconWrap,
                { backgroundColor: colors.blue['150'] },
              ]}
            >
              <HospitalIcon width={20} height={20} color={colors.blue['400']} />
            </View>
            <Text
              style={[styles.clinicName, { color: colors.blue['400'] }]}
              numberOfLines={2}
            >
              {clinicName}
            </Text>
          </View>
        ) : null
      }
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      renderItem={({ item }) => (
        <QrReferralCard
          item={item}
          isExpanded={expandedId === item.id}
          onPress={handleCardPress}
          onConfirm={handleConfirm}
        />
      )}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  separator: {
    height: 12,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 15,
    textAlign: 'center',
  },
  clinicHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    marginBottom: 16,
  },
  clinicIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  clinicName: {
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 20,
  },
});
