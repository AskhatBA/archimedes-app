import { FC } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';

import UserIcon from '@/assets/icons/user-filled.svg';
import { LogoutIcon, TabBarNotificationsIcon } from '@/shared/icons';
import { useAuth } from '@/shared/lib/auth';
import { useUser } from '@/shared/lib/user';
import { routes, useNavigation } from '@/shared/navigation';
import { colors, fonts } from '@/shared/theme';

export const UserWelcomeContainer: FC = () => {
  const { user } = useUser();
  const { logout } = useAuth();
  const { navigate } = useNavigation();

  const goToNotifications = () => navigate(routes.Notifications);

  const confirmLogout = () =>
    Alert.alert('Подтверждение', 'Вы действительно хотите выйти из аккаунта?', [
      { text: 'Отмена', style: 'cancel' },
      { text: 'Выйти', style: 'destructive', onPress: logout },
    ]);

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
      <View style={styles.actions}>
        <TouchableOpacity
          onPress={goToNotifications}
          accessibilityLabel="Открыть уведомления"
        >
          <TabBarNotificationsIcon
            color={colors.primary}
            width={30}
            height={30}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={confirmLogout}
          accessibilityLabel="Выйти из аккаунта"
        >
          <LogoutIcon width={30} height={30} color={colors.primary} />
        </TouchableOpacity>
      </View>
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
    fontWeight: 300,
    fontFamily: fonts.SFPro.Light,
  },
  text2: {
    fontSize: 18,
    lineHeight: 22,
    fontWeight: 600,
    fontFamily: fonts.SFPro.Semibold,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24,
  },
});
