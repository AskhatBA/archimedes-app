import { useFormik } from 'formik';
import { FC, useState } from 'react';
import { View, StyleSheet } from 'react-native';

import { Button } from '@/shared/components/button';
import { Datepicker } from '@/shared/components/picker';
import { SelectField } from '@/shared/components/select-field';
import { TextField } from '@/shared/components/text-field';
import { usePrograms, useFamily } from '@/shared/lib/insurance';

import { AttachDocuments } from '../../../components/attach-documents';
import { AttachedDocument } from '../../../types';
import { validationSchema } from '../validation-schema';

interface CompensationRequestFormProps {
  onSubmit: (values: {
    date: string;
    amount: number;
    files: AttachedDocument[];
    programId: string;
    personId: string;
  }) => void;
}

export const CompensationRequestForm: FC<CompensationRequestFormProps> = ({
  onSubmit,
}) => {
  const [files, setFiles] = useState<AttachedDocument[]>([]);

  const { values, handleChange, handleSubmit, errors } = useFormik({
    initialValues: {
      program: '',
      person: '',
      date: '',
      amount: '',
    },
    onSubmit: formValues => {
      if (!files.length) return;

      onSubmit({
        date: formValues.date,
        amount: +formValues.amount.replace(/₸/g, ''),
        files,
        personId: formValues.person,
        programId: formValues.program,
      });
    },
    validationSchema,
  });

  const { programs, loadingPrograms } = usePrograms();
  const { family, loadingFamily } = useFamily(values.program);
  const activePrograms = programs.filter(
    program => program.status !== 'EXPIRED',
  );

  return (
    <View style={styles.container}>
      {!loadingPrograms && programs?.length && (
        <SelectField
          value={values.program}
          onChange={value => handleChange('program')(value)}
          options={activePrograms.map(program => ({
            value: program.id,
            label: `${program.title} (${program.cardNo})`,
          }))}
          placeholder="Выберите программу"
          error={errors.program}
        />
      )}
      {!loadingFamily && family?.length && (
        <SelectField
          value={values.person}
          onChange={value => handleChange('person')(value)}
          options={family.map(item => ({
            value: item.id,
            label: item.fullName,
          }))}
          placeholder="За кого осуществляется"
          error={errors.person}
        />
      )}
      <TextField
        mask="currency"
        placeholder="0 000"
        label="Сумма возмещения в тенге"
        keyboardType="number-pad"
        value={values.amount}
        onChangeText={value => handleChange('amount')(value)}
        error={errors.amount}
      />
      <Datepicker
        value={values.date}
        placeholder="DD.MM.YYYY"
        label="Дата наступления страхового случая"
        onChange={value => handleChange('date')(value)}
        error={errors.date}
      />
      <AttachDocuments
        files={files}
        onRemove={fileToRemove =>
          setFiles(prevState =>
            prevState.filter(
              prevFile => prevFile.file.name !== fileToRemove.name,
            ),
          )
        }
        onLoadFile={async file => {
          setFiles(prevState => [...prevState, file]);
        }}
      />
      <Button onPress={() => handleSubmit()}>Отправить заявку</Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 32,
  },
});
