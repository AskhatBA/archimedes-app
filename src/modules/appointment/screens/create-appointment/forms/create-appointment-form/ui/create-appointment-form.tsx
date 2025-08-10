import { useFormik } from 'formik';
import { FC } from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { SelectField } from '@/shared/components/select-field';
import { colors } from '@/shared/theme';

import { doctors, specializations } from '../../../data';

import { ChooseBranch } from './choose-branch';
import { createAppointmentFormStyles } from './styles';

export const CreateAppointmentForm: FC = () => {
  const { values, handleChange } = useFormik({
    initialValues: {
      doctor: '',
      specialization: '',
    },
    onSubmit: () => {},
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 20,
  },
});
