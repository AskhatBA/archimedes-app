import { FC } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';

import { useAppointments } from '@/modules/appointment/hooks/use-appointments';
import { globalStyles } from '@/shared/theme';

import { AppointmentCard } from './appointment-card';

export const CurrentAppointments: FC = () => {
  const { appointments } = useAppointments();

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
        {appointments?.map(appointment => (
          <AppointmentCard
            key={appointment.id}
            doctorName={appointment.doctor_name}
            specialization={appointment.branch_name}
            date={appointment.start_time}
          />
        ))}
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
