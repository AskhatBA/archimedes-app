import { useMutation } from '@tanstack/react-query';
import { useFormik } from 'formik';
import { FC, useMemo, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { userApi } from '@/api';
import { useOtp } from '@/modules/auth';
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
import { colors } from '@/shared/theme';

import { createValidationSchema } from './validation-schema';

type AgreementTextProps = {
  i18nKey: string;
  onLinkPress: () => void;
};

const AgreementText: FC<AgreementTextProps> = ({ i18nKey, onLinkPress }) => {
  const { t } = useTranslation();
  const raw = t(i18nKey);
  const match = raw.match(/^(.*?)<link>(.*?)<\/link>(.*)$/s);

  if (!match) {
    return <Text style={styles.text}>{raw}</Text>;
  }

  const [, before, linkText, after] = match;
  return (
    <View style={styles.agreementText}>
      {before ? <Text style={styles.text}>{before}</Text> : null}
      <TouchableOpacity activeOpacity={0.7} onPress={onLinkPress}>
        <Text style={styles.link}>{linkText}</Text>
      </TouchableOpacity>
      {after ? <Text style={styles.text}>{after}</Text> : null}
    </View>
  );
};

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
      onSubmit: async formValues => {
        if (!userAgreement) {
          setUserAgreementError('TERMS');
          return;
        }
        if (!privacyPolicy) {
          setPrivacyPolicyError('TERMS');
          return;
        }

        const phone = formatPhoneNumber(formValues.phone);
        const { iin } = formValues;

        const result = await checkAccountMutation.mutateAsync({ iin, phone });
        const { existsInDb, existsInInsurance, isPhoneMatch } = result;

        if (!existsInDb && existsInInsurance && !isPhoneMatch) {
          setFieldError(
            'phone',
            t('auth:phoneMismatch', { phone: CALL_CENTER_PHONE }),
          );
          return;
        }

        setLoginIin(iin);
        requestOtp({ phone, iin });
      },
      validateOnChange: false,
      validateOnBlur: false,
      validationSchema,
    });

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
        isLoading={checkAccountMutation.isPending || isOtpPending}
        style={{ marginTop: 50 }}
        onPress={() => {
          handleSubmit();
        }}
      >
        {t('auth:signIn')}
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  agreementText: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  text: {
    fontSize: 12,
    color: colors.textMain,
  },
  link: {
    fontSize: 12,
    color: colors.primary,
    textDecorationLine: 'underline',
  },
});
