import { useFormik } from 'formik';
import { FC } from 'react';
import { View, StyleSheet, Text } from 'react-native';

import { Button } from '@/shared/components/button';
import { TextField } from '@/shared/components/text-field';
import { useAuth } from '@/shared/lib/auth';

import { TermsConsent } from '../../../components/terms-consent';

import { validationSchema } from './validation-schema';

export const SignInForm: FC = () => {
  const { requestOtpMutation } = useAuth();

  const formatPhoneNumber = phoneString => {
    return phoneString.replace(/\D/g, '');
  };

  const { values, handleChange, errors, handleSubmit, setFieldError } =
    useFormik({
      initialValues: {
        phone: '',
      },
      onSubmit: formValues => {
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
        onChangeText={value => {
          setFieldError('phone', undefined);
          handleChange('phone')(value);
        }}
      />
      {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}
      <View style={{ marginTop: 35 }}>
        <TermsConsent />
      </View>
      <Button
        isLoading={requestOtpMutation.isPending}
        style={{ marginTop: 50 }}
        onPress={() => handleSubmit()}
      >
        Войти
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  errorText: {
    color: 'red',
    marginTop: 6,
    fontSize: 12,
    paddingLeft: 4,
  },
});
