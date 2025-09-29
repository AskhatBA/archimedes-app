import { FC } from 'react';
import { ScrollView, StyleSheet, View, Text } from 'react-native';

import { UserWelcomeContainer } from '@/shared/components/user-welcome-container';
import { MainLayout } from '@/shared/layout/main-layout';
import { colors } from '@/shared/theme';

import { AppointmentHistory } from '../components/appointment-history';
import { Compensation } from '../components/compensation';
import { Insurance } from '../components/insurance';
import { MyTests } from '../components/my-tests';

export const ProfileScreen: FC = () => {
  return (
    <ScrollView>
      <MainLayout>
        <UserWelcomeContainer />
        <View style={styles.main}>
          <Insurance />
          <Compensation />
          <MyTests />
          <AppointmentHistory />
          <View style={{ gap: 8 }}>
            <Text style={[styles.version, { color: colors.textMain }]}>
              Версия 1.0.0-beta
            </Text>
            <Text style={[styles.warning, { color: colors.gray['500'] }]}>
              Приложение находится в стадии бета-тестирования. Если вы
              обнаружили ошибку, пожалуйста, сообщите об этом в службу
              поддержки: support@archimedes.kz
            </Text>
          </View>
        </View>
      </MainLayout>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  main: {
    marginTop: 48,
    gap: 32,
  },
  version: {
    fontSize: 14,
    fontWeight: 500,
    textAlign: 'center',
  },
  warning: {
    fontSize: 12,
    textAlign: 'center',
  },
});
