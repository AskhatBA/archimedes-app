import { FC } from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { MISAppointmentRequest } from '@/api';
import {
  ClipboardClockIcon,
  ClockIcon,
  HospitalIcon,
  StethoscopeIcon,
  VideoIcon,
} from '@/shared/icons';
import { formatDate } from '@/shared/lib/date';
import { useTheme } from '@/shared/theme';

interface AppointmentRequestCardProps {
  request: MISAppointmentRequest;
}

const STATUS_STYLES: Record<
  string,
  { bg: string; text: string; label: string }
> = {
  pending: {
    bg: '#FCF1E2',
    text: '#CF8E52',
    label: 'Ожидает',
  },
  processing: {
    bg: '#FCF1E2',
    text: '#CF8E52',
    label: 'Обрабатывается',
  },
  approved: {
    bg: '#F4F9E9',
    text: '#69914F',
    label: 'Подтверждено',
  },
  confirmed: {
    bg: '#F4F9E9',
    text: '#69914F',
    label: 'Подтверждено',
  },
  rejected: {
    bg: '#F8E2E1',
    text: '#e25853',
    label: 'Отклонено',
  },
};

const getStatusStyle = (status?: string) => {
  if (!status) return STATUS_STYLES.pending;
  return (
    STATUS_STYLES[status.toLowerCase()] ?? {
      bg: '#F0F6FC',
      text: '#295D87',
      label: status,
    }
  );
};

export const AppointmentRequestCard: FC<AppointmentRequestCardProps> = ({
  request,
}) => {
  const { colors } = useTheme();
  const statusStyle = getStatusStyle(request.status);
  const isTelemedicine = request.appointment_type === 'telemedicine';

  return (
    <View style={[styles.container, { backgroundColor: colors.blue['100'] }]}>
      <View style={styles.header}>
        <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
          <Text style={[styles.statusText, { color: statusStyle.text }]}>
            {request.status_display || statusStyle.label}
          </Text>
        </View>
        {request.start_time && (
          <View style={styles.dateRow}>
            <ClockIcon width={14} height={14} color={colors.gray['500']} />
            <Text style={[styles.dateText, { color: colors.gray['500'] }]}>
              {formatDate(request.start_time, 'DD MMM, HH:mm')}
            </Text>
          </View>
        )}
      </View>

      {request.doctor_name && (
        <View style={styles.infoRow}>
          <StethoscopeIcon width={16} height={16} color={colors.blue['400']} />
          <Text style={[styles.doctorName, { color: colors.blue['400'] }]}>
            {request.doctor_name}
          </Text>
        </View>
      )}

      {request.branch_name && (
        <View style={styles.infoRow}>
          <HospitalIcon width={16} height={16} color={colors.gray['500']} />
          <Text style={[styles.infoText, { color: colors.gray['500'] }]}>
            {request.branch_name}
          </Text>
        </View>
      )}

      <View style={styles.infoRow}>
        {isTelemedicine ? (
          <VideoIcon width={16} height={16} color={colors.gray['500']} />
        ) : (
          <ClipboardClockIcon
            width={16}
            height={16}
            color={colors.gray['500']}
          />
        )}
        <Text style={[styles.infoText, { color: colors.gray['500'] }]}>
          {request.appointment_type_display ||
            (isTelemedicine ? 'Телемедицина' : 'Обычный прием')}
        </Text>
      </View>

      {request.rejection_reason && (
        <Text style={styles.rejectionReason}>{request.rejection_reason}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 15,
    padding: 16,
    gap: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dateText: {
    fontSize: 13,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  doctorName: {
    fontSize: 16,
    fontWeight: '700',
    flexShrink: 1,
  },
  infoText: {
    fontSize: 14,
    fontWeight: '300',
    flexShrink: 1,
  },
  rejectionReason: {
    fontSize: 13,
    color: '#e25853',
    marginTop: 2,
  },
});
