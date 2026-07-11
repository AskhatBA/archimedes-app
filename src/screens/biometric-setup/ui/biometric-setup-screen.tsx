import { FC, useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/shared/components/button';
import { useAuth } from '@/shared/lib/auth';
import { BiometryType, getBiometryType } from '@/shared/lib/biometrics';
import { useToast } from '@/shared/lib/toast';
import { routes, useNavigation } from '@/shared/navigation';
import { useTheme } from '@/shared/theme';

const labelFor = (type: BiometryType | null): string => {
  if (type === 'FaceID') return 'Face ID';
  if (type === 'TouchID') return 'Touch ID';
  return 'биометрию';
};

/**
 * One-time onboarding shown right after login: offers to turn on biometric
 * login so the user doesn't have to re-enter an OTP after each 15-min session.
 */
export const BiometricSetupScreen: FC = () => {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { resetNavigation } = useNavigation();
  const { showToast } = useToast();
  const { enableBiometric, dismissBiometricOffer } = useAuth();

  const [label, setLabel] = useState('биометрию');
  const [isEnabling, setIsEnabling] = useState(false);

  // The offer is shown once — mark it as handled as soon as it appears.
  useEffect(() => {
    dismissBiometricOffer();
    getBiometryType().then(type => setLabel(labelFor(type)));
  }, [dismissBiometricOffer]);

  const goToApp = useCallback(() => {
    resetNavigation(routes.TabNavigation);
  }, [resetNavigation]);

  const handleEnable = useCallback(async () => {
    setIsEnabling(true);
    try {
      const ok = await enableBiometric();
      if (ok) {
        showToast({ type: 'success', message: 'Вход по биометрии включён' });
        goToApp();
      } else {
        showToast({
          type: 'error',
          message: 'Не удалось включить. Можно сделать это позже в профиле',
        });
      }
    } finally {
      setIsEnabling(false);
    }
  }, [enableBiometric, showToast, goToApp]);

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.backgroundMain,
          paddingTop: insets.top + 24,
          paddingBottom: insets.bottom + 24,
        },
      ]}
    >
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.textMain }]}>
          Быстрый вход
        </Text>
        <Text style={[styles.description, { color: colors.gray[500] }]}>
          Включите вход по {label}, чтобы не вводить код из SMS каждый раз при
          возвращении в приложение.
        </Text>
      </View>

      <View style={styles.actions}>
        <Button isLoading={isEnabling} onPress={handleEnable}>
          {`Включить ${label}`}
        </Button>
        <TouchableOpacity onPress={goToApp} style={styles.skipButton}>
          <Text style={[styles.skipText, { color: colors.gray[500] }]}>
            Позже
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 32,
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    lineHeight: 22,
    textAlign: 'center',
  },
  actions: {
    gap: 12,
  },
  skipButton: {
    alignSelf: 'center',
    padding: 12,
  },
  skipText: {
    fontSize: 16,
  },
});
