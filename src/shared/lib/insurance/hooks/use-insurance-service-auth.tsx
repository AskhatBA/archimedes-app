import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

import { insuranceApi } from '@/api';
import { useToast } from '@/shared/lib/toast';

export const useInsuranceServiceAuth = () => {
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const [isUserHasInsuranceAccount, setIsUserHasInsuranceAccount] =
    useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['check-insurance-service-auth'],
    queryFn: async () => (await insuranceApi.checkUserAuthorizationList()).data,
  });

  const sendOtpMutation = useMutation({
    mutationFn: async () => (await insuranceApi.sendOtpCreate()).data,
    onSuccess: async () => {
      showToast({
        type: 'success',
        message: 'Код подтверждения был отправлен на ваш номер телефона',
      });
    },
    onError: () => {
      showToast({
        type: 'error',
        message:
          'К сожалению, мы не нашли вас в базе данных страховой компании',
      });
      setIsUserHasInsuranceAccount(true);
    },
  });

  const verifyOtpMutation = useMutation({
    mutationFn: async (otp: string) =>
      (await insuranceApi.verifyOtpCreate({ otp })).data,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['check-insurance-service-auth'],
      });
      await queryClient.invalidateQueries({ queryKey: ['programs'] });
      showToast({
        type: 'success',
        message: 'Авторизация прошла успешно',
      });
    },
    onError: () => {
      showToast({
        type: 'error',
        message: 'Неверный код подтверждения. Попробуйте еще раз',
      });
    },
  });

  return {
    isUserAuthorized: data?.isUserAuthorized,
    isLoading,
    sendOtp: sendOtpMutation.mutate,
    verifyOtp: verifyOtpMutation.mutate,
    isOtpChecking: verifyOtpMutation.isPending,
    isOtpSending: sendOtpMutation.isPending,
    isUserHasInsuranceAccount,
  };
};
