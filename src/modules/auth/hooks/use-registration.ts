import { useMutation } from '@tanstack/react-query';

import {
  authApi,
  RegisterCompleteBody,
  RegisterStartBody,
  RegisterVerifyOtpBody,
  RegisterVerifyOtpResponse,
} from '@/api';
import { useUser } from '@/modules/user';
import { useAuth } from '@/shared/lib/auth';
import { useTranslation } from '@/shared/lib/i18n';
import { useToast } from '@/shared/lib/toast';
import { routes, useNavigation } from '@/shared/navigation';

/** Personal data MIS already holds for the IIN being registered, if any. */
export type MisPrefill = NonNullable<RegisterVerifyOtpResponse['patient']>;

/**
 * The phone and IIN of the final step live inside the registration token, not
 * in the request body — but the app still needs them locally to store the
 * session phone and seed `loginIin`.
 */
type CompleteVariables = {
  body: RegisterCompleteBody;
  phone: string;
  iin: string;
};

const errorCodeOf = (err: unknown): string | undefined =>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (err as any)?.response?.data?.message;

/**
 * Drives the three-step registration:
 *   1. `start`      — claim the phone/IIN pair and send a confirmation code
 *   2. `verifyOtp`  — exchange the code for a registration token + MIS prefill
 *   3. `complete`   — create the account and sign in
 */
export const useRegistration = () => {
  const { navigate } = useNavigation();
  const { showToast } = useToast();
  const { t } = useTranslation();
  const { authenticate, setLoginIin } = useAuth();
  const { refreshUserData } = useUser();

  const startMutation = useMutation({
    mutationFn: async (body: RegisterStartBody) =>
      (await authApi.registerStartCreate(body)).data,
    onSuccess: (data, variables) => {
      console.log('registration otp: ', (data as { otp?: string }).otp);

      navigate(routes.OtpVerification, {
        phone: variables.phone,
        iin: variables.iin,
        mode: 'register',
      });
    },
  });

  // Same endpoint as `start`, minus the navigation — the user is already on the
  // OTP screen and must stay there.
  const resendMutation = useMutation({
    mutationFn: async (body: RegisterStartBody) =>
      (await authApi.registerStartCreate(body)).data,
    onSuccess: data => {
      console.log('registration otp: ', (data as { otp?: string }).otp);
    },
    onError: () => {
      showToast({ type: 'error', message: t('auth:otpResendFailed') });
    },
  });

  const verifyOtpMutation = useMutation({
    mutationFn: async (body: RegisterVerifyOtpBody) =>
      (await authApi.registerVerifyOtpCreate(body)).data,
    onSuccess: (data, variables) => {
      navigate(routes.RegisterProfile, {
        registrationToken: data.registrationToken,
        existsInMis: !!data.existsInMis,
        patient: data.patient ?? undefined,
        phone: variables.phone,
        iin: variables.iin,
      });
    },
    onError: err => {
      const code = errorCodeOf(err);

      showToast({
        type: 'error',
        message:
          code === 'ACCOUNT_ALREADY_EXISTS'
            ? t('auth:accountAlreadyExists')
            : t('auth:otpInvalid'),
      });
    },
  });

  const completeMutation = useMutation({
    mutationFn: async ({ body }: CompleteVariables) =>
      (await authApi.registerCompleteCreate(body)).data,
    onSuccess: async (data, variables) => {
      setLoginIin(variables.iin);
      await authenticate(data, variables.phone);
      await refreshUserData();
    },
    onError: err => {
      const code = errorCodeOf(err);

      showToast({
        type: 'error',
        message:
          code === 'ACCOUNT_ALREADY_EXISTS'
            ? t('auth:accountAlreadyExists')
            : t('auth:registerFailed'),
      });
    },
  });

  return {
    start: startMutation.mutate,
    startAsync: startMutation.mutateAsync,
    resendOtp: resendMutation.mutate,
    verifyOtp: verifyOtpMutation.mutate,
    complete: completeMutation.mutate,
    isStartPending: startMutation.isPending,
    isResendPending: resendMutation.isPending,
    isVerifyOtpPending: verifyOtpMutation.isPending,
    isCompletePending: completeMutation.isPending,
  };
};
