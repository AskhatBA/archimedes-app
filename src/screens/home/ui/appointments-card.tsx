import { FC } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { useAppointments } from '@/modules/appointment/hooks/use-appointments';
import { ClipboardListIcon } from '@/shared/icons';
import { formatDate } from '@/shared/lib/date';
import { useTranslation } from '@/shared/lib/i18n';
import { routes, useNavigation } from '@/shared/navigation';
import { colors } from '@/shared/theme';

import { ChevronRight, statCardStyles as card } from './home-stat-card';

const byStartTime = (a: { start_time?: string }, b: { start_time?: string }) =>
  new Date(a.start_time ?? 0).getTime() - new Date(b.start_time ?? 0).getTime();

export const AppointmentsCard: FC = () => {
  const { appointments } = useAppointments();
  const { navigate } = useNavigation();
  const { t } = useTranslation();

  const sortedAppointments = [...(appointments ?? [])].sort(byStartTime);
  const nextAppointment = sortedAppointments[0];
  const extraAppointmentsCount = Math.max(0, sortedAppointments.length - 1);
  const appointmentPlace =
    nextAppointment?.branch_name ||
    nextAppointment?.appointment_type_display ||
    '';

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      style={card.card}
      onPress={() =>
        navigate(
          nextAppointment ? routes.AppointmentsMain : routes.CreateAppointment,
        )
      }
    >
      <View style={card.header}>
        <ClipboardListIcon width={18} height={18} color={colors.blue['400']} />
        <Text style={card.label}>{t('home:myAppointments')}</Text>
        {extraAppointmentsCount > 0 ? (
          <View style={[card.badge, { backgroundColor: colors.blue['150'] }]}>
            <Text style={[card.badgeText, { color: colors.blue['500'] }]}>
              +{extraAppointmentsCount}
            </Text>
          </View>
        ) : null}
      </View>

      {nextAppointment ? (
        <View style={card.body}>
          {nextAppointment.start_time ? (
            <Text
              style={[card.title, styles.date]}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {formatDate(nextAppointment.start_time, 'D MMMM, HH:mm')}
            </Text>
          ) : null}

          {nextAppointment.doctor_name ? (
            <Text style={card.subtitle} numberOfLines={1} ellipsizeMode="tail">
              {nextAppointment.doctor_name}
            </Text>
          ) : null}

          <View
            style={[card.divider, { backgroundColor: colors.blue['200'] }]}
          />

          <View style={card.footer}>
            <Text
              style={[card.meta, { color: colors.blue['500'] }]}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {appointmentPlace ||
                t('home:appointmentsCount', {
                  count: sortedAppointments.length,
                })}
            </Text>
            <ChevronRight color={colors.blue['400']} size={12} />
          </View>
        </View>
      ) : (
        <View style={card.body}>
          <Text style={card.emptyValue}>{t('home:noAppointments')}</Text>
          <View style={card.ctaRow}>
            <Text style={card.ctaText}>{t('home:bookAppointment')}</Text>
            <ChevronRight color={colors.green['600']} />
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  date: {
    textTransform: 'capitalize',
  },
});
