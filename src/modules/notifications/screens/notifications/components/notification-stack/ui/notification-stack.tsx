import dayjs from 'dayjs';
import { FC } from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { useTheme } from '@/shared/theme';

import { NotificationCard } from './notification-card';

interface Notification {
  time: string;
  message: string;
  isRead: boolean;
}

interface GroupedNotifications {
  date: string;
  items: Notification[];
}

interface NotificationStackProps {
  notifications: Notification[];
}

export const NotificationStack: FC<NotificationStackProps> = ({
  notifications,
}) => {
  const { colors } = useTheme();

  const groupNotificationsByDate = (
    items: Notification[],
  ): GroupedNotifications[] => {
    const groups = new Map<string, Notification[]>();
    const today = dayjs();
    const yesterday = today.subtract(1, 'day');

    items.forEach(notification => {
      const date = dayjs(notification.time);
      let dateKey: string;

      if (date.isSame(today, 'day')) {
        dateKey = 'Сегодня';
      } else if (date.isSame(yesterday, 'day')) {
        dateKey = 'Вчера';
      } else {
        dateKey = date.format('DD.MM.YYYY');
      }

      if (!groups.has(dateKey)) {
        groups.set(dateKey, []);
      }
      groups.get(dateKey)?.push(notification);
    });

    return Array.from(groups.entries()).map(([date, stack]) => ({
      date,
      items: stack,
    }));
  };

  const groupedNotifications = groupNotificationsByDate(notifications);

  if (notifications?.length !== 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={[styles.emptyText, { color: colors.gray['500'] }]}>
          У вас пока нет уведомлений
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {groupedNotifications.map(group => (
        <View key={group.date}>
          <Text style={[styles.dateHeader, { color: colors.gray['500'] }]}>
            {group.date}
          </Text>
          <View style={styles.notificationGroup}>
            {group.items.map(notification => (
              <NotificationCard
                key={notification.message}
                time={notification.time}
                message={notification.message}
                isRead={notification.isRead}
              />
            ))}
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 32,
    gap: 19,
  },
  dateHeader: {
    fontSize: 14,
    fontWeight: 700,
    marginBottom: 12,
  },
  notificationGroup: {
    gap: 19,
  },
  emptyContainer: {
    paddingTop: 64,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
  },
});
