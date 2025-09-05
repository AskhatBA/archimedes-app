import { useFormik } from 'formik';
import { FC } from 'react';
import { View, StyleSheet } from 'react-native';

import { Button } from '@/shared/components/button';
import { Datepicker } from '@/shared/components/picker';
import { SelectField } from '@/shared/components/select-field';
import { TextField } from '@/shared/components/text-field';

import { AttachDocuments } from '../../../components/attach-documents';
import { validationSchema } from '../validation-schema';

export const CompensationRequestForm: FC = () => {
  const { values, handleChange, errors, handleSubmit, setFieldError } =
    useFormik({
      initialValues: {
        phone: '',
        date: '',
        amount: '',
      },
      onSubmit: formValues => {},
      validationSchema,
    });

  return (
    <View style={styles.container}>
      <SelectField options={[]} placeholder="Выберите программу" />
      <SelectField options={[]} placeholder="За кого осуществляется" />
      <TextField
        mask="+7 (999) 999-99-99"
        placeholder="+7 (000) 000-00-00"
        label="Номер телефона"
        keyboardType="number-pad"
        value={values.phone}
        onChangeText={value => handleChange('phone')(value)}
      />
      <TextField
        mask="currency"
        placeholder="+7 (000) 000-00-00"
        label="Сумма возмещения в тенге"
        keyboardType="number-pad"
        value={values.amount}
        onChangeText={value => handleChange('amount')(value)}
      />
      <Datepicker
        value={values.date}
        placeholder="DD.MM.YYYY"
        label="Дата наступления страхового случая"
        onChange={value => handleChange('date')(value)}
      />
      <AttachDocuments />
      <Button>Отправить заявку</Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 32,
  },
});
