import { useMutation, useQueryClient } from '@tanstack/react-query';
import { FC } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActionSheetIOS,
} from 'react-native';

import { misApi } from '@/api';
import { ThreeDotsIcon } from '@/shared/icons';
import { getTimeOfDay, formatDate } from '@/shared/lib/date';
import { routes, useNavigation } from '@/shared/navigation';
import { useTheme } from '@/shared/theme';

export type AppointmentCardColors = 'blue' | 'green' | 'orange';

interface AppointmentCardProps {
  color?: AppointmentCardColors;
  doctorName: string;
  specialization: string;
  date: string;
  appointmentId: string;
}

export const AppointmentCard: FC<AppointmentCardProps> = ({
  color = 'blue',
  doctorName,
  specialization,
  date,
  appointmentId,
}) => {
  const { colors } = useTheme();
  const queryClient = useQueryClient();
  const { navigate } = useNavigation();

  const cancelAppointmentMutation = useMutation({
    mutationFn: () => misApi.appointmentsDelete(appointmentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
  });

  const backgrounds = {
    blue: colors.blue['100'],
    orange: colors.orange['200'],
    green: colors.green['100'],
  };

  const squareColor = {
    blue: colors.blue['150'],
    orange: colors.orange['300'],
    green: colors.green['300'],
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

  return (
    <TouchableOpacity
      onPress={() => navigate(routes.AppointmentDetails, { appointmentId })}
      style={[styles.container, { backgroundColor: backgrounds[color] }]}
    >
      <TouchableOpacity
        style={styles.moreButton}
        onPress={() => {
          ActionSheetIOS.showActionSheetWithOptions(
            {
              options: ['Отменить бронь', 'Отмена'],
              cancelButtonIndex: 1,
              destructiveButtonIndex: 0,
            },
            buttonIndex => {
              if (buttonIndex === 0) {
                cancelAppointmentMutation.mutate();
              }
            },
          );
        }}
      >
        <ThreeDotsIcon color={moreButtonColor[color]} />
      </TouchableOpacity>
      <View style={[styles.square, { backgroundColor: squareColor[color] }]} />
      <View style={{ flex: 1 }}>
        <View style={styles.dateContainer}>
          <Text style={[styles.timeOfDay, { color: fontColor[color] }]}>
            {getTimeOfDay(date)}
          </Text>
          <Text style={[styles.time, { color: fontColor[color] }]}>
            {formatDate(date, 'HH:mm')}
          </Text>
        </View>
        <Text style={[styles.doctorName, { color: fontColor[color] }]}>
          {doctorName}
        </Text>
        <Text style={[styles.specializationName, { color: fontColor[color] }]}>
          {specialization}
        </Text>
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
    marginTop: 8,
  },
  specializationName: {
    fontSize: 14,
    fontWeight: 300,
    marginTop: 4,
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
});
