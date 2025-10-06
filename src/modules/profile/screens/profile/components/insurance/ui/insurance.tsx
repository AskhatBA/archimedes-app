import { FC, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';

import { OtpContainer } from '@/shared/components/otp-container';
import { useInsuranceServiceAuth, usePrograms } from '@/shared/lib/insurance';
import { globalStyles, useTheme } from '@/shared/theme';

import { InsuranceCard } from './insurance-card';

export const Insurance: FC = () => {
  const { colors } = useTheme();
  const {
    isUserAuthorized,
    isLoading,
    sendOtp,
    verifyOtp,
    isOtpSending,
    isOtpChecking,
  } = useInsuranceServiceAuth();
  const { programs, loadingPrograms } = usePrograms();
  const [isOtpSent, setIsOtpSent] = useState(false);

  if (loadingPrograms || isLoading) {
    return <ActivityIndicator color={colors.primary} />;
  }

  const renderInsuranceDetails = () => {
    if (isOtpSent) {
      return (
        <OtpContainer
          isSending={isOtpChecking}
          onSend={otpCode => {
            verifyOtp(otpCode);
            setIsOtpSent(false);
          }}
          onResend={() => sendOtp()}
        />
      );
    }

    if (!isUserAuthorized) {
      return (
        <View style={styles.unauthorizedContainer}>
          <Text
            style={[styles.unauthorizedText, { color: colors.gray['500'] }]}
          >
            Для просмотра информации о страховке необходимо подтвердить аккаунт
          </Text>
          {isOtpSending ? (
            <ActivityIndicator color={colors.primary} />
          ) : (
            <TouchableOpacity
              style={[
                styles.verifyButton,
                { backgroundColor: colors.blue['400'] },
              ]}
            >
              <Text
                style={styles.verifyButtonText}
                onPress={() => {
                  sendOtp();
                  setIsOtpSent(true);
                }}
              >
                Отправить код подтверждения
              </Text>
            </TouchableOpacity>
          )}
        </View>
      );
    }

    if (!programs || programs?.length === 0) {
      return (
        <Text style={[styles.noInsuranceText, { color: colors.gray['500'] }]}>
          Нет активных страховок
        </Text>
      );
    }

    return programs.map(program => {
      if (program.status === 'EXPIRED') return null;

      return (
        <InsuranceCard
          key={program.id}
          programId={program.id}
          price={program.cardNo}
          level={program.title}
        />
      );
    });
  };

  return (
    <View style={styles.container}>
      <Text style={globalStyles.sectionHeading}>Страховка</Text>
      <View style={styles.cards}>{renderInsuranceDetails()}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  cards: {
    marginTop: 20,
    gap: 16,
  },
  noInsuranceText: {
    fontSize: 14,
    textAlign: 'center',
  },
  unauthorizedContainer: {
    alignItems: 'center',
    padding: 16,
    gap: 16,
  },
  unauthorizedText: {
    fontSize: 14,
    textAlign: 'center',
  },
  verifyButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
  },
  verifyButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
