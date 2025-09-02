import { useFormik } from 'formik';
import { FC, useState } from 'react';
import { View } from 'react-native';

import { Button } from '@/shared/components/button';
import { TextField } from '@/shared/components/text-field';
import { useAuth } from '@/shared/lib/auth';

import { TermsConsent } from '../../../components/terms-consent';

import { validationSchema } from './validation-schema';

export const SignInForm: FC = () => {
  const { requestOtpMutation } = useAuth();
  const [terms, setTerms] = useState(false);
  const [termsError, setTermsError] = useState('');

  const formatPhoneNumber = phoneString => {
    return phoneString.replace(/\D/g, '');
  };

  const { values, handleChange, errors, handleSubmit, setFieldError } =
    useFormik({
      initialValues: {
        phone: '',
      },
      onSubmit: formValues => {
        if (!terms) {
          setTermsError('TERMS');
          return;
        }
        requestOtpMutation.mutate({
          phone: formatPhoneNumber(formValues.phone),
        });
      },
      validateOnChange: false,
      validateOnBlur: false,
      validationSchema,
    });

  return (
    <View>
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
      <View style={{ marginTop: 35 }}>
        <TermsConsent
          terms={terms}
          setTerms={checked => {
            setTermsError('');
            setTerms(checked);
          }}
          error={termsError}
        />
      </View>
      <Button
        isLoading={requestOtpMutation.isPending}
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
