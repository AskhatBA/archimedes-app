import { FC } from 'react';
import { ScrollView, StyleSheet, View, Text } from 'react-native';

import { FindSpecialistBanner } from '@/shared/components/find-specialist-banner';
import { useTheme } from '@/shared/theme';

import { CreateAppointmentContextProvider } from '../context/create-appointment-context';
import { CreateAppointmentForm } from '../forms/create-appointment-form';

export const CreateAppointmentScreen: FC = () => {
  const { colors } = useTheme();

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View>
        <FindSpecialistBanner />
        <Text style={[styles.title, { color: colors.textMain }]}>
          Запись на прием
        </Text>
        <CreateAppointmentContextProvider>
          <CreateAppointmentForm />
        </CreateAppointmentContextProvider>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    paddingHorizontal: 32,
    paddingTop: 16,
    paddingBottom: 32,
  },
  title: {
    marginTop: 40,
    fontSize: 24,
    lineHeight: 22,
    fontWeight: 700,
    letterSpacing: 0,
  },
});
