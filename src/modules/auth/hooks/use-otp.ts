import { useMutation } from '@tanstack/react-query';

import { authApi, RequestOTPBody, VerifyOTPBody } from '@/api';
import { useUser } from '@/modules/user';
import { useAuth } from '@/shared/lib/auth';
import { useToast } from '@/shared/lib/toast';
import { routes, useNavigation } from '@/shared/navigation';

export const useOtp = () => {
  const { showToast } = useToast();
  const { refreshUserData } = useUser();
  const { navigate } = useNavigation();
  const { authenticate } = useAuth();

  const requestOtpMutation = useMutation({
    mutationFn: async (credentials: RequestOTPBody) =>
      (await authApi.requestOtpCreate(credentials)).data,
    onSuccess: async data => {
      console.log('otp: ', (data as { otp: string }).otp);
      navigate(routes.OtpVerification, { phone: data.phone });
    },
    onError: err => {
      let errorMessage = 'Не удалось отправить код. Попробуйте снова';

      if (
        (err as any)?.response?.data.message ===
        'INSURANCE_PHONE_IS_NOT_MATCHED'
      ) {
        errorMessage =
          'Вы указали неверный номер телефона. Проверьте правильность введённых данных.';
      }

      showToast({
        type: 'error',
        message: errorMessage,
      });
    },
  });

  const verifyOtpMutation = useMutation({
    mutationFn: async (body: VerifyOTPBody) =>
      (await authApi.verifyOtpCreate(body)).data,
    onSuccess: async data => {
      await refreshUserData();
      await authenticate(data);
    },
    onError: () => {
      showToast({
        type: 'error',
        message: 'Похоже вы ввели неверный код. Попробуйте снова',
      });
    },
  });

  return {
    verifyOtp: verifyOtpMutation.mutate,
    requestOtp: requestOtpMutation.mutate,
    isPending: requestOtpMutation.isPending || verifyOtpMutation.isPending,
  };
};
