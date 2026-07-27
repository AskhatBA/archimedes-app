import { FC, useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { BottomDrawer } from '@/shared/components/bottom-drawer';
import { Button } from '@/shared/components/button';
import { useAuth } from '@/shared/lib/auth';
import {
  getQuickAuthSnoozeUntil,
  setQuickAuthSnoozeUntil,
} from '@/shared/lib/auth/utils';
import {
  BiometryType,
  getBiometryType,
  isBiometricAvailable,
} from '@/shared/lib/biometrics';
import { useToast } from '@/shared/lib/toast';
import { routes, useNavigation } from '@/shared/navigation';
import { useTheme } from '@/shared/theme';

const THREE_DAYS_MS = 3 * 24 * 60 * 60 * 1000;

const labelFor = (type: BiometryType | null): string => {
  if (type === 'FaceID') return 'Face ID';
  if (type === 'TouchID') return 'Touch ID';
  return 'биометрию';
};

export const QuickAuthPrompt: FC = () => {
  const { colors } = useTheme();
  const { navigate } = useNavigation();
  const { showToast } = useToast();
  const { biometricEnabled, pinConfigured, enableBiometric } = useAuth();

  const [visible, setVisible] = useState(false);
  const [biometryLabel, setBiometryLabel] = useState<string | null>(null);
  const [isEnabling, setIsEnabling] = useState(false);

  const cancelledRef = useRef(false);

  useEffect(() => {
    cancelledRef.current = false;

    if (!biometricEnabled && !pinConfigured) {
      const checkAndShow = async () => {
        const snoozeUntil = await getQuickAuthSnoozeUntil();
        if (Date.now() < snoozeUntil) return;

        const available = await isBiometricAvailable();
        if (available) {
          const type = await getBiometryType();
          if (!cancelledRef.current) setBiometryLabel(labelFor(type));
        }

        await new Promise<void>(resolve => {
          setTimeout(resolve, 1500);
        });
        if (!cancelledRef.current) setVisible(true);
      };

      checkAndShow();
    }

    return () => {
      cancelledRef.current = true;
    };
  }, [biometricEnabled, pinConfigured]);

  const dismiss = useCallback(() => setVisible(false), []);

  const handleSnooze = useCallback(async () => {
    await setQuickAuthSnoozeUntil(Date.now() + THREE_DAYS_MS);
    dismiss();
  }, [dismiss]);

  const handleEnableBiometric = useCallback(async () => {
    setIsEnabling(true);
    try {
      const ok = await enableBiometric();
      if (ok) {
        showToast({ type: 'success', message: 'Вход по биометрии включён' });
        dismiss();
      } else {
        showToast({ type: 'error', message: 'Не удалось включить биометрию' });
      }
    } finally {
      setIsEnabling(false);
    }
  }, [enableBiometric, showToast, dismiss]);

  const handleSetPin = useCallback(() => {
    dismiss();
    navigate(routes.SetPin);
  }, [navigate, dismiss]);

  if (biometricEnabled || pinConfigured) return null;

  return (
    <BottomDrawer visible={visible} onClose={dismiss}>
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.textMain }]}>
          Настройте быстрый вход
        </Text>
        <Text style={[styles.description, { color: colors.gray[500] }]}>
          Биометрия или PIN-код позволят быстро вернуться в приложение без
          повторного SMS-кода при каждом обновлении сессии.
        </Text>

        <View style={styles.buttons}>
          {biometryLabel !== null && (
            <Button isLoading={isEnabling} onPress={handleEnableBiometric}>
              {`Включить ${biometryLabel}`}
            </Button>
          )}
          <Button variant="secondary" onPress={handleSetPin}>
            Установить PIN-код
          </Button>
          <TouchableOpacity onPress={handleSnooze} style={styles.snoozeButton}>
            <Text style={[styles.snoozeText, { color: colors.gray[500] }]}>
              Напомнить через 3 дня
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </BottomDrawer>
  );
};

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 24,
    paddingTop: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 10,
  },
  description: {
    fontSize: 15,
    lineHeight: 21,
    marginBottom: 24,
  },
  buttons: {
    gap: 12,
  },
  snoozeButton: {
    alignSelf: 'center',
    paddingVertical: 10,
  },
  snoozeText: {
    fontSize: 15,
  },
});
