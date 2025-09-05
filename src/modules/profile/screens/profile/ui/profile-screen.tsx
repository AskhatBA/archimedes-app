import { FC } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
} from 'react-native';

import { UserWelcomeContainer } from '@/shared/components/user-welcome-container';
import { LogoutIcon } from '@/shared/icons';
import { MainLayout } from '@/shared/layout/main-layout';
import { useAuth } from '@/shared/lib/auth';
import { colors } from '@/shared/theme';

import { Compensation } from '../components/compensation';
import { Insurance } from '../components/insurance';
import { MyTests } from '../components/my-tests';

export const ProfileScreen: FC = () => {
  const { logout } = useAuth();

  return (
    <SafeAreaView style={styles.wrapper}>
      <ScrollView>
        <MainLayout>
          <UserWelcomeContainer />
          <View style={styles.main}>
            <Insurance />
            <Compensation />
            <MyTests />
            <TouchableOpacity style={styles.logoutContainer} onPress={logout}>
              <LogoutIcon width={16} height={16} color={colors.textMain} />
              <Text style={[styles.logoutText, { color: colors.textMain }]}>
                Выйти
              </Text>
            </TouchableOpacity>
          </View>
        </MainLayout>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
  },
  main: {
    marginTop: 48,
    gap: 32,
  },
  logoutContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: 600,
  },
});
