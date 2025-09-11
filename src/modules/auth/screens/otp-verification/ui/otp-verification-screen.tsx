import { useRoute } from '@react-navigation/native';
import { FC, useCallback, useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { OtpInput } from 'react-native-otp-entry';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/shared/components/button';
import { useAuth } from '@/shared/lib/auth';
import { useTheme } from '@/shared/theme';

interface RouteParams {
  phone: string;
}

export const OtpVerificationScreen: FC = () => {
  const route = useRoute();
  const { phone } = route.params as RouteParams;
  const { verifyOtpMutation, requestOtpMutation } = useAuth();
  const { colors } = useTheme();
  const [otpCode, setOtpCode] = useState<string>();
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef<Array<TextInput | null>>([null, null, null, null]);

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

  const handleResend = useCallback(() => {
    if (canResend) {
      setTimer(60);
      setCanResend(false);
      requestOtpMutation.mutate({ phone });
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
          <OtpInput
            numberOfDigits={4}
            onTextChange={setOtpCode}
            theme={{
              pinCodeContainerStyle: {
                borderWidth: 2,
                borderColor: colors.gray['300'],
                width: 65,
                height: 65,
              },
              focusedPinCodeContainerStyle: {
                borderColor: colors.primary,
              },
              focusStickStyle: {
                backgroundColor: colors.primary,
              },
              pinCodeTextStyle: {
                color: colors.textMain,
              },
            }}
          />
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
          isLoading={verifyOtpMutation.isPending}
          onPress={() => {
            if (otpCode.length === 4) {
              verifyOtpMutation.mutate({ otp: otpCode, phone });
            }
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
