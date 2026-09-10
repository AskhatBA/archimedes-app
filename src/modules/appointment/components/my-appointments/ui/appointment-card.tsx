import { FC, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

import {
  ThreeDotsIcon,
  ClipboardClockIcon,
  VideoIcon,
  StethoscopeIcon,
  HospitalIcon,
  MapPinnedIcon,
} from '@/shared/icons';
import { getTimeOfDay, formatDate } from '@/shared/lib/date';
import { useTranslation } from '@/shared/lib/i18n';
import { useToast } from '@/shared/lib/toast';
import { routes, useNavigation } from '@/shared/navigation';
import { useTheme } from '@/shared/theme';

import {
  cancellationErrorCode,
  useCancelAppointment,
} from '../../../hooks/use-appointment-cancellation';
import { CancelAppointmentDrawer } from '../../cancel-appointment-drawer';

export type AppointmentCardColors = 'blue' | 'green' | 'orange';

interface AppointmentCardProps {
  color?: AppointmentCardColors;
  doctorName: string;
  date: string;
  appointmentId: string;
  appointmentType?: string;
  branchName?: string;
  branchAddress: string;
  isPast?: boolean;
}

/** Refusals the backend can answer a cancellation with, and how each is worded. */
const CANCEL_ERROR_KEYS: Record<string, string> = {
  APPOINTMENT_ALREADY_STARTED: 'appointments:cancel.errorAlreadyStarted',
  APPOINTMENT_NOT_CANCELLABLE: 'appointments:cancel.errorNotCancellable',
  APPOINTMENT_NOT_FOUND: 'appointments:cancel.errorNotFound',
};

export const AppointmentCard: FC<AppointmentCardProps> = ({
  color = 'blue',
  doctorName,
  date,
  appointmentId,
  appointmentType,
  branchName,
  branchAddress,
  isPast = false,
}) => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const { navigate } = useNavigation();
  const { showToast } = useToast();
  const { cancelAppointment, isCancelling } = useCancelAppointment();

  const [isConfirmVisible, setIsConfirmVisible] = useState(false);

  const backgrounds = {
    blue: colors.blue['100'],
    orange: colors.orange['200'],
    green: colors.green['100'],
  };

  const fontColor = {
    blue: colors.blue['400'],
    orange: colors.orange['600'],
    green: colors.green['600'],
  };

  const moreButtonColor = {
    blue: colors.blue['500'],
    orange: colors.orange['600'],
    green: colors.green['600'],
  };

  const isTelemedicine = appointmentType === 'telemedicine';

  /**
   * The refund is only queued server-side, so the toast reports what was actually agreed
   * — the sum coming back — rather than claiming the money has already arrived.
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
    } catch (error) {
      // The backend refuses before touching anything, so the visit is still booked and
      // the reason is worth showing instead of a generic failure.
      const key = CANCEL_ERROR_KEYS[cancellationErrorCode(error) ?? ''];

      showToast({
        type: 'error',
        message: key ? t(key) : t('appointments:cancelError'),
      });

      if (key) setIsConfirmVisible(false);
    }
  };

  return (
    <TouchableOpacity
      onPress={() => navigate(routes.AppointmentDetails, { appointmentId })}
      style={[
        styles.container,
        { backgroundColor: backgrounds[color] },
        isPast && styles.pastCard,
      ]}
    >
      {!isPast && (
        <TouchableOpacity
          style={styles.moreButton}
          onPress={() => setIsConfirmVisible(true)}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          accessibilityLabel={t('appointments:cancelAppointment')}
        >
          <ThreeDotsIcon color={moreButtonColor[color]} />
        </TouchableOpacity>
      )}
      {isPast && (
        <View style={styles.pastLabel}>
          <Text style={styles.pastLabelText}>
            {t('appointments:completed')}
          </Text>
        </View>
      )}
      <View style={{ flex: 1 }}>
        <View style={styles.dateContainer}>
          <Text style={[styles.timeOfDay, { color: fontColor[color] }]}>
            {t(`appointments:timeOfDay.${getTimeOfDay(date)}`)}
          </Text>
          <Text style={[styles.time, { color: fontColor[color] }]}>
            {formatDate(date, 'HH:mm')}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <StethoscopeIcon width={16} height={16} color={fontColor[color]} />
          <Text style={[styles.doctorName, { color: fontColor[color] }]}>
            {doctorName}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <HospitalIcon width={16} height={16} color={fontColor[color]} />
          <Text
            style={[styles.specializationName, { color: fontColor[color] }]}
          >
            {branchName}
          </Text>
        </View>
        {branchName && (
          <View style={styles.infoRow}>
            <MapPinnedIcon width={16} height={16} color={fontColor[color]} />
            <Text
              style={[styles.specializationName, { color: fontColor[color] }]}
            >
              {isTelemedicine ? t('appointments:online') : branchAddress}
            </Text>
          </View>
        )}
        <View style={styles.appointmentTypeLabel}>
          {isTelemedicine ? (
            <VideoIcon width={16} height={16} color={fontColor[color]} />
          ) : (
            <ClipboardClockIcon
              width={16}
              height={16}
              color={fontColor[color]}
            />
          )}
          <Text
            style={[styles.appointmentTypeText, { color: fontColor[color] }]}
          >
            {isTelemedicine
              ? t('appointments:telemedicine')
              : t('appointments:inPerson')}
          </Text>
        </View>
      </View>

      <CancelAppointmentDrawer
        visible={isConfirmVisible}
        onClose={() => setIsConfirmVisible(false)}
        onConfirm={confirmCancel}
        appointmentId={appointmentId}
        isCancelling={isCancelling}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 16,
    borderRadius: 15,
    padding: 18,
  },
  square: {
    width: 50,
    height: 50,
    borderRadius: 10,
  },
  dateContainer: {
    flexDirection: 'row',
    gap: 4,
  },
  timeOfDay: {
    fontSize: 14,
  },
  time: {
    fontSize: 14,
    fontWeight: 600,
  },
  doctorName: {
    fontSize: 18,
    fontWeight: 700,
  },
  specializationName: {
    fontSize: 14,
    fontWeight: 300,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
  },
  moreButton: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 10,
    right: 15,
  },
  appointmentTypeLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
  },
  appointmentTypeText: {
    fontSize: 12,
    fontWeight: '500',
  },
  pastCard: {
    opacity: 1,
  },
  pastLabel: {
    position: 'absolute',
    top: 10,
    right: 15,
    backgroundColor: '#E0E0E0',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  pastLabelText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#666',
  },
});
