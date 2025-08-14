import { FC, useCallback, useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { MaskedTextInput } from 'react-native-mask-text';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/shared/components/button';
import { routes, useNavigation } from '@/shared/navigation';
import { useTheme } from '@/shared/theme';

export const OtpVerificationScreen: FC = () => {
  const { colors } = useTheme();
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const [otpCode, setOtpCode] = useState(['', '', '', '']);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef<Array<TextInput | null>>([null, null, null, null]);
  const { navigate } = useNavigation();

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (timer > 0) {
        setTimer(prev => prev - 1);
      } else {
        setCanResend(true);
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  const handleOtpChange = useCallback(
    (value: string, index: number) => {
      const newOtp = [...otpCode];
      newOtp[index] = value;
      setOtpCode(newOtp);

      if (value && index < 3 && !otpCode[index]) {
        inputRefs.current[index + 1]?.focus();
      }
    },
    [otpCode],
  );

  const handleResend = useCallback(() => {
    if (canResend) {
      setTimer(60);
      setCanResend(false);
      // Add resend logic here
    }
  }, [canResend]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.textMain }]}>
          Подтверждение
        </Text>
        <Text style={[styles.description, { color: colors.gray[500] }]}>
          Введите код из SMS
        </Text>

        <View style={styles.otpContainer}>
          {otpCode.map((digit, index) => (
            <MaskedTextInput
              mask="9"
              ref={ref => {
                inputRefs.current[index] = ref;
              }}
              onFocus={() => setFocusedIndex(index)}
              onBlur={() => setFocusedIndex(null)}
              style={[styles.otpInput, { borderColor: colors.gray[300] }]}
              value={digit}
              onChangeText={value => {
                handleOtpChange(value, index);
              }}
              onKeyPress={({ nativeEvent }) => {
                if (otpCode[index] && /^[0-9]$/.test(nativeEvent.key)) {
                  handleOtpChange(nativeEvent.key, index);
                }
                if (nativeEvent.key === 'Backspace' && !digit && index > 0) {
                  inputRefs.current[index - 1]?.focus();
                }
              }}
              keyboardType="numeric"
              maxLength={1}
            />
          ))}
        </View>

        <TouchableOpacity
          onPress={handleResend}
          disabled={!canResend}
          style={styles.resendButton}
        >
          <Text
            style={[
              styles.resendText,
              { color: canResend ? colors.blue[400] : colors.gray[500] },
            ]}
          >
            {canResend
              ? 'Отправить код повторно'
              : `Отправить код повторно через ${timer} сек`}
          </Text>
        </TouchableOpacity>

        <Button
          onPress={() => {
            navigate(routes.TabNavigation);
          }}
        >
          Подтвердить
        </Button>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 32,
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
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  otpInput: {
    width: 60,
    height: 60,
    borderWidth: 1,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    fontWeight: 700,
    fontSize: 24,
  },
  otpText: {
    fontSize: 24,
    fontWeight: '600',
  },
  resendButton: {
    alignSelf: 'center',
    marginBottom: 32,
  },
  resendText: {
    fontSize: 16,
  },
  verifyButton: {
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  verifyText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
