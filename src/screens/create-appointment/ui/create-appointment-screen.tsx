import { FC } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import {
  CreateAppointmentContextProvider,
  CreateAppointmentForm,
} from '@/modules/appointment';
import { usePageHeader } from '@/shared/hooks';

export const CreateAppointmentScreen: FC = () => {
  usePageHeader({ title: '"Запись на прием"' });

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View>
        <CreateAppointmentContextProvider>
          <CreateAppointmentForm />
        </CreateAppointmentContextProvider>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  title: {
    marginTop: 16,
    fontSize: 24,
    lineHeight: 22,
    fontWeight: 700,
    letterSpacing: 0,
  },
});
