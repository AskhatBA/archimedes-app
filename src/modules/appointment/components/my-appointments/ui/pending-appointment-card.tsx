import { FC, useState } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { formatPrice } from '@/modules/paid-programs/lib/format-price';
import { CancelPaymentDrawer, useCancelPayment } from '@/modules/payment';
import {
  ClipboardClockIcon,
  HospitalIcon,
  MapPinnedIcon,
  StethoscopeIcon,
  VideoIcon,
} from '@/shared/icons';
import { formatDate, getTimeOfDay } from '@/shared/lib/date';
import { useTranslation } from '@/shared/lib/i18n';
import { useToast } from '@/shared/lib/toast';
import { useTheme } from '@/shared/theme';

import { PendingAppointment } from '../../../hooks/use-pending-appointments';

interface PendingAppointmentCardProps {
  appointment: PendingAppointment;
}

/**
 * Stand-in for an appointment whose payment is still being confirmed.
 *
 * Not tappable — there is no appointment id yet, since the booking is created server-side
 * once the payment settles. The one thing it does offer is giving up: the provider's page
 * cannot be reopened once it is off the stack, so without this the card would sit here
 * until the payment window closed, with nothing the patient could do about it.
 */
export const PendingAppointmentCard: FC<PendingAppointmentCardProps> = ({
  appointment,
}) => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const { showToast } = useToast();
  const { cancelPayment, isCancelling } = useCancelPayment();

  const [isConfirmVisible, setIsConfirmVisible] = useState(false);

  const fontColor = colors.gray['600'];
  const mutedColor = colors.gray['500'];

  const confirmCancel = async () => {
    try {
      const payment = await cancelPayment(appointment.paymentId);

      // The payment settled while the sheet was open, which means the backend has just
      // booked the visit. Saying "cancelled" here would be a lie the list then contradicts.
      showToast({
        message:
          payment.status === 'SUCCESS'
            ? t('payment:cancel.alreadyPaid')
            : t('payment:cancel.done'),
        type: payment.status === 'SUCCESS' ? 'success' : 'info',
      });
    } catch {
      showToast({ message: t('payment:cancel.error'), type: 'error' });
    }

    setIsConfirmVisible(false);
  };

  return (
    <View
      style={[styles.container, { backgroundColor: colors.gray['200'] }]}
      accessibilityLabel={t('appointments:pendingPayment.badge')}
    >
      <View style={[styles.badge, { backgroundColor: colors.gold['100'] }]}>
        <ActivityIndicator size="small" color={colors.gold['700']} />
        <Text style={[styles.badgeText, { color: colors.gold['700'] }]}>
          {t('appointments:pendingPayment.badge')}
        </Text>
      </View>

      <View style={styles.body}>
        {appointment.startTime && (
          <View style={styles.dateContainer}>
            <Text style={[styles.timeOfDay, { color: fontColor }]}>
              {t(
                `appointments:timeOfDay.${getTimeOfDay(appointment.startTime)}`,
              )}
            </Text>
            <Text style={[styles.time, { color: fontColor }]}>
              {formatDate(appointment.startTime, 'DD MMMM, HH:mm')}
            </Text>
          </View>
        )}

        {appointment.doctorName && (
          <View style={styles.infoRow}>
            <StethoscopeIcon width={16} height={16} color={fontColor} />
            <Text style={[styles.doctorName, { color: fontColor }]}>
              {appointment.doctorName}
            </Text>
          </View>
        )}

        {appointment.branchName && (
          <View style={styles.infoRow}>
            <HospitalIcon width={16} height={16} color={fontColor} />
            <Text style={[styles.secondary, { color: fontColor }]}>
              {appointment.branchName}
            </Text>
          </View>
        )}

        {(appointment.isTelemedicine || appointment.branchAddress) && (
          <View style={styles.infoRow}>
            <MapPinnedIcon width={16} height={16} color={fontColor} />
            <Text style={[styles.secondary, { color: fontColor }]}>
              {appointment.isTelemedicine
                ? t('appointments:online')
                : appointment.branchAddress}
            </Text>
          </View>
        )}

        <View style={styles.infoRow}>
          {appointment.isTelemedicine ? (
            <VideoIcon width={16} height={16} color={fontColor} />
          ) : (
            <ClipboardClockIcon width={16} height={16} color={fontColor} />
          )}
          <Text style={[styles.secondary, { color: fontColor }]}>
            {appointment.serviceName}
          </Text>
          <Text style={[styles.price, { color: fontColor }]}>
            {formatPrice(appointment.amount)}
          </Text>
        </View>

        <Text style={[styles.hint, { color: mutedColor }]}>
          {t('appointments:pendingPayment.hint')}
        </Text>

        <TouchableOpacity
          onPress={() => setIsConfirmVisible(true)}
          disabled={isCancelling}
          style={styles.cancelButton}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Text
            style={[
              styles.cancelLabel,
              { color: isCancelling ? mutedColor : colors.red['500'] },
            ]}
          >
            {t('appointments:pendingPayment.cancel')}
          </Text>
        </TouchableOpacity>
      </View>

      <CancelPaymentDrawer
        visible={isConfirmVisible}
        onClose={() => setIsConfirmVisible(false)}
        onConfirm={confirmCancel}
        isCancelling={isCancelling}
        title={t('appointments:pendingPayment.cancelTitle')}
        description={t('appointments:pendingPayment.cancelDescription')}
        confirmLabel={t('appointments:pendingPayment.cancel')}
        // Nothing to continue: the provider's page is long gone by the time this card
        // is on screen, so the safe half is simply leaving the card alone.
        keepLabel={t('appointments:pendingPayment.cancelKeep')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 15,
    padding: 18,
  },
  body: {
    flex: 1,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 12,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
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
    fontWeight: '600',
  },
  doctorName: {
    fontSize: 18,
    fontWeight: '700',
  },
  secondary: {
    flexShrink: 1,
    fontSize: 14,
    fontWeight: '300',
  },
  price: {
    marginLeft: 'auto',
    fontSize: 14,
    fontWeight: '600',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
  },
  hint: {
    marginTop: 12,
    fontSize: 12,
    lineHeight: 16,
  },
  cancelButton: {
    alignSelf: 'flex-start',
    marginTop: 12,
  },
  cancelLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
});
