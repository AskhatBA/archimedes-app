import dayjs from 'dayjs';
import { FC } from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { SessionHistoryItem, useSessionHistory } from '@/modules/auth';
import { usePageHeader } from '@/shared/hooks';
import { SmartphoneIcon } from '@/shared/icons';
import { MainLayout } from '@/shared/layout/main-layout';
import { colors, fonts } from '@/shared/theme';

const methodLabel = (method: SessionHistoryItem['method']): string =>
  method === 'PIN' ? 'Вход по PIN-коду' : 'Вход по SMS-коду';

const deviceLabel = (userAgent: string | null): string => {
  if (!userAgent) return 'Неизвестное устройство';
  const ua = userAgent.toLowerCase();
  if (ua.includes('iphone') || ua.includes('ios') || ua.includes('darwin')) {
    return 'iPhone';
  }
  if (ua.includes('ipad')) return 'iPad';
  if (ua.includes('android') || ua.includes('okhttp')) return 'Android';
  return userAgent;
};

const SessionCard: FC<{ session: SessionHistoryItem }> = ({ session }) => (
  <View style={styles.card}>
    <View style={styles.cardHeader}>
      <View style={styles.deviceRow}>
        <SmartphoneIcon width={18} height={18} color={colors.blue[500]} />
        <Text style={styles.device}>{deviceLabel(session.userAgent)}</Text>
      </View>
      <Text style={styles.date}>
        {dayjs(session.createdAt).format('DD.MM.YYYY, HH:mm')}
      </Text>
    </View>
    <Text style={styles.method}>{methodLabel(session.method)}</Text>
    {session.ipAddress ? (
      <Text style={styles.ip}>IP: {session.ipAddress}</Text>
    ) : null}
  </View>
);

export const SessionHistoryScreen: FC = () => {
  usePageHeader({ title: 'История входов' });

  const { sessions, isLoading, refetch } = useSessionHistory();

  const renderContent = () => {
    if (isLoading && sessions.length === 0) {
      return (
        <View style={styles.centered}>
          <ActivityIndicator color={colors.primary} size="large" />
        </View>
      );
    }

    if (sessions.length === 0) {
      return (
        <View style={styles.centered}>
          <Text style={styles.emptyText}>История входов пуста</Text>
        </View>
      );
    }

    return (
      <View style={styles.list}>
        {sessions.map(session => (
          <SessionCard key={session.id} session={session} />
        ))}
      </View>
    );
  };

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={isLoading} onRefresh={refetch} />
      }
    >
      <MainLayout>{renderContent()}</MainLayout>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  list: {
    gap: 10,
  },
  card: {
    backgroundColor: colors.gray[200],
    borderRadius: 14,
    padding: 14,
    gap: 6,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  deviceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  device: {
    fontSize: 15,
    fontFamily: fonts.SFPro.Semibold,
    color: colors.gray[700],
  },
  date: {
    fontSize: 12,
    fontFamily: fonts.SFPro.Regular,
    color: colors.gray[500],
  },
  method: {
    fontSize: 13,
    fontFamily: fonts.SFPro.Regular,
    color: colors.gray[600],
  },
  ip: {
    fontSize: 12,
    fontFamily: fonts.SFPro.Regular,
    color: colors.gray[500],
  },
  centered: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
  },
  emptyText: {
    fontSize: 14,
    fontFamily: fonts.SFPro.Regular,
    color: colors.gray[500],
  },
});
