import { FC } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { formatPrice } from '@/modules/paid-programs/lib/format-price';
import {
  ClipboardClockIcon,
  HospitalIcon,
  MapPinnedIcon,
  StethoscopeIcon,
  VideoIcon,
} from '@/shared/icons';
import { formatDate, getTimeOfDay } from '@/shared/lib/date';
import { useTranslation } from '@/shared/lib/i18n';
import { useTheme } from '@/shared/theme';

import { PendingAppointment } from '../../../hooks/use-pending-appointments';

interface PendingAppointmentCardProps {
  appointment: PendingAppointment;
}

/**
 * Stand-in for an appointment whose payment is still being confirmed.
 *
 * Deliberately not tappable and without a cancel action: there is no appointment id yet —
 * the booking is created server-side once the payment settles.
 */
export const PendingAppointmentCard: FC<PendingAppointmentCardProps> = ({
  appointment,
}) => {
  const { colors } = useTheme();
  const { t } = useTranslation();

  const fontColor = colors.gray['600'];
  const mutedColor = colors.gray['500'];

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
      </View>
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
});
