import { useFormik } from 'formik';
import { FC } from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { Button } from '@/shared/components/button';
import { Calendar } from '@/shared/components/calendar';
import { SelectField } from '@/shared/components/select-field';
import { TimePicker } from '@/shared/components/time-picker';
import { colors } from '@/shared/theme';

import { doctors, specializations } from '../../../data';

import { ChooseBranch } from './choose-branch';
import { createAppointmentFormStyles } from './styles';

interface CreateAppointmentFormProps {
  onSubmit: () => void;
}

export const CreateAppointmentForm: FC<CreateAppointmentFormProps> = ({
  onSubmit,
}) => {
  const { values, handleChange, handleSubmit } = useFormik({
    initialValues: {
      doctor: '',
      specialization: '',
    },
    onSubmit: () => {
      onSubmit();
    },
  });

  return (
    <View style={styles.container}>
      <ChooseBranch />
      <View>
        <Text
          style={[
            createAppointmentFormStyles.title,
            { color: colors.gray['500'] },
          ]}
        >
          Выберите специализацию
        </Text>
        <SelectField
          value={values.specialization}
          onChange={value => handleChange('specialization')(value)}
          placeholder="Список специализаций"
          options={specializations.map(specialization => ({
            value: specialization.id,
            label: specialization.name,
          }))}
        />
      </View>
      <View>
        <Text
          style={[
            createAppointmentFormStyles.title,
            { color: colors.gray['500'] },
          ]}
        >
          Выберите врача
        </Text>
        <SelectField
          value={values.doctor}
          onChange={value => handleChange('doctor')(value)}
          placeholder="Любой врач"
          options={doctors.map(doctor => ({
            value: doctor.id,
            label: `${doctor.firstName} ${doctor.lastName}`,
          }))}
        />
      </View>
      <View>
        <Text
          style={[
            createAppointmentFormStyles.title,
            { color: colors.gray['500'] },
          ]}
        >
          Выберите дату
        </Text>
        <Calendar />
      </View>
      <View>
        <Text
          style={[
            createAppointmentFormStyles.title,
            { color: colors.gray['500'] },
          ]}
        >
          Выберите время
        </Text>
        <TimePicker value={new Date()} />
      </View>
      <View>
        <Text
          style={[
            createAppointmentFormStyles.title,
            { color: colors.gray['500'] },
          ]}
        >
          Выберите кого записать
        </Text>
        <SelectField
          value={values.doctor}
          onChange={value => handleChange('doctor')(value)}
          placeholder="Список лиц"
          options={doctors.map(doctor => ({
            value: doctor.id,
            label: `${doctor.firstName} ${doctor.lastName}`,
          }))}
        />
      </View>
      <Button onPress={() => handleSubmit()}>Записаться на прием</Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 32,
  },
});
