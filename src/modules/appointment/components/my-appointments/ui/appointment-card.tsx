import { useMutation, useQueryClient } from '@tanstack/react-query';
import { FC } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActionSheetIOS,
  Alert,
  Platform,
} from 'react-native';

import { misApi } from '@/api';
import {
  ThreeDotsIcon,
  ClipboardClockIcon,
  VideoIcon,
  StethoscopeIcon,
  HospitalIcon,
  MapPinnedIcon,
} from '@/shared/icons';
import { getTimeOfDay, formatDate } from '@/shared/lib/date';
import { useToast } from '@/shared/lib/toast';
import { routes, useNavigation } from '@/shared/navigation';
import { useTheme } from '@/shared/theme';

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
  const queryClient = useQueryClient();
  const { navigate } = useNavigation();
  const { showToast } = useToast();

  const cancelAppointmentMutation = useMutation({
    mutationFn: () => misApi.appointmentsDelete(appointmentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments-history'] });
      showToast({ type: 'success', message: 'Запись успешно отменена' });
    },
    onError: () => {
      showToast({
        type: 'error',
        message: 'Не удалось отменить запись. Попробуйте снова',
      });
    },
  });

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

  const onCancelAppointment = () => {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['Отменить запись', 'Отмена'],
          destructiveButtonIndex: 0,
        },
        buttonIndex => {
          if (buttonIndex === 0) {
            cancelAppointmentMutation.mutate();
          }
        },
      );
    } else {
      Alert.alert('Отменить запись', 'Вы уверены?', [
        {
          text: 'Отмена',
          style: 'cancel',
        },
        {
          text: 'Отменить запись',
          style: 'destructive',
          onPress: () => cancelAppointmentMutation.mutate(),
        },
      ]);
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
          onPress={onCancelAppointment}
        >
          <ThreeDotsIcon color={moreButtonColor[color]} />
        </TouchableOpacity>
      )}
      {isPast && (
        <View style={styles.pastLabel}>
          <Text style={styles.pastLabelText}>Завершена</Text>
        </View>
      )}
      <View style={{ flex: 1 }}>
        <View style={styles.dateContainer}>
          <Text style={[styles.timeOfDay, { color: fontColor[color] }]}>
            {getTimeOfDay(date)}
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
              {isTelemedicine ? 'Онлайн' : branchAddress}
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
            {isTelemedicine ? 'Телемедицина' : 'Обычный прием'}
          </Text>
        </View>
      </View>
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
