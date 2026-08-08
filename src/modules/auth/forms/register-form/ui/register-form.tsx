import { useFormik } from 'formik';
import { FC, useMemo, useState } from 'react';
import { Keyboard, StyleSheet, View } from 'react-native';

import { AgreementText } from '@/modules/auth/components/agreement-text';
import { ConfirmCredentialsDrawer } from '@/modules/auth/components/confirm-credentials-drawer';
import { useRegistration } from '@/modules/auth/hooks/use-registration';
import { toMaskedPhone, toRawPhone } from '@/modules/auth/lib/phone';
import { Button } from '@/shared/components/button';
import { Checkbox } from '@/shared/components/checkbox';
import { TextField } from '@/shared/components/text-field';
import {
  CALL_CENTER_PHONE,
  PRIVACY_POLICY_FILE,
  USER_AGREEMENT_FILE,
} from '@/shared/constants';
import { useTranslation } from '@/shared/lib/i18n';
import { routes, useNavigation } from '@/shared/navigation';

import { createCredentialsValidationSchema } from '../../credentials-validation-schema';

interface RegisterFormProps {
  initialPhone?: string;
  initialIin?: string;
}

/**
 * Registration, step 1: the phone/IIN pair. The account check happens on the
 * server — if an account already exists the user is sent to sign-in instead.
 */
export const RegisterForm: FC<RegisterFormProps> = ({
  initialPhone = '',
  initialIin = '',
}) => {
  const { navigate } = useNavigation();
  const { t } = useTranslation();
  const { startAsync, isStartPending } = useRegistration();

  const validationSchema = useMemo(
    () => createCredentialsValidationSchema(t),
    [t],
  );

  const [userAgreement, setUserAgreement] = useState(false);
  const [privacyPolicy, setPrivacyPolicy] = useState(false);
  const [userAgreementError, setUserAgreementError] = useState('');
  const [privacyPolicyError, setPrivacyPolicyError] = useState('');
  const [confirmVisible, setConfirmVisible] = useState(false);

  const { values, handleChange, errors, handleSubmit, setFieldError } =
    useFormik({
      initialValues: { phone: toMaskedPhone(initialPhone), iin: initialIin },
      onSubmit: () => {
        if (!userAgreement) {
          setUserAgreementError('TERMS');
          return;
        }
        if (!privacyPolicy) {
          setPrivacyPolicyError('TERMS');
          return;
        }

        // The account is created with exactly these credentials, so make the
        // user re-read them before an SMS goes out.
        Keyboard.dismiss();
        setConfirmVisible(true);
      },
      validateOnChange: false,
      validateOnBlur: false,
      validationSchema,
    });

  const handleConfirm = async () => {
    const phone = toRawPhone(values.phone);
    const { iin } = values;

    try {
      await startAsync({ phone, iin });
      setConfirmVisible(false);
    } catch (err) {
      setConfirmVisible(false);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const code = (err as any)?.response?.data?.message;

      if (code === 'ACCOUNT_ALREADY_EXISTS') {
        setFieldError('iin', t('auth:accountAlreadyExists'));
        return;
      }

      if (code === 'INSURANCE_PHONE_IS_NOT_MATCHED') {
        setFieldError(
          'phone',
          t('auth:phoneMismatch', { phone: CALL_CENTER_PHONE }),
        );
        return;
      }

      setFieldError('iin', t('auth:registerFailed'));
    }
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
        isLoading={isStartPending}
        style={{ marginTop: 50 }}
        onPress={() => handleSubmit()}
      >
        {t('auth:continue')}
      </Button>

      <ConfirmCredentialsDrawer
        visible={confirmVisible}
        phone={values.phone}
        iin={values.iin}
        isLoading={isStartPending}
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
