import { FC } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';

import { useAppointments } from '@/modules/appointment/hooks/use-appointments';
import { fonts, globalStyles, useTheme } from '@/shared/theme';

import { AppointmentCard } from './appointment-card';

export const CurrentAppointments: FC = () => {
  const { colors } = useTheme();
  const { appointments, loadingAppointments } = useAppointments();

  const renderAppointments = () => {
    if (loadingAppointments) {
      return (
        <View style={styles.loaderContainer}>
          <ActivityIndicator color={colors.primary} />
        </View>
      );
    }

    if (!appointments?.length) {
      return (
        <View style={styles.noAppointmentsContainer}>
          <Text style={styles.noAppointmentsText}>
            Записи на прием отсутствуют
          </Text>
        </View>
      );
    }

    return (
      <ScrollView
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      >
        {appointments.slice(0, 5).map((appointment, index) => (
          <View
            key={appointment.id}
            style={{ marginBottom: index === appointments.length - 1 ? 0 : 12 }}
          >
            <AppointmentCard
              doctorName={appointment.doctor_name}
              specialization={appointment.branch_name}
              date={appointment.start_time}
            />
          </View>
        ))}
      </ScrollView>
    );
  };

  return (
    <View style={{ marginLeft: -32, marginRight: -32 }}>
      <Text style={[globalStyles.sectionHeading, { marginLeft: 32 }]}>
        Текущие записи
      </Text>
      {renderAppointments()}
    </View>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    marginTop: 18,
    gap: 0,
    paddingLeft: 32,
    paddingRight: 32,
    paddingBottom: 8,
  },
  loaderContainer: {
    marginTop: 24,
  },
  noAppointmentsContainer: {
    marginTop: 24,
  },
  noAppointmentsText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    fontFamily: fonts.SFPro.Regular,
  },
});
