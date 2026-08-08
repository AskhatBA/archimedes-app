import { useRoute } from '@react-navigation/native';
import { FC } from 'react';
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  CreateUserForm,
  CreateUserPayload,
  MisPrefill,
  useRegistration,
} from '@/modules/auth';
import { useTranslation } from '@/shared/lib/i18n';
import { parseIin } from '@/shared/lib/iin';
import { useTheme } from '@/shared/theme';

interface RouteParams {
  registrationToken: string;
  existsInMis: boolean;
  patient?: MisPrefill;
  phone: string;
  iin: string;
}

/**
 * Registration, step 2: the patient's personal data. When MIS already knows
 * this IIN the fields arrive filled in and locked, and we say where they came
 * from; otherwise the form starts empty.
 */
export const RegisterProfileScreen: FC = () => {
  const route = useRoute();
  const { registrationToken, existsInMis, patient, phone, iin } =
    route.params as RouteParams;
  const { colors } = useTheme();
  const { t } = useTranslation();
  const deviceInsets = useSafeAreaInsets();
  const { complete, isCompletePending } = useRegistration();

  // The IIN itself already encodes birth date and gender — a useful fallback
  // when MIS has nothing on this patient.
  const parsedIin = parseIin(iin);

  const onSubmit = (values: CreateUserPayload) => {
    complete({
      body: {
        registrationToken,
        firstName: values.firstName,
        lastName: values.lastName,
        patronymic: values.patronymic,
        birthDate: values.birthDate,
        gender: values.gender,
      },
      phone,
      iin,
    });
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={{
          paddingTop: deviceInsets.top + 16,
          paddingBottom: deviceInsets.bottom + 32,
          paddingHorizontal: 16,
        }}
      >
        <View>
          <Text style={[styles.title, { color: colors.blue['400'] }]}>
            {t('auth:registerProfileTitle')}
          </Text>

          <CreateUserForm
            submitButtonText={t('auth:registerSubmit')}
            isLoading={isCompletePending}
            notice={existsInMis ? t('auth:misDataNotice') : undefined}
            initialValues={{
              firstName: patient?.firstName,
              lastName: patient?.lastName,
              patronymic: patient?.patronymic,
              birthDate: patient?.birthDate || parsedIin?.birthDate,
              gender: patient?.gender || parsedIin?.gender,
              iin,
            }}
            onSubmit={onSubmit}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 21,
    fontWeight: 700,
    marginTop: 16,
    marginBottom: 32,
    textAlign: 'center',
  },
});
