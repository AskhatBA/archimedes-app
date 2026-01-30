import { useFormik } from 'formik';
import { FC, useEffect, useMemo, useState } from 'react';
import { View, StyleSheet } from 'react-native';

import { Button } from '@/shared/components/button';
import { MediaPicker, MediaFile } from '@/shared/components/media-picker';
import { Datepicker } from '@/shared/components/picker';
import { SelectField } from '@/shared/components/select-field';
import { TextField } from '@/shared/components/text-field';
import { usePrograms, useFamily } from '@/shared/lib/insurance';

import { compensationCategories } from '../../../constants';
import { AttachDocuments } from '../../../screens/compensation/components/attach-documents';
import { REQUIRED_DOCUMENT_TYPES } from '../../../screens/compensation/components/attach-documents/constants';
import {
  CompensationRequestFormValues,
  CompensationCategoryEnum,
} from '../../../types';
import { validationSchema } from '../validation-schema';

interface CompensationRequestFormProps {
  onSubmit: (values: CompensationRequestFormValues) => void;
}

export const CompensationRequestForm: FC<CompensationRequestFormProps> = ({
  onSubmit,
}) => {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [documentType, setDocumentType] = useState('');
  const [showFilesError, setShowFilesError] = useState(false);

  const { values, handleChange, handleSubmit, errors } = useFormik({
    initialValues: {
      program: '',
      person: '',
      date: '',
      amount: '',
      category: '',
    },
    onSubmit: formValues => {
      const attachedTypes = files.map(f => f.localFileType);
      const currentRequiredTypes = [...REQUIRED_DOCUMENT_TYPES];

      if (+formValues.category === CompensationCategoryEnum.Dentistry) {
        currentRequiredTypes.push('Стоматологический заказ-наряд');
      }

      const missingRequiredTypes = currentRequiredTypes.filter(
        type => !attachedTypes.includes(type),
      );

      if (missingRequiredTypes.length > 0) {
        setShowFilesError(true);
        return;
      }

      onSubmit({
        date: formValues.date,
        amount: +formValues.amount.replace(/₸/g, ''),
        files,
        personId: formValues.person,
        programId: formValues.program,
        category: +formValues.category,
      });
    },
    validationSchema,
  });

  const { programs, loadingPrograms } = usePrograms();
  const { family, loadingFamily } = useFamily(values.program);
  const activePrograms = useMemo(
    () => programs.filter(program => program.status !== 'EXPIRED'),
    [programs],
  );

  const requiredTypes = useMemo(() => {
    const types = [...REQUIRED_DOCUMENT_TYPES];
    if (+values.category === CompensationCategoryEnum.Dentistry) {
      types.push('Стоматологический заказ-наряд');
    }
    return types;
  }, [values.category]);

  useEffect(() => {
    if (activePrograms.length === 1) {
      handleChange('program')(activePrograms[0].id);
    }
  }, [activePrograms]);

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
      <SelectField
        value={values.category}
        onChange={value => handleChange('category')(value)}
        options={compensationCategories.map(item => ({
          value: item.id.toString(),
          label: item.title,
        }))}
        placeholder="Категория"
        error={errors.category}
      />
      <TextField
        placeholder="0"
        label="Сумма возмещения в тенге"
        keyboardType="number-pad"
        value={values.amount}
        error={errors.amount}
        onChangeText={value => handleChange('amount')(value)}
      />
      <Datepicker
        value={values.date}
        placeholder="DD.MM.YYYY"
        label="Дата наступления страхового случая"
        onChange={value => handleChange('date')(value)}
        error={errors.date}
        maxDate={new Date()}
      />
      <MediaPicker
        onChange={newFiles => {
          newFiles[newFiles.length - 1].localFileType = documentType;
          setFiles(newFiles);
          setDocumentType('');
          setShowFilesError(false);
        }}
      >
        <AttachDocuments
          documentType={documentType}
          setDocumentType={setDocumentType}
          files={files}
          onRemove={fileToRemove => {
            setFiles(files.filter(f => f.uri !== fileToRemove.uri));
          }}
          showError={showFilesError}
          requiredDocumentTypes={requiredTypes}
        />
      </MediaPicker>
      <Button onPress={() => handleSubmit()}>Отправить заявку</Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 32,
  },
});
