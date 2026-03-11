import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { FC, useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import 'dayjs/locale/ru';

import { NotificationItem } from '@/api';
import {
  useNotifications,
  useMarkNotificationRead,
  useMarkAllNotificationsRead,
  useUnreadCount,
} from '@/modules/notifications';
import { ArrowBackIcon } from '@/shared/icons';
import { MainLayout } from '@/shared/layout/main-layout';
import { useNavigation } from '@/shared/navigation';
import { useTheme } from '@/shared/theme';

dayjs.extend(relativeTime);
dayjs.locale('ru');

export const NotificationsScreen: FC = () => {
  const { colors } = useTheme();
  const { goBack } = useNavigation();
  const { notifications, isLoading, refetch } = useNotifications();
  const { markAsRead } = useMarkNotificationRead();
  const { markAllAsRead, isLoading: isMarkingAllAsRead } =
    useMarkAllNotificationsRead();
  const { unreadCount } = useUnreadCount();
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const handleNotificationPress = async (notification: NotificationItem) => {
    if (!notification.isRead && notification.id) {
      await markAsRead({ notificationId: notification.id });
    }
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
  };

  const groupNotificationsByDate = (notifications: NotificationItem[] = []) => {
    const groups: { [key: string]: NotificationItem[] } = {};

    notifications.forEach(notification => {
      const date = dayjs(notification.createdAt);
      const today = dayjs();
      const yesterday = dayjs().subtract(1, 'day');

      let dateLabel: string;
      if (date.isSame(today, 'day')) {
        dateLabel = 'Сегодня';
      } else if (date.isSame(yesterday, 'day')) {
        dateLabel = 'Вчера';
      } else {
        dateLabel = date.format('D MMMM YYYY');
      }

      if (!groups[dateLabel]) {
        groups[dateLabel] = [];
      }
      groups[dateLabel].push(notification);
    });

    return groups;
  };

  const groupedNotifications = groupNotificationsByDate(notifications);

  return (
    <View style={[styles.container, { backgroundColor: colors.white }]}>
      <MainLayout>
        <View style={styles.header}>
          <View style={styles.headerTitleContainer}>
            <TouchableOpacity style={styles.backButton} onPress={goBack}>
              <ArrowBackIcon width={18} height={18} color={colors.primary} />
            </TouchableOpacity>
            <View>
              <Text style={[styles.headerTitle, { color: colors.textMain }]}>
                Уведомления
              </Text>
              {unreadCount ? (
                <Text
                  style={[styles.unreadCount, { color: colors.gray['500'] }]}
                >
                  {unreadCount} непрочитанных
                </Text>
              ) : null}
            </View>
            {unreadCount > 0 && (
              <TouchableOpacity
                onPress={handleMarkAllAsRead}
                disabled={isMarkingAllAsRead}
                style={[
                  styles.markAllButton,
                  { backgroundColor: colors.blue['100'] },
                ]}
              >
                {isMarkingAllAsRead ? (
                  <ActivityIndicator size="small" color={colors.primary} />
                ) : (
                  <Text style={[styles.markAllText, { color: colors.primary }]}>
                    Прочитать все
                  </Text>
                )}
              </TouchableOpacity>
            )}
          </View>
        </View>

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
        >
          {isLoading ? (
            <View style={styles.centerContainer}>
              <ActivityIndicator size="large" color={colors.primary} />
            </View>
          ) : !notifications || notifications.length === 0 ? (
            <View style={styles.centerContainer}>
              <Text style={[styles.emptyText, { color: colors.gray['500'] }]}>
                У вас пока нет уведомлений
              </Text>
            </View>
          ) : (
            <View style={styles.notificationsContainer}>
              {Object.entries(groupedNotifications).map(([date, items]) => (
                <View key={date} style={styles.dateGroup}>
                  <Text
                    style={[styles.dateHeader, { color: colors.gray['500'] }]}
                  >
                    {date}
                  </Text>
                  {items.map(notification => (
                    <NotificationCard
                      key={notification.id}
                      notification={notification}
                      onPress={() => handleNotificationPress(notification)}
                      colors={colors}
                    />
                  ))}
                </View>
              ))}
            </View>
          )}
        </ScrollView>
      </MainLayout>
    </View>
  );
};

interface NotificationCardProps {
  notification: NotificationItem;
  onPress: () => void;
  colors: any;
}

const NotificationCard: FC<NotificationCardProps> = ({
  notification,
  onPress,
  colors,
}) => {
  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'DELIVERED':
        return colors.green['600'];
      case 'FAILED':
        return colors.red['500'];
      default:
        return colors.gray['500'];
    }
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.notificationCard,
        {
          backgroundColor: notification.isRead
            ? colors.white
            : colors.blue['100'],
          borderColor: notification.isRead
            ? colors.gray['300']
            : colors.blue['350'],
        },
      ]}
      activeOpacity={0.7}
    >
      <View style={styles.notificationHeader}>
        <View style={styles.titleContainer}>
          {!notification.isRead && (
            <View
              style={[styles.unreadDot, { backgroundColor: colors.primary }]}
            />
          )}
          <Text
            style={[
              styles.notificationTitle,
              {
                color: colors.textMain,
                fontWeight: notification.isRead ? '500' : '600',
              },
            ]}
          >
            {notification.title || 'Уведомление'}
          </Text>
        </View>
        {notification.createdAt && (
          <Text style={[styles.timeText, { color: colors.gray['500'] }]}>
            {dayjs(notification.createdAt).fromNow()}
          </Text>
        )}
      </View>

      {notification.message && (
        <Text
          style={[
            styles.notificationMessage,
            {
              color: notification.isRead
                ? colors.gray['500']
                : colors.gray['600'],
            },
          ]}
          numberOfLines={3}
        >
          {notification.message}
        </Text>
      )}

      {notification.status && (
        <View style={styles.statusContainer}>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: `${getStatusColor(notification.status)}15` },
            ]}
          >
            <Text
              style={[
                styles.statusText,
                { color: getStatusColor(notification.status) },
              ]}
            >
              {notification.status === 'DELIVERED'
                ? 'Доставлено'
                : notification.status === 'FAILED'
                  ? 'Ошибка'
                  : 'Отправлено'}
            </Text>
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingBottom: 16,
    gap: 16,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  backButtonLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  headerTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  unreadCount: {
    fontSize: 14,
    marginTop: 4,
  },
  markAllButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  markAllText: {
    fontSize: 14,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
  },
  notificationsContainer: {
    paddingBottom: 20,
  },
  dateGroup: {
    marginBottom: 24,
  },
  dateHeader: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  notificationCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  notificationTitle: {
    fontSize: 16,
    flex: 1,
  },
  timeText: {
    fontSize: 12,
  },
  notificationMessage: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  statusContainer: {
    marginTop: 4,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
});
