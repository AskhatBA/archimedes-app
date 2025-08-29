import { useFormik } from 'formik';
import { FC } from 'react';
import { View, StyleSheet, Text } from 'react-native';

import { formatDate } from '@/shared/adapters/date';
import { Button } from '@/shared/components/button';
import { Datepicker } from '@/shared/components/picker';
import { SelectField } from '@/shared/components/select-field';
import { TextField } from '@/shared/components/text-field';
import { useTheme } from '@/shared/theme';

import { CreateUserPayload, UserGender } from '../types';
import { validationSchema } from '../validation-schema';

interface CreateUserFormProps {
  initialValues?: {
    lastName: string;
    firstName: string;
    patronymic?: string;
    iin: string;
    birthDate: string;
    gender: UserGender;
  };
  isLoading?: boolean;
  onSubmit: (payload: CreateUserPayload) => void;
}

const FieldPlaceholder: FC<{ label: string; value: string }> = ({
  label,
  value,
}) => {
  const { colors } = useTheme();

  return (
    <View style={styles.fieldDisabled}>
      <Text style={[styles.label, { color: colors.textMain }]}>{label}</Text>
      <Text style={[styles.valueDisabled, { color: colors.textMain }]}>
        {value}
      </Text>
    </View>
  );
};

export const CreateUserForm: FC<CreateUserFormProps> = ({
  initialValues,
  isLoading,
  onSubmit,
}) => {
  const { values, handleChange, errors, handleSubmit, setFieldError } =
    useFormik<CreateUserPayload>({
      initialValues: {
        lastName: initialValues?.lastName || '',
        firstName: initialValues?.firstName || '',
        patronymic: initialValues?.patronymic || '',
        iin: initialValues?.iin || '',
        birthDate: initialValues?.birthDate || '',
        gender: initialValues?.gender,
      },
      onSubmit: formValues => {
        onSubmit(formValues);
      },
      validateOnChange: false,
      validateOnBlur: false,
      validationSchema,
    });

  const onChangeField = (fieldName: string, fieldValue: string) => {
    setFieldError(fieldName, undefined);
    handleChange(fieldName)(fieldValue);
  };

  const textFields = [
    {
      fieldName: 'lastName',
      initialValue: initialValues?.lastName,
      label: 'Фамилия',
      placeholder: 'Введите фамилию',
    },
    {
      fieldName: 'firstName',
      initialValue: initialValues?.firstName,
      label: 'Имя',
      placeholder: 'Введите имя',
    },
    {
      fieldName: 'patronymic',
      initialValue: initialValues?.patronymic,
      label: 'Отчество',
      placeholder: 'Введите отчество',
    },

    {
      fieldName: 'iin',
      initialValue: initialValues?.iin,
      label: 'ИИН',
      placeholder: 'Введите ИИН',
    },
  ];

  return (
    <View style={styles.container}>
      {textFields.map(field => {
        if (field.initialValue)
          return (
            <FieldPlaceholder
              key={field.fieldName}
              label={field.label}
              value={field.initialValue}
            />
          );

        return (
          <TextField
            keyboardType={field.fieldName === 'iin' ? 'number-pad' : undefined}
            key={field.fieldName}
            placeholder={field.placeholder}
            label={field.label}
            value={values[field.fieldName]}
            error={errors[field.fieldName]}
            onChangeText={value => onChangeField(field.fieldName, value)}
          />
        );
      })}

      {initialValues.birthDate ? (
        <FieldPlaceholder
          key={initialValues.birthDate}
          label="День рождения"
          value={formatDate(initialValues.birthDate, 'DD.MM.YYYY')}
        />
      ) : (
        <Datepicker
          error={errors.birthDate}
          value={values.birthDate}
          label="День рождения"
          onChange={value => onChangeField('birthDate', value)}
        />
      )}
      <SelectField
        value={values.gender}
        error={errors.gender}
        placeholder="Пол"
        onChange={value => onChangeField('gender', value)}
        options={[
          { value: 'M', label: 'Мужской' },
          { value: 'F', label: 'Женский' },
        ]}
      />
      <Button
        isLoading={isLoading}
        onPress={() => handleSubmit()}
        style={{ marginTop: 16 }}
      >
        Сохранить
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: 600,
  },
  fieldDisabled: {
    gap: 4,
  },
  valueDisabled: {
    fontSize: 16,
    fontWeight: 700,
  },
});
