import { useRoute } from '@react-navigation/native';
import { FC } from 'react';
import { View, Text, StyleSheet, ScrollView, Linking } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAppointmentDetails } from '@/modules/appointment';
import { formatDate } from '@/shared/adapters/date';
import { Button } from '@/shared/components/button';
import { ScreenLoader } from '@/shared/components/screen-loader';
import {
  CalendarIcon,
  ClockIcon,
  FileTextIcon,
  HospitalIcon,
  ClipboardListIcon,
  UserFilledIcon,
  VideoIcon,
  ClipboardClockIcon,
} from '@/shared/icons';
import { useTheme } from '@/shared/theme';

interface RouteParams {
  appointmentId: string;
}

export const AppointmentDetailsScreen: FC = () => {
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

  const getStatusBackground = (status: string) => {
    switch (status) {
      case 'scheduled':
        return colors.blue['100'];
      case 'completed':
        return colors.green['100'];
      case 'cancelled':
        return colors.red['100'];
      default:
        return colors.gray['200'];
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: deviceInsets.bottom + 32 }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: getStatusBackground(appointment.status) },
          ]}
        >
          <Text
            style={[
              styles.statusText,
              { color: getStatusColor(appointment.status) },
            ]}
          >
            {appointment.appointment_type_display}
          </Text>
        </View>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: getStatusBackground(appointment.status) },
          ]}
        >
          {appointment.meeting_id ? (
            <VideoIcon color={colors.blue['400']} width={20} height={20} />
          ) : (
            <ClipboardClockIcon
              color={colors.blue['400']}
              width={20}
              height={20}
            />
          )}
          <Text
            style={[
              styles.statusText,
              { color: getStatusColor(appointment.status) },
            ]}
          >
            {appointment.meeting_id ? 'Телемедицина' : 'Обычный'}
          </Text>
        </View>
      </View>

      {appointment.meeting_id && appointment.meeting_join_url && (
        <Button
          icon={<VideoIcon width={22} height={22} color={colors.white} />}
          onPress={() => Linking.openURL(appointment.meeting_join_url)}
          style={styles.zoomButton}
        >
          Подключиться через Zoom
        </Button>
      )}

      <View style={[styles.mainCard, { backgroundColor: colors.blue['100'] }]}>
        <View style={styles.mainCardRow}>
          <CalendarIcon width={24} height={24} color={colors.primary} />
          <View style={styles.mainCardContent}>
            <Text style={[styles.mainCardLabel, { color: colors.blue['370'] }]}>
              Дата приема
            </Text>
            <Text style={[styles.mainCardValue, { color: colors.primary }]}>
              {formatDate(appointment.start_time, 'DD MMMM YYYY')}
            </Text>
          </View>
        </View>

        <View style={styles.mainCardRow}>
          <ClockIcon width={24} height={24} color={colors.primary} />
          <View style={styles.mainCardContent}>
            <Text style={[styles.mainCardLabel, { color: colors.blue['370'] }]}>
              Время
            </Text>
            <Text style={[styles.mainCardValue, { color: colors.primary }]}>
              {formatDate(appointment.start_time, 'HH:mm')} -{' '}
              {formatDate(appointment.end_time, 'HH:mm')}
            </Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.mainCardRow}>
          <ClipboardListIcon width={24} height={24} color={colors.primary} />
          <View style={styles.mainCardContent}>
            <Text style={[styles.mainCardLabel, { color: colors.blue['370'] }]}>
              Тип записи
            </Text>
            <Text style={[styles.mainCardValue, { color: colors.primary }]}>
              {appointment.record_type_display}
            </Text>
          </View>
        </View>

        <View style={styles.mainCardRow}>
          <FileTextIcon width={24} height={24} color={colors.primary} />
          <View style={styles.mainCardContent}>
            <Text style={[styles.mainCardLabel, { color: colors.blue['370'] }]}>
              Тип приема
            </Text>
            <Text style={[styles.mainCardValue, { color: colors.primary }]}>
              {appointment.appointment_type_display}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.primary }]}>
          Детали
        </Text>

        <View
          style={[styles.detailCard, { backgroundColor: colors.gray['200'] }]}
        >
          <View style={styles.detailRow}>
            <UserFilledIcon width={20} height={20} color={colors.blue['370']} />
            <View style={styles.detailContent}>
              <Text style={[styles.detailLabel, { color: colors.blue['370'] }]}>
                Врач
              </Text>
              <Text style={[styles.detailValue, { color: colors.textMain }]}>
                {appointment.doctor_name}
              </Text>
            </View>
          </View>
        </View>

        <View
          style={[styles.detailCard, { backgroundColor: colors.gray['200'] }]}
        >
          <View style={styles.detailRow}>
            <UserFilledIcon width={20} height={20} color={colors.blue['370']} />
            <View style={styles.detailContent}>
              <Text style={[styles.detailLabel, { color: colors.blue['370'] }]}>
                Пациент
              </Text>
              <Text style={[styles.detailValue, { color: colors.textMain }]}>
                {appointment.beneficiary_name}
              </Text>
            </View>
          </View>
        </View>

        <View
          style={[styles.detailCard, { backgroundColor: colors.gray['200'] }]}
        >
          <View style={styles.detailRow}>
            <HospitalIcon width={20} height={20} color={colors.blue['370']} />
            <View style={styles.detailContent}>
              <Text style={[styles.detailLabel, { color: colors.blue['370'] }]}>
                Клиника
              </Text>
              <Text style={[styles.detailValue, { color: colors.textMain }]}>
                {appointment.branch_name}
              </Text>
            </View>
          </View>
        </View>

        {appointment.notes && (
          <View
            style={[styles.detailCard, { backgroundColor: colors.gray['200'] }]}
          >
            <View style={styles.detailRow}>
              <FileTextIcon width={20} height={20} color={colors.blue['370']} />
              <View style={styles.detailContent}>
                <Text
                  style={[styles.detailLabel, { color: colors.blue['370'] }]}
                >
                  Примечания
                </Text>
                <Text style={[styles.detailValue, { color: colors.textMain }]}>
                  {appointment.notes}
                </Text>
              </View>
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 24,
    marginBottom: 24,
  },
  statusText: {
    fontSize: 15,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  mainCard: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  mainCardRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
    marginBottom: 16,
  },
  mainCardContent: {
    flex: 1,
    gap: 4,
  },
  mainCardLabel: {
    fontSize: 13,
    fontWeight: '500',
  },
  mainCardValue: {
    fontSize: 17,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: '#D4E3EF',
    marginVertical: 8,
    marginBottom: 24,
  },
  section: {
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },
  detailCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  detailContent: {
    flex: 1,
    gap: 4,
  },
  detailLabel: {
    fontSize: 13,
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  actions: {
    gap: 12,
    marginTop: 24,
  },
  zoomButton: {
    marginBottom: 24,
  },
});
