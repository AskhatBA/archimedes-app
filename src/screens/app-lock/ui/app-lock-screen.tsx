import { FC, useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { OtpInput, OtpInputRef } from 'react-native-otp-entry';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { resolveErrorMessage } from '@/api';
import { Button } from '@/shared/components/button';
import { useAuth } from '@/shared/lib/auth';
import { useToast } from '@/shared/lib/toast';
import { useTheme } from '@/shared/theme';

/**
 * Full-screen overlay shown when the 15-minute access token expires. The user
 * re-authenticates with biometrics (fast path) or a PIN (fallback). On success
 * the session is refreshed and the overlay disappears.
 */
export const AppLockScreen: FC = () => {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { showToast } = useToast();
  const {
    biometricEnabled,
    pinConfigured,
    unlockWithBiometrics,
    unlockWithPin,
    logout,
  } = useAuth();

  const otpRef = useRef<OtpInputRef>(null);
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [triedBiometric, setTriedBiometric] = useState(false);

  const handleBiometric = useCallback(async () => {
    setIsUnlocking(true);
    await unlockWithBiometrics();
    setIsUnlocking(false);
  }, [unlockWithBiometrics]);

  // Auto-trigger the biometric prompt once when the screen appears.
  useEffect(() => {
    if (biometricEnabled && !triedBiometric) {
      setTriedBiometric(true);
      handleBiometric();
    }
  }, [biometricEnabled, triedBiometric, handleBiometric]);

  const handlePin = useCallback(
    async (pin: string) => {
      setIsUnlocking(true);
      try {
        await unlockWithPin(pin);
      } catch (err) {
        showToast({ type: 'error', message: resolveErrorMessage(err) });
        otpRef.current?.clear();
      } finally {
        setIsUnlocking(false);
      }
    },
    [unlockWithPin, showToast],
  );

  return (
    <View
      style={[
        styles.overlay,
        {
          backgroundColor: colors.backgroundMain,
          paddingTop: insets.top + 24,
          paddingBottom: insets.bottom + 24,
        },
      ]}
    >
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.textMain }]}>
          Сессия заблокирована
        </Text>
        <Text style={[styles.description, { color: colors.gray[500] }]}>
          {pinConfigured
            ? 'Введите PIN-код или войдите по биометрии'
            : 'Подтвердите вход по биометрии'}
        </Text>

        {pinConfigured && (
          <View style={styles.otpContainer}>
            <OtpInput
              ref={otpRef}
              numberOfDigits={4}
              secureTextEntry
              onFilled={handlePin}
              focusColor={colors.primary}
              theme={{
                pinCodeContainerStyle: {
                  borderWidth: 2,
                  borderColor: colors.gray['300'],
                  width: 65,
                  height: 65,
                },
                focusedPinCodeContainerStyle: { borderColor: colors.primary },
                pinCodeTextStyle: { color: colors.textMain },
              }}
            />
          </View>
        )}

        {biometricEnabled && (
          <Button
            variant="secondary"
            isLoading={isUnlocking}
            onPress={handleBiometric}
            style={styles.biometricButton}
          >
            Войти по биометрии
          </Button>
        )}
      </View>

      <TouchableOpacity onPress={logout} style={styles.logoutButton}>
        <Text style={[styles.logoutText, { color: colors.gray[500] }]}>
          Выйти из аккаунта
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1000,
    elevation: 1000,
    paddingHorizontal: 32,
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    marginBottom: 32,
    textAlign: 'center',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 24,
  },
  biometricButton: {
    marginTop: 8,
  },
  logoutButton: {
    alignSelf: 'center',
    padding: 12,
  },
  logoutText: {
    fontSize: 16,
  },
});
