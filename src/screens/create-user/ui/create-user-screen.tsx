import { useMutation } from '@tanstack/react-query';
import { FC } from 'react';
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { patientApi, misApi } from '@/api';
import { CreateUserForm, CreateUserPayload } from '@/modules/auth';
import { useMisPatient, useUser } from '@/modules/user';
import { ScreenLoader } from '@/shared/components/screen-loader';
import { MainLayout } from '@/shared/layout/main-layout';
import { useAuth } from '@/shared/lib/auth';
import { parseIin } from '@/shared/lib/iin';
import { useToast } from '@/shared/lib/toast';
import { useNavigation, routes } from '@/shared/navigation';
import { useTheme } from '@/shared/theme';

export const CreateUserScreen: FC = () => {
  const { colors } = useTheme();
  const { misPatient, loadingMisPatient } = useMisPatient();
  const { resetNavigation } = useNavigation();
  const { user, refreshUserData } = useUser();
  const { logout, loginIin } = useAuth();
  const { showToast } = useToast();
  const deviceInsets = useSafeAreaInsets();

  const isUserExistsInMis =
    !!misPatient?.patient?.lastName &&
    !!misPatient?.patient?.firstName &&
    !!misPatient?.patient?.iin;

  const iin = misPatient?.patient?.iin || loginIin;
  const parsedIin = parseIin(iin);

  const saveUserProfileMutation = useMutation({
    mutationFn: (values: CreateUserPayload) =>
      patientApi.profileCreate({
        birthDate: values.birthDate,
        firstName: values.firstName,
        lastName: values.lastName,
        patronymic: values.patronymic,
        gender: values.gender,
        iin: values.iin,
      }),
    onSuccess: () => {
      refreshUserData();
      resetNavigation(routes.TabNavigation);
    },
  });

  const misProfileMutation = useMutation({
    mutationFn: (values: CreateUserPayload) =>
      misApi.createPatientCreate({
        birthDate: values.birthDate,
        firstName: values.firstName,
        lastName: values.lastName,
        gender: values.gender,
        iin: values.iin,
        patronymic: values.patronymic,
        phoneNumber: user.phone,
      }),
    onError: (error: any) => {
      showToast({
        type: 'error',
        message: error?.response?.data?.message,
      });
    },
  });

  const onLogout = () => {
    Alert.alert('Выход', 'Вы уверены, что хотите выйти?', [
      {
        text: 'Отмена',
        style: 'cancel',
      },
      {
        text: 'Выйти',
        onPress: logout,
        style: 'destructive',
      },
    ]);
  };

  if (loadingMisPatient) return <ScreenLoader />;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
    >
      <ScrollView
        contentContainerStyle={{
          paddingTop: deviceInsets.top + 16,
          paddingBottom: deviceInsets.bottom + 32,
          paddingHorizontal: 16,
        }}
      >
        <View style={styles.container}>
          <Text style={[styles.title, { color: colors.blue['400'] }]}>
            Данные пациента
          </Text>
          <CreateUserForm
            submitButtonText={isUserExistsInMis ? 'Продолжить' : 'Сохранить'}
            isLoading={
              saveUserProfileMutation.isPending || misProfileMutation.isPending
            }
            initialValues={{
              firstName: misPatient?.patient?.firstName,
              lastName: misPatient?.patient?.lastName,
              birthDate: misPatient?.patient?.birthDate || parsedIin?.birthDate,
              patronymic: misPatient?.patient?.patronymic,
              iin,
              gender: misPatient?.patient?.gender || parsedIin?.gender,
            }}
            onSubmit={async formValues => {
              if (!isUserExistsInMis) {
                await misProfileMutation.mutateAsync(formValues);
              }
              await saveUserProfileMutation.mutateAsync(formValues);
            }}
          />
          <TouchableOpacity style={styles.logoutContainer} onPress={onLogout}>
            <Text style={styles.logoutText}>Отменить и выйти</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 0,
  },
  title: {
    fontSize: 21,
    fontWeight: 700,
    marginTop: 16,
    marginBottom: 32,
    textAlign: 'center',
  },
  logoutContainer: {
    paddingVertical: 16,
    marginTop: 16,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: 600,
    textAlign: 'center',
  },
});
