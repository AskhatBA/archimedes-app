import { FC } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';

import { globalStyles } from '@/shared/theme';

import { AppointmentCard } from './appointment-card';

export const CurrentAppointments: FC = () => {
  return (
    <View style={{ marginLeft: -32, marginRight: -32 }}>
      <Text style={[globalStyles.sectionHeading, { marginLeft: 32 }]}>
        Текущие записи
      </Text>
      <ScrollView
        horizontal
        contentContainerStyle={styles.carouselContainer}
        showsHorizontalScrollIndicator={false}
      >
        <AppointmentCard
          doctorName="Тастанбекова Л. "
          specialization="Терапевт"
          date="2025-07-31T10:30"
        />
        <AppointmentCard
          doctorName="Тастанбекова Л. "
          specialization="Терапевт"
          date="2025-07-31T10:30"
        />
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
    gap: 8,
    paddingLeft: 32,
    paddingRight: 32,
  },
});
