import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { FC } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import 'dayjs/locale/ru';

import { ClockIcon } from '@/shared/icons';
import { useTheme } from '@/shared/theme';

dayjs.extend(relativeTime);
dayjs.locale('ru');

interface NotificationCardProps {
  time: string | Date;
  message: string;
  isRead?: boolean;
}

export const NotificationCard: FC<NotificationCardProps> = ({
  time,
  message,
  isRead,
}) => {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isRead ? colors.gray['200'] : colors.blue['100'] },
      ]}
    >
      <View
        style={[
          styles.box,
          {
            backgroundColor: isRead ? colors.gray['250'] : colors.blue['150'],
            opacity: isRead ? 0.3 : 1,
          },
        ]}
      />
      <View style={{ flex: 1 }}>
        <Text
          style={[
            styles.message,
            { color: isRead ? colors.gray['500'] : colors.gray['600'] },
          ]}
        >
          {message}
        </Text>
        <View style={styles.timeContainer}>
          <ClockIcon
            width={15}
            height={15}
            style={{ marginTop: 7 }}
            color={isRead ? colors.gray['500'] : colors.blue['400']}
          />
          <Text
            style={[
              styles.time,
              { color: isRead ? colors.gray['500'] : colors.blue['400'] },
            ]}
          >
            {dayjs(time).fromNow()}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 18,
    paddingVertical: 17,
    borderRadius: 15,
    gap: 18,
  },
  box: {
    width: 50,
    height: 50,
    borderRadius: 10,
  },
  message: {
    fontSize: 13,
    fontWeight: 500,
  },
  time: {
    fontSize: 10,
    fontWeight: 500,
    lineHeight: 22,
    marginTop: 8,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
});
