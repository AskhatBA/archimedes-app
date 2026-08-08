import { useMutation } from '@tanstack/react-query';
import { useFormik } from 'formik';
import { FC, useMemo, useState } from 'react';
import { Keyboard, StyleSheet, View } from 'react-native';

import { userApi } from '@/api';
import { useOtp } from '@/modules/auth';
import { AgreementText } from '@/modules/auth/components/agreement-text';
import { ConfirmCredentialsDrawer } from '@/modules/auth/components/confirm-credentials-drawer';
import { Button } from '@/shared/components/button';
import { Checkbox } from '@/shared/components/checkbox';
import { TextField } from '@/shared/components/text-field';
import {
  CALL_CENTER_PHONE,
  PRIVACY_POLICY_FILE,
  USER_AGREEMENT_FILE,
} from '@/shared/constants';
import { useAuth } from '@/shared/lib/auth';
import { useTranslation } from '@/shared/lib/i18n';
import { useToast } from '@/shared/lib/toast';
import { routes, useNavigation } from '@/shared/navigation';

import { createValidationSchema } from './validation-schema';

export const SignInForm: FC = () => {
  const { loginIin, setLoginIin } = useAuth();
  const { requestOtp, isPending: isOtpPending } = useOtp();
  const { navigate } = useNavigation();
  const { showToast } = useToast();
  const { t } = useTranslation();

  const validationSchema = useMemo(() => createValidationSchema(t), [t]);

  const [userAgreement, setUserAgreement] = useState(false);
  const [privacyPolicy, setPrivacyPolicy] = useState(false);
  const [userAgreementError, setUserAgreementError] = useState('');
  const [privacyPolicyError, setPrivacyPolicyError] = useState('');
  const [confirmVisible, setConfirmVisible] = useState(false);

  const formatPhoneNumber = (phoneString: string) => {
    return phoneString.replace(/\D/g, '');
  };

  const checkAccountMutation = useMutation({
    mutationFn: ({ iin, phone }: { iin: string; phone: string }) =>
      userApi.checkAccountList({ iin, phone }).then(r => r.data),
    onError: () => {
      showToast({
        type: 'error',
        message: t('auth:checkAccountError'),
      });
    },
  });

  const { values, handleChange, errors, handleSubmit, setFieldError } =
    useFormik({
      initialValues: {
        phone: '',
        iin: loginIin,
      },
      onSubmit: () => {
        if (!userAgreement) {
          setUserAgreementError('TERMS');
          return;
        }
        if (!privacyPolicy) {
          setPrivacyPolicyError('TERMS');
          return;
        }

        // The user confirms the phone/IIN in a drawer before we send the OTP —
        // a typo here creates an account with the wrong identity.
        Keyboard.dismiss();
        setConfirmVisible(true);
      },
      validateOnChange: false,
      validateOnBlur: false,
      validationSchema,
    });

  const isSubmitting = checkAccountMutation.isPending || isOtpPending;

  const handleConfirm = async () => {
    const phone = formatPhoneNumber(values.phone);
    const { iin } = values;

    let result;
    try {
      result = await checkAccountMutation.mutateAsync({ iin, phone });
    } catch {
      setConfirmVisible(false);
      return;
    }

    const { existsInDb, existsInInsurance, isPhoneMatch } = result;

    if (!existsInDb && existsInInsurance && !isPhoneMatch) {
      setConfirmVisible(false);
      setFieldError(
        'phone',
        t('auth:phoneMismatch', { phone: CALL_CENTER_PHONE }),
      );
      return;
    }

    // Signing in no longer provisions an account — send newcomers to
    // registration with what they already typed.
    if (!existsInDb) {
      setConfirmVisible(false);
      showToast({ type: 'info', message: t('auth:accountNotFound') });
      navigate(routes.Register, { phone, iin });
      return;
    }

    setConfirmVisible(false);
    setLoginIin(iin);
    requestOtp({ phone, iin });
  };

  return (
    <View>
      <View style={{ gap: 24 }}>
        <TextField
          keyboardType="phone-pad"
          label={t('auth:phoneNumber')}
          placeholder={t('auth:enterPhoneNumber')}
          mask="+7 (999) 999-99-99"
          value={values.phone}
          error={errors.phone}
          onChangeText={value => {
            setFieldError('phone', undefined);
            handleChange('phone')(value);
          }}
        />
        <TextField
          keyboardType="phone-pad"
          label={t('auth:iin')}
          placeholder={t('auth:enterIin')}
          mask="999999999999"
          value={values.iin}
          error={errors.iin}
          onChangeText={value => {
            setFieldError('iin', undefined);
            handleChange('iin')(value);
          }}
        />
      </View>
      <View style={{ marginTop: 35, gap: 16 }}>
        <View style={styles.container}>
          <Checkbox
            checked={userAgreement}
            onCheck={checked => {
              setUserAgreementError('');
              setUserAgreement(checked);
            }}
            error={userAgreementError}
          />
          <AgreementText
            i18nKey="auth:agreeUserAgreement"
            onLinkPress={() =>
              navigate(routes.DocumentViewer, {
                uri: USER_AGREEMENT_FILE,
                isOnlyUrl: true,
              })
            }
          />
        </View>
        <View style={styles.container}>
          <Checkbox
            checked={privacyPolicy}
            onCheck={checked => {
              setPrivacyPolicyError('');
              setPrivacyPolicy(checked);
            }}
            error={privacyPolicyError}
          />
          <AgreementText
            i18nKey="auth:agreePrivacyPolicy"
            onLinkPress={() =>
              navigate(routes.DocumentViewer, {
                uri: PRIVACY_POLICY_FILE,
                isOnlyUrl: true,
              })
            }
          />
        </View>
      </View>
      <Button
        isLoading={isSubmitting}
        style={{ marginTop: 50 }}
        onPress={() => {
          handleSubmit();
        }}
      >
        {t('auth:signIn')}
      </Button>

      <Button
        variant="secondary"
        style={{ marginTop: 12 }}
        disabled={isSubmitting}
        onPress={() =>
          navigate(routes.Register, {
            phone: formatPhoneNumber(values.phone),
            iin: values.iin,
          })
        }
      >
        {t('auth:register')}
      </Button>

      <ConfirmCredentialsDrawer
        visible={confirmVisible}
        phone={values.phone}
        iin={values.iin}
        isLoading={isSubmitting}
        onConfirm={handleConfirm}
        onClose={() => setConfirmVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
});
