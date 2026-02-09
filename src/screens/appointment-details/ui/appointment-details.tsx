import { useRoute } from '@react-navigation/native';
import { FC } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAppointmentDetails } from '@/modules/appointment';
import { formatDate } from '@/shared/adapters/date';
import { Button } from '@/shared/components/button';
import { ScreenLoader } from '@/shared/components/screen-loader';
import { useTheme } from '@/shared/theme';

interface RouteParams {
  appointmentId: string;
}

export const AppointmentDetails: FC = () => {
  const route = useRoute();
  const { appointmentId } = route.params as RouteParams;
  const { colors } = useTheme();
  const deviceInsets = useSafeAreaInsets();

  const { appointment, isAppointmentLoading } =
    useAppointmentDetails(appointmentId);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return colors.blue['400'];
      case 'completed':
        return colors.green?.['400'] || colors.primary;
      case 'cancelled':
        return colors.red?.['400'] || colors.error;
      default:
        return colors.textMain;
    }
  };

  if (isAppointmentLoading) return <ScreenLoader />;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: deviceInsets.bottom + 32 }}
    >
      <View
        style={[styles.statusBadge, { backgroundColor: colors.blue['100'] }]}
      >
        <Text
          style={[
            styles.statusText,
            { color: getStatusColor(appointment.status) },
          ]}
        >
          {appointment.status_display}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.primary }]}>
          Информация о приеме
        </Text>
        <View
          style={[styles.infoCard, { backgroundColor: colors.gray['200'] }]}
        >
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: colors.gray['300'] }]}>
              Дата и время
            </Text>
            <Text style={[styles.infoValue, { color: colors.textMain }]}>
              {formatDate(appointment.start_time, 'DD.MM.YYYY, HH:mm')} -{' '}
              {formatDate(appointment.end_time, 'HH:mm')}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: colors.gray['300'] }]}>
              Тип записи
            </Text>
            <Text style={[styles.infoValue, { color: colors.textMain }]}>
              {appointment.record_type_display}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: colors.gray['300'] }]}>
              Тип приема
            </Text>
            <Text style={[styles.infoValue, { color: colors.textMain }]}>
              {appointment.appointment_type_display}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.primary }]}>
          Врач
        </Text>
        <View
          style={[styles.infoCard, { backgroundColor: colors.gray['200'] }]}
        >
          <Text style={[styles.doctorName, { color: colors.textMain }]}>
            {appointment.doctor_name}
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.primary }]}>
          Пациент
        </Text>
        <View
          style={[styles.infoCard, { backgroundColor: colors.gray['200'] }]}
        >
          <Text style={[styles.infoValue, { color: colors.textMain }]}>
            {appointment.beneficiary_name}
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.primary }]}>
          Клиника
        </Text>
        <View
          style={[styles.infoCard, { backgroundColor: colors.gray['200'] }]}
        >
          <Text style={[styles.infoValue, { color: colors.textMain }]}>
            {appointment.branch_name}
          </Text>
        </View>
      </View>

      {appointment.notes && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.primary }]}>
            Примечания
          </Text>
          <View
            style={[styles.infoCard, { backgroundColor: colors.gray['200'] }]}
          >
            <Text style={[styles.infoValue, { color: colors.textMain }]}>
              {appointment.notes}
            </Text>
          </View>
        </View>
      )}

      {appointment.status === 'scheduled' && (
        <View style={styles.actions}>
          <Button variant="secondary" onPress={() => {}}>
            Отменить запись
          </Button>
          <Button variant="primary" onPress={() => {}}>
            Перенести запись
          </Button>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 24,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  infoCard: {
    borderRadius: 16,
    padding: 18,
    gap: 16,
  },
  infoRow: {
    gap: 4,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '400',
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '500',
  },
  doctorName: {
    fontSize: 18,
    fontWeight: '600',
  },
  actions: {
    gap: 12,
    marginTop: 8,
  },
});
