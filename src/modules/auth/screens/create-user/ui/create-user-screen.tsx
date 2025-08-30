import { useMutation } from '@tanstack/react-query';
import { FC } from 'react';
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from 'react-native';

import { patientApi, misApi } from '@/api';
import { ScreenLoader } from '@/shared/components/screen-loader';
import { useAuth } from '@/shared/lib/auth';
import { useUser } from '@/shared/lib/user';
import { useNavigation, routes } from '@/shared/navigation';
import { useTheme } from '@/shared/theme';

import { CreateUserForm, CreateUserPayload } from '../forms/create-user-form';
import { useMisPatient } from '../hooks/use-mis-patient';

export const CreateUserScreen: FC = () => {
  const { colors } = useTheme();
  const { misPatient, loadingMisPatient } = useMisPatient();
  const { resetNavigation } = useNavigation();
  const { user, refreshUserData } = useUser();
  const { logout } = useAuth();

  const isUserExistsInMis =
    !!misPatient?.patient?.lastName &&
    !!misPatient?.patient?.firstName &&
    !!misPatient?.patient?.patronymic &&
    !!misPatient?.patient?.iin;

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
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
          <View style={styles.container}>
            <Text style={[styles.title, { color: colors.blue['400'] }]}>
              Заполните данные о себе
            </Text>
            <CreateUserForm
              isLoading={
                saveUserProfileMutation.isPending ||
                misProfileMutation.isPending
              }
              initialValues={{
                firstName: misPatient?.patient?.firstName,
                lastName: misPatient?.patient?.lastName,
                birthDate: misPatient?.patient?.birthDate,
                patronymic: misPatient?.patient?.patronymic,
                iin: misPatient?.patient?.iin,
                gender: misPatient?.patient?.gender,
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
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 32,
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
