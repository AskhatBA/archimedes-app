import { FC } from 'react';
import { View, StyleSheet } from 'react-native';

import { NotificationCard } from './notification-card';

interface NotificationStackProps {
  notifications: { time: string; message: string; isRead: boolean }[];
}

export const NotificationStack: FC<NotificationStackProps> = ({
  notifications,
}) => {
  return (
    <View style={styles.container}>
      {notifications.map(notification => (
        <NotificationCard
          key={notification.message}
          time={notification.time}
          message={notification.message}
          isRead={notification.isRead}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 32,
    gap: 19,
  },
});
