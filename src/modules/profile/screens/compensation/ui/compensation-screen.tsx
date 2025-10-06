import { useMutation } from '@tanstack/react-query';
import { FC, useEffect, useState } from 'react';
import {
  Text,
  StyleSheet,
  ScrollView,
  View,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { insuranceApi, RefundRequestBody } from '@/api';
import { Button } from '@/shared/components/button';
import { OtpContainer } from '@/shared/components/otp-container';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from '@/shared/constants';
import { MainLayout } from '@/shared/layout/main-layout';
import { useInsuranceServiceAuth } from '@/shared/lib/insurance';
import { useToast } from '@/shared/lib/toast';
import { useNavigation } from '@/shared/navigation';
import { useTheme } from '@/shared/theme';
import { convertUriToBase64 } from '@/shared/utils/convert-uri-to-base64';

import { SuccessRefundRequest } from '../components/success-refund-request';
import { CompensationRequestForm } from '../forms/compensation-request-form';

export const CompensationScreen: FC = () => {
  const { colors } = useTheme();
  const deviceInsets = useSafeAreaInsets();
  const { showToast } = useToast();
  const { goBack } = useNavigation();
  const {
    isUserAuthorized,
    isLoading,
    sendOtp,
    verifyOtp,
    isOtpSending,
    isOtpChecking,
    isUserHasInsuranceAccount,
  } = useInsuranceServiceAuth();
  const [isSuccess, setIsSuccess] = useState(false);

  const refundRequestMutation = useMutation({
    mutationFn: async (data: RefundRequestBody) =>
      (await insuranceApi.refundRequestCreate(data)).data,
    onSuccess: () => {
      setIsSuccess(true);
    },
    onError: () => {
      showToast({
        type: 'error',
        message: 'Произошла ошибка. Пожалуйста обратитесь в поддержку',
      });
    },
  });

  useEffect(() => {
    if (isUserAuthorized === false) {
      sendOtp();
    }
  }, [isUserAuthorized]);

  // if (isLoading || isOtpSending) {
  //   return (
  //     <View
  //       style={{
  //         flex: 1,
  //         alignItems: 'center',
  //         justifyContent: 'center',
  //       }}
  //     >
  //       <ActivityIndicator color={colors.primary} size="large" />
  //     </View>
  //   );
  // }
  //
  // if (isUserHasInsuranceAccount) {
  //   return (
  //     <View style={{ paddingTop: 80, paddingHorizontal: 32, gap: 24 }}>
  //       <Text
  //         style={{
  //           color: colors.textMain,
  //           fontSize: 24,
  //           textAlign: 'center',
  //           fontWeight: 500,
  //         }}
  //       >
  //         Вы не зарегистрированы в базе страховой компании.
  //       </Text>
  //       <Text style={[styles.noAccountCaption, { color: colors.textMain }]}>
  //         Для использования сервиса обновите данные или свяжитесь с поддержкой
  //       </Text>
  //       <Button onPress={goBack} style={{ marginTop: 32 }}>
  //         Вернуться
  //       </Button>
  //     </View>
  //   );
  // }
  //
  // if (isUserAuthorized === false) {
  //   return (
  //     <View style={{ flex: 1 }}>
  //       <OtpContainer
  //         isSending={isOtpChecking}
  //         onSend={otpCode => {
  //           verifyOtp(otpCode);
  //         }}
  //         onResend={() => {
  //           sendOtp();
  //         }}
  //       />
  //     </View>
  //   );
  // }

  if (isSuccess) return <SuccessRefundRequest />;

  return (
    <MainLayout>
      <ScrollView
        contentContainerStyle={[
          styles.container,
          { paddingBottom: deviceInsets.bottom + 32 },
        ]}
      >
        <Text style={[styles.heading, { color: colors.primary }]}>
          Заявка на возмещение
        </Text>
        <CompensationRequestForm
          onSubmit={async requestParams => {
            const promises = requestParams.files.map(async file => {
              const base64Content = await convertUriToBase64(file.file.uri);
              return {
                fileType: file.file.type,
                fileName: file.file.name,
                content: base64Content,
              };
            });

            const convertedFiles = await Promise.all(promises);

            refundRequestMutation.mutate({
              programId: requestParams.programId,
              personId: requestParams.personId,
              date: requestParams.date,
              amount: +requestParams.amount,
              files: convertedFiles,
            });
          }}
        />
      </ScrollView>
      {refundRequestMutation.isPending && (
        <View style={[styles.loaderBackdrop, { top: -deviceInsets.top - 54 }]}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      )}
    </MainLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 32,
  },
  heading: {
    fontSize: 24,
    fontWeight: 700,
  },
  noAccountCaption: {
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 400,
  },
  loaderBackdrop: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.5)',
    position: 'absolute',
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
});
