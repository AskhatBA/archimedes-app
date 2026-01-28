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
} from 'react-native';

import { SignInForm } from '@/modules/auth';
import { SCREEN_WIDTH } from '@/shared/constants';
import { useTheme } from '@/shared/theme';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const logoImage = require('@/assets/images/main-logo.png');

export const SignInScreen: FC = () => {
  const { colors } = useTheme();

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
              Войти в приложение
            </Text>
            <View style={styles.formContainer}>
              <SignInForm />
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
    marginTop: 50,
  },
  title: {
    fontSize: 21,
    fontWeight: 700,
    marginTop: 45,
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
});
