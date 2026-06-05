import { FC } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

import { useAppointments } from '@/modules/appointment/hooks/use-appointments';
import { usePrograms } from '@/modules/insurance';
import { useUser } from '@/modules/user';
import {
  ClipboardListIcon,
  SelectCaretIcon,
  ShieldPlusIcon,
  UserFilledIcon,
} from '@/shared/icons';
import { formatDate } from '@/shared/lib/date';
import { useTranslation } from '@/shared/lib/i18n';
import { routes, useNavigation } from '@/shared/navigation';
import { colors, fonts } from '@/shared/theme';

const ChevronRight: FC<{ color?: string; size?: number }> = ({
  color = colors.blue['400'],
  size = 14,
}) => (
  <View style={{ transform: [{ rotate: '-90deg' }] }}>
    <SelectCaretIcon width={size} height={size} color={color} />
  </View>
);

export const ProfileCard: FC = () => {
  const { user } = useUser();
  const { appointments } = useAppointments();
  const { programs } = usePrograms();
  const { navigate } = useNavigation();
  const { t } = useTranslation();

  const userIin = (user as unknown as { iin: string })?.iin;
  const appointmentsCount = appointments?.length ?? 0;
  const singleAppointment =
    appointmentsCount === 1 ? appointments?.[0] : undefined;

  const activePrograms = programs.filter(p => p.status !== 'EXPIRED');
  const activeProgram = activePrograms[0];
  const extraProgramsCount = Math.max(0, activePrograms.length - 1);

  return (
    <View style={styles.container}>
      <View style={styles.avatarCircle}>
        <UserFilledIcon width={48} height={48} color={colors.primary} />
      </View>

      <TouchableOpacity
        style={styles.nameRow}
        onPress={() => navigate(routes.Profile)}
        accessibilityLabel={t('home:openProfile')}
      >
        <Text style={styles.name}>
          {user?.lastName || t('home:profileFallback')}
        </Text>
        <ChevronRight color={colors.blue['500']} size={16} />
      </TouchableOpacity>

      <View style={styles.idPill}>
        <Text style={styles.idText}>{userIin}</Text>
      </View>

      <View style={styles.statsRow}>
        <TouchableOpacity
          style={styles.statCard}
          onPress={() => navigate(routes.AppointmentsMain)}
        >
          <View style={styles.statHeader}>
            <ClipboardListIcon
              width={18}
              height={18}
              color={colors.blue['400']}
            />
            <Text style={styles.statLabel}>{t('home:myAppointments')}</Text>
          </View>
          {singleAppointment ? (
            <View style={styles.appointmentPreview}>
              {singleAppointment.start_time ? (
                <Text style={styles.appointmentDate}>
                  {formatDate(singleAppointment.start_time, 'D MMMM, HH:mm')}
                </Text>
              ) : null}
              {singleAppointment.doctor_name ? (
                <Text
                  style={styles.appointmentDoctor}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {singleAppointment.doctor_name}
                </Text>
              ) : null}
            </View>
          ) : (
            <Text style={styles.statValue}>
              {appointmentsCount === 0
                ? t('home:noAppointments')
                : t('home:appointmentsCount', { count: appointmentsCount })}
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.statCard}
          onPress={() => navigate(routes.Programs)}
        >
          <View style={styles.statHeader}>
            <ShieldPlusIcon width={18} height={18} color={colors.blue['400']} />
            <Text style={styles.statLabel}>{t('home:myPrograms')}</Text>
          </View>
          {activeProgram ? (
            <View style={styles.programPreview}>
              <Text
                style={styles.programTitle}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {activeProgram.title}
              </Text>
              <Text
                style={styles.programMeta}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {extraProgramsCount > 0
                  ? t('home:extraPrograms', { count: extraProgramsCount })
                  : t('home:programValidUntil', {
                      date: formatDate(activeProgram.dateEnd, 'DD.MM.YYYY'),
                    })}
              </Text>
            </View>
          ) : (
            <View style={styles.programPreview}>
              <Text style={styles.statValue}>{t('home:noActivePrograms')}</Text>
              <View style={styles.programCtaRow}>
                <Text style={styles.programCta}>
                  {t('home:connectProgram')}
                </Text>
                <ChevronRight color={colors.green['600']} />
              </View>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.blue['100'],
    borderRadius: 24,
    paddingTop: 22,
    paddingBottom: 16,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  avatarCircle: {
    width: 96,
    height: 96,
    borderRadius: 96,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: colors.blue['150'],
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 14,
  },
  name: {
    fontSize: 22,
    lineHeight: 26,
    fontWeight: '700',
    fontFamily: fonts.SFPro.Bold,
    color: colors.blue['500'],
  },
  idPill: {
    marginTop: 10,
    backgroundColor: colors.white,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  idText: {
    fontSize: 13,
    lineHeight: 18,
    color: colors.blue['400'],
    fontFamily: fonts.SFPro.Medium,
    fontWeight: '500',
  },
  statsRow: {
    gap: 10,
    marginTop: 18,
    width: '100%',
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 8,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statLabel: {
    fontSize: 13,
    lineHeight: 16,
    color: colors.blue['400'],
    fontFamily: fonts.SFPro.Medium,
    fontWeight: '500',
  },
  statValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statValue: {
    fontSize: 15,
    lineHeight: 18,
    color: colors.blue['500'],
    fontFamily: fonts.SFPro.Semibold,
    fontWeight: '600',
  },
  appointmentPreview: {
    gap: 2,
  },
  appointmentDate: {
    fontSize: 15,
    lineHeight: 18,
    color: colors.blue['500'],
    fontFamily: fonts.SFPro.Semibold,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  appointmentDoctor: {
    fontSize: 12,
    lineHeight: 16,
    color: colors.blue['400'],
    fontFamily: fonts.SFPro.Regular,
  },
  programPreview: {
    gap: 2,
  },
  programTitle: {
    fontSize: 15,
    lineHeight: 18,
    color: colors.blue['500'],
    fontFamily: fonts.SFPro.Semibold,
    fontWeight: '600',
  },
  programMeta: {
    fontSize: 12,
    lineHeight: 16,
    color: colors.blue['400'],
    fontFamily: fonts.SFPro.Regular,
  },
  programCtaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  programCta: {
    fontSize: 13,
    lineHeight: 16,
    color: colors.green['600'],
    fontFamily: fonts.SFPro.Semibold,
    fontWeight: '600',
  },
});
