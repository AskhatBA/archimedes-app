import { useFormik } from 'formik';
import { FC, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useOtp } from '@/modules/auth';
import { Button } from '@/shared/components/button';
import { Checkbox } from '@/shared/components/checkbox';
import { TextField } from '@/shared/components/text-field';
import { PRIVACY_POLICY_FILE, USER_AGREEMENT_FILE } from '@/shared/constants';
import { useAuth } from '@/shared/lib/auth';
import { routes, useNavigation } from '@/shared/navigation';
import { colors } from '@/shared/theme';

import { validationSchema } from './validation-schema';

export const SignInForm: FC = () => {
  const { loginIin, setLoginIin } = useAuth();
  const { requestOtp, isPending } = useOtp();
  const { navigate } = useNavigation();

  const [userAgreement, setUserAgreement] = useState(false);
  const [privacyPolicy, setPrivacyPolicy] = useState(false);
  const [userAgreementError, setUserAgreementError] = useState('');
  const [privacyPolicyError, setPrivacyPolicyError] = useState('');

  const formatPhoneNumber = phoneString => {
    return phoneString.replace(/\D/g, '');
  };

  const { values, handleChange, errors, handleSubmit, setFieldError } =
    useFormik({
      initialValues: {
        phone: '',
        iin: loginIin,
      },
      onSubmit: formValues => {
        if (!userAgreement) {
          setUserAgreementError('TERMS');
          return;
        }
        if (!privacyPolicy) {
          setPrivacyPolicyError('TERMS');
          return;
        }
        setLoginIin(formValues.iin);
        requestOtp({
          phone: formatPhoneNumber(formValues.phone),
        });
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
          label="Номер телефона"
          placeholder="Введите номер телефона"
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
          label="ИИН"
          placeholder="Введите свой ИИН"
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
          <Text style={styles.text}>
            Я соглашаюсь с условиями{' '}
            <Pressable
              onPress={() => {
                navigate(routes.DocumentViewer, {
                  uri: USER_AGREEMENT_FILE,
                  isOnlyUrl: true,
                });
              }}
            >
              <Text style={styles.link}>Пользовательского соглашения</Text>
            </Pressable>
          </Text>
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
          <Text style={styles.text}>
            Я соглашаюсь с условиями{' '}
            <Pressable
              onPress={() => {
                navigate(routes.DocumentViewer, {
                  uri: PRIVACY_POLICY_FILE,
                  isOnlyUrl: true,
                });
              }}
            >
              <Text style={styles.link}>Политики конфиденциальности</Text>
            </Pressable>
          </Text>
        </View>
      </View>
      <Button
        isLoading={isPending}
        style={{ marginTop: 50 }}
        onPress={() => {
          handleSubmit();
        }}
      >
        Войти
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
