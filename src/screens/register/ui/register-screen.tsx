import { useRoute } from '@react-navigation/native';
import { FC } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

import { RegisterForm } from '@/modules/auth';
import { SCREEN_WIDTH } from '@/shared/constants';
import { useTranslation } from '@/shared/lib/i18n';
import { routes, useNavigation } from '@/shared/navigation';
import { useTheme } from '@/shared/theme';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const logoImage = require('@/assets/images/main-logo.png');

interface RouteParams {
  phone?: string;
  iin?: string;
}

export const RegisterScreen: FC = () => {
  const route = useRoute();
  const { phone, iin } = (route.params ?? {}) as RouteParams;
  const { colors } = useTheme();
  const { t } = useTranslation();
  const { navigate } = useNavigation();

  return (
    <SafeAreaView style={styles.wrapper}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.wrapper}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={[styles.container, { width: SCREEN_WIDTH }]}>
            <Image
              source={logoImage}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={[styles.title, { color: colors.blue['400'] }]}>
              {t('auth:registerTitle')}
            </Text>
            <Text style={[styles.subtitle, { color: colors.gray['500'] }]}>
              {t('auth:registerStepOneSubtitle')}
            </Text>

            <View style={styles.formContainer}>
              <RegisterForm initialPhone={phone} initialIin={iin} />

              <TouchableOpacity
                style={styles.switchButton}
                activeOpacity={0.7}
                onPress={() => navigate(routes.SignIn)}
              >
                <Text
                  style={[styles.switchText, { color: colors.blue['400'] }]}
                >
                  {t('auth:alreadyHaveAccount')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  formContainer: {
    width: SCREEN_WIDTH,
    paddingHorizontal: 32,
    marginTop: 40,
  },
  title: {
    fontSize: 21,
    fontWeight: 700,
    marginTop: 45,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    marginTop: 10,
    paddingHorizontal: 40,
  },
  wrapper: {
    flex: 1,
  },
  logo: {
    width: 180,
    height: 75,
  },
  scrollContent: {
    flexGrow: 1,
  },
  switchButton: {
    paddingVertical: 16,
    marginTop: 8,
  },
  switchText: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
});
