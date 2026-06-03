import { FC } from 'react';
import { ScrollView, StyleSheet, View, Text } from 'react-native';
import DeviceInfo from 'react-native-device-info';

import { MainLayout } from '@/shared/layout/main-layout';
import { useTranslation } from '@/shared/lib/i18n';
import { colors } from '@/shared/theme';

import { AppointmentHistory } from './appointments-history';
import { LanguageSwitcher } from './language-switcher';
import { MyTests } from './my-tests';

const SUPPORT_EMAIL = 'archimedes.medical.group.kaz@gmail.com';

export const ProfileScreen: FC = () => {
  const { t } = useTranslation();
  const currentVersion = DeviceInfo.getVersion();

  return (
    <ScrollView>
      <MainLayout>
        <View style={styles.main}>
          <MyTests />
          <AppointmentHistory />
          <LanguageSwitcher />
          <View style={{ gap: 8 }}>
            <Text style={[styles.version, { color: colors.textMain }]}>
              {t('profile:version', { version: currentVersion })}
            </Text>
            <Text style={[styles.warning, { color: colors.gray['500'] }]}>
              {t('profile:betaWarning', { email: SUPPORT_EMAIL })}
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
