import { FC } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';

import { globalStyles } from '@/shared/theme';

import { AppointmentCard } from './appointment-card';

export const CurrentAppointments: FC = () => {
  return (
    <View>
      <Text style={globalStyles.sectionHeading}>Текущие записи</Text>
      <ScrollView horizontal contentContainerStyle={styles.carouselContainer}>
        <AppointmentCard
          doctorName="Тастанбекова Л. "
          specialization="Терапевт"
          date="2025-07-31T10:30"
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  carouselContainer: {
    marginTop: 18,
  },
});
