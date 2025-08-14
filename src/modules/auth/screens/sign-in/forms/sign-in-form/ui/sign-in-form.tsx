import { useFormik } from 'formik';
import { FC, useState } from 'react';
import { View } from 'react-native';

import { Button } from '@/shared/components/button';
import { TextField } from '@/shared/components/text-field';
import { routes, useNavigation } from '@/shared/navigation';

import { TermsConsent } from '../../../components/terms-consent';

export const SignInForm: FC = () => {
  const [phone, setPhone] = useState('');
  const { navigate } = useNavigation();
  const { values, handleChange } = useFormik({
    initialValues: {
      email: '',
    },
    onSubmit: () => {},
  });

  return (
    <View>
      <TextField
        keyboardType="phone-pad"
        label="Номер телефона"
        placeholder="Введите номер телефона"
        mask="+7 (999) 999-99-99"
        value={phone}
        onChangeText={setPhone}
      />
      <View style={{ marginTop: 35 }}>
        <TermsConsent />
      </View>
      <Button
        style={{ marginTop: 50 }}
        onPress={() => {
          navigate(routes.OtpVerification);
        }}
      >
        Войти
      </Button>
    </View>
  );
};
