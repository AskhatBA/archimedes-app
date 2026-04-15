import { useMutation } from '@tanstack/react-query';
import { useFormik } from 'formik';
import { FC, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { insuranceApi } from '@/api';
import { useOtp } from '@/modules/auth';
import { Button } from '@/shared/components/button';
import { Checkbox } from '@/shared/components/checkbox';
import { TextField } from '@/shared/components/text-field';
import { PRIVACY_POLICY_FILE, USER_AGREEMENT_FILE } from '@/shared/constants';
import { useAuth } from '@/shared/lib/auth';
import { useToast } from '@/shared/lib/toast';
import { routes, useNavigation } from '@/shared/navigation';
import { colors } from '@/shared/theme';

import { validationSchema } from './validation-schema';

export const SignInForm: FC = () => {
  const { loginIin, setLoginIin } = useAuth();
  const { requestOtp, isPending } = useOtp();
  const { navigate } = useNavigation();
  const { showToast } = useToast();

  const [userAgreement, setUserAgreement] = useState(false);
  const [privacyPolicy, setPrivacyPolicy] = useState(false);
  const [userAgreementError, setUserAgreementError] = useState('');
  const [privacyPolicyError, setPrivacyPolicyError] = useState('');

  const formatPhoneNumber = (phoneString: string) => {
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
        checkIinMutation.mutate({
          iin: formValues.iin,
          phone: formatPhoneNumber(formValues.phone),
        });
      },
      validateOnChange: false,
      validateOnBlur: false,
      validationSchema,
    });

  const checkIinMutation = useMutation({
    mutationFn: ({ iin }: { iin: string; phone: string }) =>
      insuranceApi.checkIinList({ iin }).then(r => r.data),
    onSuccess: (data, { iin, phone }) => {
      if (!data.phone) {
        setFieldError(
          'iin',
          `${data.message || 'ИИН не найден в системе'}. Пожалуйста, свяжитесь с колл-центром по номеру 2828.`,
        );
        return;
      }
      if (data.phone !== phone) {
        setFieldError(
          'phone',
          'Номер телефона не совпадает с данными в страховой системе. Пожалуйста, свяжитесь с колл-центром по номеру 2828.',
        );
        return;
      }
      setLoginIin(iin);
      requestOtp({ phone });
    },
    onError: () => {
      showToast({
        type: 'error',
        message: 'Не удалось проверить ИИН. Попробуйте снова',
      });
    },
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
        isLoading={checkIinMutation.isPending || isPending}
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
