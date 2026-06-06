import { useFormik } from 'formik';
import { FC, useEffect, useMemo, useState } from 'react';
import { View, StyleSheet } from 'react-native';

import {
  DENTAL_WORK_ORDER_TYPE,
  REQUIRED_DOCUMENT_TYPES,
} from '@/modules/insurance/components/attach-documents/constants';
import { Button } from '@/shared/components/button';
import { MediaPicker, MediaFile } from '@/shared/components/media-picker';
import { Datepicker } from '@/shared/components/picker';
import { SelectField } from '@/shared/components/select-field';
import { TextField } from '@/shared/components/text-field';
import { useTranslation } from '@/shared/lib/i18n';
import { usePrograms, useFamily } from '@/shared/lib/insurance';

import { AttachDocuments } from '../../../components/attach-documents';
import { compensationCategories } from '../../../constants';
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
  const { t } = useTranslation();

  const { values, handleChange, handleSubmit, errors } = useFormik({
    initialValues: {
      program: '',
      person: '',
      date: '',
      amount: '',
      category: '',
      comments: '',
    },
    onSubmit: formValues => {
      const attachedTypes = files.map(f => f.localFileType);
      const currentRequiredTypes = [...REQUIRED_DOCUMENT_TYPES];

      if (+formValues.category === CompensationCategoryEnum.Dentistry) {
        currentRequiredTypes.push(DENTAL_WORK_ORDER_TYPE);
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
        comments: formValues.comments,
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
      types.push(DENTAL_WORK_ORDER_TYPE);
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
            label: program.title,
            subtitle: program.cardNo,
          }))}
          placeholder={t('compensation:request.selectProgram')}
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
            subtitle: item.cardNo,
          }))}
          placeholder={t('compensation:request.selectPerson')}
          error={errors.person}
        />
      )}
      <SelectField
        value={values.category}
        onChange={value => handleChange('category')(value)}
        options={compensationCategories.map(item => ({
          value: item.id.toString(),
          label: t(item.titleKey),
        }))}
        placeholder={t('compensation:request.selectCategory')}
        error={errors.category}
      />
      <TextField
        placeholder="0"
        label={t('compensation:request.amountLabel')}
        keyboardType="number-pad"
        value={values.amount}
        error={errors.amount}
        onChangeText={value => handleChange('amount')(value)}
      />
      <Datepicker
        value={values.date}
        placeholder="DD.MM.YYYY"
        label={t('compensation:request.dateLabel')}
        onChange={value => handleChange('date')(value)}
        error={errors.date}
        maxDate={new Date()}
      />
      <TextField
        placeholder={t('compensation:request.commentPlaceholder')}
        label={t('compensation:request.commentLabel')}
        value={values.comments}
        error={errors.comments}
        onChangeText={value => handleChange('comments')(value)}
      />
      <MediaPicker
        onChange={newFiles => {
          if (newFiles.length < files.length) {
            setFiles(
              files.filter(file =>
                newFiles.some(
                  nf => nf.name === file.name && nf.uri === file.uri,
                ),
              ),
            );
            return;
          }

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
      <Button onPress={() => handleSubmit()}>
        {t('compensation:request.submit')}
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 32,
  },
});
