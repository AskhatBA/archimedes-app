import { useMutation } from '@tanstack/react-query';
import { FC, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { insuranceApi, RefundRequestBody } from '@/api';
import {
  CompensationRequestForm,
  CompensationRequestFormValues,
  CompensationCategoryEnum,
} from '@/modules/insurance';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from '@/shared/constants';
import { AnalyticsEvents, logAnalyticsEvent } from '@/shared/lib/analytics';
import { useTranslation } from '@/shared/lib/i18n';
import { useToast } from '@/shared/lib/toast';
import { useTheme } from '@/shared/theme';
import {
  convertUriToBase64,
  FileReadError,
} from '@/shared/utils/convert-uri-to-base64';

import { SubmitRequestSuccess } from './submit-request-success';

export const CompensationRequestScreen: FC = () => {
  const { colors } = useTheme();
  const { showToast } = useToast();
  const { t } = useTranslation();
  const deviceInsets = useSafeAreaInsets();
  const [isSuccess, setIsSuccess] = useState(false);
  // Covers the whole submit flow, including reading the attached files —
  // mutation.isPending only starts once the request is already in flight.
  const [isSubmitting, setIsSubmitting] = useState(false);

  const compensationRequestMutation = useMutation({
    mutationFn: async (data: RefundRequestBody) =>
      (await insuranceApi.refundRequestCreate(data)).data,
    onSuccess: (_data, variables) => {
      logAnalyticsEvent(AnalyticsEvents.CompensationRequestCreated, {
        program_id: variables.programId,
        person_id: variables.personId,
        category: variables.category,
        amount: variables.amount,
        files_count: variables.files?.length,
      });
      setIsSuccess(true);
    },
  });

  const submitCompensationRequest = async (
    formValues: CompensationRequestFormValues,
  ) => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      // Sequentially, not via Promise.all: every file is fully loaded into
      // memory as base64, and converting a batch of large scans at once can
      // exhaust memory on weaker devices.
      const convertedFiles: NonNullable<RefundRequestBody['files']> = [];

      /* eslint-disable no-restricted-syntax, no-await-in-loop -- the
         sequential await is the point: it keeps only one file in memory. */
      for (const file of formValues.files) {
        convertedFiles.push({
          fileType: file.localFileType,
          fileName: file.name,
          content: await convertUriToBase64(file.uri),
        });
      }
      /* eslint-enable no-restricted-syntax, no-await-in-loop */

      await compensationRequestMutation.mutateAsync({
        programId: formValues.programId,
        personId: formValues.personId,
        date: formValues.date,
        amount: +formValues.amount,
        files: convertedFiles,
        category: formValues.category as CompensationCategoryEnum,
        comments: formValues.comments,
      });
    } catch (error) {
      console.warn('Compensation request failed: ', error);

      showToast({
        type: 'error',
        message:
          error instanceof FileReadError
            ? t('compensation:request.fileReadError')
            : t('compensation:request.submitError'),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) return <SubmitRequestSuccess />;

  return (
    <>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        accessible={false}
      >
        <ScrollView
          contentContainerStyle={[
            styles.container,
            { paddingBottom: deviceInsets.bottom + 32 },
          ]}
          keyboardShouldPersistTaps="handled"
          automaticallyAdjustKeyboardInsets
        >
          <Text style={[styles.heading, { color: colors.primary }]}>
            {t('compensation:request.heading')}
          </Text>
          <CompensationRequestForm onSubmit={submitCompensationRequest} />
        </ScrollView>
      </KeyboardAvoidingView>

      {isSubmitting && (
        <View style={[styles.loaderBackdrop, { top: -deviceInsets.top - 54 }]}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  container: {
    gap: 32,
    paddingHorizontal: 16,
  },
  heading: {
    fontSize: 24,
    fontWeight: 700,
  },
  noAccountCaption: {
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 400,
  },
  loaderBackdrop: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.5)',
    position: 'absolute',
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
});
