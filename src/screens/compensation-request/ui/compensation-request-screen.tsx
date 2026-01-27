import { useMutation } from '@tanstack/react-query';
import { FC, useState } from 'react';
import {
  Text,
  StyleSheet,
  ScrollView,
  View,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { insuranceApi, RefundRequestBody } from '@/api';
import {
  CompensationRequestForm,
  CompensationRequestFormValues,
  CompensationCategoryEnum,
} from '@/modules/insurance';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from '@/shared/constants';
import { useToast } from '@/shared/lib/toast';
import { useTheme } from '@/shared/theme';
import { convertUriToBase64 } from '@/shared/utils/convert-uri-to-base64';

import { SubmitRequestSuccess } from './submit-request-success';

export const CompensationRequestScreen: FC = () => {
  const { colors } = useTheme();
  const { showToast } = useToast();
  const deviceInsets = useSafeAreaInsets();
  const [isSuccess, setIsSuccess] = useState(false);

  const compensationRequestMutation = useMutation({
    mutationFn: async (data: RefundRequestBody) =>
      (await insuranceApi.refundRequestCreate(data)).data,
    onSuccess: () => {
      setIsSuccess(true);
    },
    onError: () => {
      showToast({
        type: 'error',
        message: 'Произошла ошибка. Пожалуйста обратитесь в поддержку',
      });
    },
  });

  const submitCompensationRequest = async (
    formValues: CompensationRequestFormValues,
  ) => {
    const promises = formValues.files.map(async file => {
      const base64Content = await convertUriToBase64(file.uri);

      return {
        fileType: file.localFileType,
        fileName: file.name,
        content: base64Content,
      };
    });

    const convertedFiles = await Promise.all(promises);

    compensationRequestMutation.mutate({
      programId: formValues.programId,
      personId: formValues.personId,
      date: formValues.date,
      amount: +formValues.amount,
      files: convertedFiles,
      category: formValues.category as CompensationCategoryEnum,
    });
  };

  if (isSuccess) return <SubmitRequestSuccess />;

  return (
    <>
      <ScrollView
        contentContainerStyle={[
          styles.container,
          { paddingBottom: deviceInsets.bottom + 32 },
        ]}
      >
        <Text style={[styles.heading, { color: colors.primary }]}>
          Заявка на возмещение
        </Text>
        <CompensationRequestForm onSubmit={submitCompensationRequest} />
      </ScrollView>

      {compensationRequestMutation.isPending && (
        <View style={[styles.loaderBackdrop, { top: -deviceInsets.top - 54 }]}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 32,
    paddingHorizontal: 24,
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
