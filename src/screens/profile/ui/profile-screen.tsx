import { FC } from 'react';
import { ScrollView, StyleSheet, View, Text } from 'react-native';
import DeviceInfo from 'react-native-device-info';

import { MainLayout } from '@/shared/layout/main-layout';
import { colors } from '@/shared/theme';

import { AppointmentHistory } from './appointments-history';
import { MyTests } from './my-tests';

export const ProfileScreen: FC = () => {
  const currentVersion = DeviceInfo.getVersion();

  return (
    <ScrollView>
      <MainLayout>
        <View style={styles.main}>
          <MyTests />
          <AppointmentHistory />
          <View style={{ gap: 8 }}>
            <Text style={[styles.version, { color: colors.textMain }]}>
              Версия {currentVersion}-beta
            </Text>
            <Text style={[styles.warning, { color: colors.gray['500'] }]}>
              Приложение находится в стадии бета-тестирования. Если вы
              обнаружили ошибку, пожалуйста, сообщите об этом в службу
              поддержки: archimedes.medical.group.kaz@gmail.com
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
    gap: 16,
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
