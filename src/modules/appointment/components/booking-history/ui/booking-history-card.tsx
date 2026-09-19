import dayjs from 'dayjs';
import { FC } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { formatAmount } from '@/modules/med-account';
import {
  HospitalIcon,
  MapPinnedIcon,
  StethoscopeIcon,
  VideoIcon,
} from '@/shared/icons';
import { formatDate } from '@/shared/lib/date';
import { useTranslation } from '@/shared/lib/i18n';
import { colors, fonts } from '@/shared/theme';

import type { AppointmentHistoryItem } from '@/api';

/**
 * `PAST` is not a backend status: it is a `SCHEDULED` visit whose time has gone by. The
 * backend's MIS sweep only re-checks the last week, so older rows can stay `SCHEDULED`
 * for good, and calling them "запланирована" would be plainly wrong. "Завершена" would be
 * a guess, so the badge says only what is known — the time has passed.
 */
type BadgeStatus = AppointmentHistoryItem['status'] | 'PAST';

const STATUS_STYLE: Record<BadgeStatus, { background: string; text: string }> =
  {
    SCHEDULED: { background: colors.blue['150'], text: colors.blue['500'] },
    PAST: { background: colors.gray['200'], text: colors.gray['600'] },
    COMPLETED: { background: colors.green['200'], text: colors.green['600'] },
    CANCELLED: { background: colors.red['100'], text: colors.red['500'] },
  };

const badgeStatusOf = (booking: AppointmentHistoryItem): BadgeStatus =>
  booking.status === 'SCHEDULED' && dayjs(booking.dateTime).isBefore(dayjs())
    ? 'PAST'
    : booking.status;

interface BookingHistoryCardProps {
  booking: AppointmentHistoryItem;
}

/**
 * One visit in the patient's booking history.
 *
 * Read-only on purpose: the row holds a MIS id that may be a booking *request* rather than
 * an appointment, which the details screen cannot open, and cancelling belongs to the
 * upcoming list. What a patient comes here for is what happened and what it cost — so the
 * money line is always there, and a cancelled paid visit says where its refund has got to.
 */
export const BookingHistoryCard: FC<BookingHistoryCardProps> = ({
  booking,
}) => {
  const { t } = useTranslation();

  const badgeStatus = badgeStatusOf(booking);
  const statusStyle = STATUS_STYLE[badgeStatus];

  const place = booking.isTelemedicine
    ? t('appointments:bookingHistory.online')
    : [booking.branchName, booking.branchAddress].filter(Boolean).join(', ');

  let PlaceIcon = HospitalIcon;
  if (booking.isTelemedicine) PlaceIcon = VideoIcon;
  else if (booking.branchAddress) PlaceIcon = MapPinnedIcon;

  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <Text style={styles.date}>
          {formatDate(booking.dateTime, 'DD.MM.YYYY, HH:mm')}
        </Text>
        <View
          style={[styles.status, { backgroundColor: statusStyle.background }]}
        >
          <Text style={[styles.statusText, { color: statusStyle.text }]}>
            {t(`appointments:bookingHistory.status.${badgeStatus}`)}
          </Text>
        </View>
      </View>

      <Text style={styles.doctor} numberOfLines={2}>
        {booking.doctorName ?? t('appointments:bookingHistory.unknownDoctor')}
      </Text>

      {!!booking.doctorSpecialty && (
        <View style={styles.infoRow}>
          <StethoscopeIcon width={16} height={16} color={colors.blue['400']} />
          <Text style={styles.infoText}>{booking.doctorSpecialty}</Text>
        </View>
      )}

      {!!place && (
        <View style={styles.infoRow}>
          <PlaceIcon width={16} height={16} color={colors.blue['400']} />
          <Text style={styles.infoText}>{place}</Text>
        </View>
      )}

      {booking.isForFamilyMember && (
        <Text style={styles.hint}>
          {t('appointments:bookingHistory.familyMember')}
        </Text>
      )}

      <Text style={styles.hint}>
        {booking.paidAmount !== null
          ? t('appointments:bookingHistory.paid', {
              amount: formatAmount(booking.paidAmount),
            })
          : t('appointments:bookingHistory.program')}
      </Text>

      {!!booking.refund && (
        <Text
          style={[
            styles.hint,
            booking.refund.status === 'FAILED' && styles.hintAttention,
          ]}
        >
          {t(`appointments:bookingHistory.refund.${booking.refund.status}`, {
            amount: formatAmount(booking.refund.amount),
          })}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.blue['200'],
    backgroundColor: colors.blue['100'],
    paddingHorizontal: 14,
    paddingVertical: 14,
    gap: 6,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  date: {
    fontSize: 13,
    fontFamily: fonts.SFPro.Medium,
    color: colors.gray['500'],
  },
  status: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  statusText: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '700',
    fontFamily: fonts.SFPro.Bold,
  },
  doctor: {
    fontSize: 17,
    lineHeight: 22,
    fontWeight: '700',
    fontFamily: fonts.SFPro.Bold,
    color: colors.blue['500'],
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 18,
    fontFamily: fonts.SFPro.Regular,
    color: colors.blue['400'],
  },
  hint: {
    fontSize: 13,
    lineHeight: 18,
    fontFamily: fonts.SFPro.Regular,
    color: colors.blue['370'],
  },
  hintAttention: {
    color: colors.red['500'],
  },
});
