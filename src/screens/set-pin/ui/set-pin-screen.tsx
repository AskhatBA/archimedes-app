import { FC, useCallback, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { OtpInput, OtpInputRef } from 'react-native-otp-entry';

import { resolveErrorMessage } from '@/api';
import { useAuth } from '@/shared/lib/auth';
import { useToast } from '@/shared/lib/toast';
import { useNavigation } from '@/shared/navigation';
import { useTheme } from '@/shared/theme';

type Step = 'enter' | 'confirm';

export const SetPinScreen: FC = () => {
  const { colors } = useTheme();
  const { setPin } = useAuth();
  const { showToast } = useToast();
  const { goBack } = useNavigation();

  const otpRef = useRef<OtpInputRef>(null);
  const [step, setStep] = useState<Step>('enter');
  const [firstPin, setFirstPin] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const reset = useCallback(() => {
    setStep('enter');
    setFirstPin('');
    otpRef.current?.clear();
  }, []);

  const handleFilled = useCallback(
    async (pin: string) => {
      if (step === 'enter') {
        setFirstPin(pin);
        setStep('confirm');
        otpRef.current?.clear();
        return;
      }

      if (pin !== firstPin) {
        showToast({ type: 'error', message: 'PIN-коды не совпадают' });
        reset();
        return;
      }

      setIsSaving(true);
      try {
        await setPin(pin);
        showToast({ type: 'success', message: 'PIN-код установлен' });
        goBack();
      } catch (err) {
        showToast({ type: 'error', message: resolveErrorMessage(err) });
        reset();
      } finally {
        setIsSaving(false);
      }
    },
    [step, firstPin, setPin, showToast, goBack, reset],
  );

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.textMain }]}>
          {step === 'enter' ? 'Придумайте PIN-код' : 'Повторите PIN-код'}
        </Text>
        <Text style={[styles.description, { color: colors.gray[500] }]}>
          4 цифры для быстрого входа
        </Text>

        <View style={styles.otpContainer}>
          <OtpInput
            key={step}
            ref={otpRef}
            numberOfDigits={4}
            secureTextEntry
            disabled={isSaving}
            onFilled={handleFilled}
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
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 32,
    paddingTop: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    marginBottom: 32,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 32,
  },
});
