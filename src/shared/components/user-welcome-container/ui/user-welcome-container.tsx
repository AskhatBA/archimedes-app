import { FC } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

import NotificationIcon from '@/assets/icons/tab-bar-notifications.svg';
import UserIcon from '@/assets/icons/user-filled.svg';
import { useUser } from '@/shared/lib/user';
import { colors } from '@/shared/theme';

export const UserWelcomeContainer: FC = () => {
  const { user } = useUser();

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        <View style={[styles.userIcons, { backgroundColor: colors.blue[100] }]}>
          <UserIcon color={colors.primary} />
        </View>
        <View>
          <Text style={styles.text1}>Добрый день,</Text>
          <Text style={styles.text2}>
            {user?.firstName} {user?.lastName}
          </Text>
        </View>
      </View>
      <TouchableOpacity>
        <NotificationIcon width={35} height={35} color={colors.primary} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  userIcons: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 44,
    height: 44,
    borderRadius: 44,
  },
  text1: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '300',
  },
  text2: {
    fontSize: 18,
    lineHeight: 22,
    fontWeight: '600',
  },
});
