import { useRoute } from '@react-navigation/native';
import { FC, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Linking,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  CancelAppointmentDrawer,
  cancellationErrorCode,
  useAppointmentDetails,
  useCancelAppointment,
} from '@/modules/appointment';
import { Button } from '@/shared/components/button';
import { ScreenLoader } from '@/shared/components/screen-loader';
import { usePageHeader } from '@/shared/hooks';
import {
  CalendarIcon,
  ClockIcon,
  FileTextIcon,
  HospitalIcon,
  ClipboardListIcon,
  UserFilledIcon,
  VideoIcon,
  ClipboardClockIcon,
  MapPinnedIcon,
} from '@/shared/icons';
import { formatDate } from '@/shared/lib/date';
import { useTranslation } from '@/shared/lib/i18n';
import { useToast } from '@/shared/lib/toast';
import { useNavigation } from '@/shared/navigation';
import { useTheme } from '@/shared/theme';

interface RouteParams {
  appointmentId: string;
}

/** MIS statuses that still describe a visit somebody could turn up to. */
const CANCELLABLE_MIS_STATUSES = [
  'scheduled',
  'confirmed',
  'approved',
  'pending',
  'new',
];

/** Refusals the backend can answer a cancellation with, and how each is worded. */
const CANCEL_ERROR_KEYS: Record<string, string> = {
  APPOINTMENT_ALREADY_STARTED: 'appointments:cancel.errorAlreadyStarted',
  APPOINTMENT_NOT_CANCELLABLE: 'appointments:cancel.errorNotCancellable',
  APPOINTMENT_NOT_FOUND: 'appointments:cancel.errorNotFound',
};

export const AppointmentDetailsScreen: FC = () => {
  usePageHeader({ title: 'Детали записи' });

  const route = useRoute();
  const { appointmentId } = route.params as RouteParams;
  const { colors } = useTheme();
  const { t } = useTranslation();
  const { showToast } = useToast();
  const { goBack } = useNavigation();
  const deviceInsets = useSafeAreaInsets();

  const { appointment, isAppointmentLoading } =
    useAppointmentDetails(appointmentId);
  const { cancelAppointment, isCancelling } = useCancelAppointment();

  const [isConfirmVisible, setIsConfirmVisible] = useState(false);

  /**
   * Leaves the screen once the visit is gone: staying on the details of an appointment
   * that no longer exists is worse than landing back on the list that now reflects it.
   */
  const confirmCancel = async () => {
    try {
      const result = await cancelAppointment(appointmentId);

      showToast({
        type: 'success',
        message: result.refund
          ? t('appointments:cancel.successWithRefund', {
              amount: Math.round(result.refund.amount),
            })
          : t('appointments:cancelSuccess'),
      });

      setIsConfirmVisible(false);
      goBack();
    } catch (error) {
      const key = CANCEL_ERROR_KEYS[cancellationErrorCode(error) ?? ''];

      showToast({
        type: 'error',
        message: key ? t(key) : t('appointments:cancelError'),
      });

      if (key) setIsConfirmVisible(false);
    }
  };

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

  // Hidden rather than disabled for a visit that has been and gone: the backend refuses
  // those anyway, and offering the action would only produce an error. The sheet still
  // re-checks with the backend, which owns the rule.
  const canCancel =
    CANCELLABLE_MIS_STATUSES.includes(
      (appointment.status ?? '').toLowerCase(),
    ) && new Date(appointment.start_time) > new Date();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: deviceInsets.bottom + 32 }}
    >
      {(appointment.status === 'completed' ||
        new Date(appointment.start_time) < new Date()) && (
        <View
          style={[styles.statusBadge, { backgroundColor: colors.green['100'] }]}
        >
          <Text style={[styles.statusText, { color: colors.green['600'] }]}>
            Завершена
          </Text>
        </View>
      )}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 8,
          flexWrap: 'wrap',
          marginBottom: 16,
        }}
      >
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
          {appointment.branch?.address && (
            <View style={[styles.detailRow, { marginTop: 12 }]}>
              <MapPinnedIcon
                width={20}
                height={20}
                color={colors.blue['370']}
              />
              <View style={styles.detailContent}>
                <Text
                  style={[styles.detailLabel, { color: colors.blue['370'] }]}
                >
                  Адрес
                </Text>
                <Text style={[styles.detailValue, { color: colors.textMain }]}>
                  {appointment.branch.address}
                </Text>
              </View>
            </View>
          )}
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

      {canCancel && (
        <View style={styles.actions}>
          <TouchableOpacity
            onPress={() => setIsConfirmVisible(true)}
            disabled={isCancelling}
            style={[styles.cancelButton, { borderColor: colors.red['300'] }]}
          >
            <Text
              style={[
                styles.cancelLabel,
                {
                  color: isCancelling ? colors.gray['500'] : colors.red['500'],
                },
              ]}
            >
              {t('appointments:cancelAppointment')}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      <CancelAppointmentDrawer
        visible={isConfirmVisible}
        onClose={() => setIsConfirmVisible(false)}
        onConfirm={confirmCancel}
        appointmentId={appointmentId}
        isCancelling={isCancelling}
      />
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
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 24,
    marginBottom: 16,
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
    elevation: 0,
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
    elevation: 0,
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
    marginTop: 8,
    marginBottom: 8,
  },
  cancelButton: {
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  cancelLabel: {
    fontSize: 15,
    fontWeight: '600',
  },
  zoomButton: {
    marginBottom: 24,
  },
});
