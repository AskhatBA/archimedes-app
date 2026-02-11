import { FC } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import {
  CreateAppointmentContextProvider,
  CreateAppointmentForm,
} from '@/modules/appointment';

export const CreateAppointmentScreen: FC = () => {
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
    paddingHorizontal: 32,
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
