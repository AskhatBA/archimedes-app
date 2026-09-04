import { FC } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

import { useAppointments } from '@/modules/appointment/hooks/use-appointments';
import { levelColors, usePrograms } from '@/modules/insurance';
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

const TRAILING_PARENTHESES = /\s*\(([^()]*)\)\s*$/;

const getProgramTitle = (title?: string) => {
  const raw = (title ?? '').trim();
  return raw.replace(TRAILING_PARENTHESES, '').trim() || raw;
};

const getProgramCardNo = (title?: string, cardNo?: string) => {
  if (cardNo) return cardNo;
  return (title ?? '').trim().match(TRAILING_PARENTHESES)?.[1]?.trim() ?? '';
};

const byStartTime = (a: { start_time?: string }, b: { start_time?: string }) =>
  new Date(a.start_time ?? 0).getTime() - new Date(b.start_time ?? 0).getTime();

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

  const sortedAppointments = [...(appointments ?? [])].sort(byStartTime);
  const nextAppointment = sortedAppointments[0];
  const extraAppointmentsCount = Math.max(0, sortedAppointments.length - 1);
  const appointmentPlace =
    nextAppointment?.branch_name ||
    nextAppointment?.appointment_type_display ||
    '';

  const activePrograms = programs.filter(p => p.status !== 'EXPIRED');
  const activeProgram = activePrograms[0];
  const extraProgramsCount = Math.max(0, activePrograms.length - 1);
  const activeProgramTitle = getProgramTitle(activeProgram?.title);
  const activeProgramCardNo = getProgramCardNo(
    activeProgram?.title,
    activeProgram?.cardNo,
  );
  const programPalette =
    levelColors[activeProgramTitle as keyof typeof levelColors] ||
    levelColors.Standard;

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.userRow}
        activeOpacity={0.9}
        onPress={() => navigate(routes.Profile)}
        accessibilityLabel={t('home:openProfile')}
      >
        <View style={styles.avatarCircle}>
          <UserFilledIcon width={28} height={28} color={colors.primary} />
        </View>

        <View style={styles.userInfo}>
          <Text style={styles.name} numberOfLines={1} ellipsizeMode="tail">
            {user?.firstName || t('home:profileFallback')}
          </Text>
          {userIin ? (
            <View style={styles.idPill}>
              <Text style={styles.idText}>{userIin}</Text>
            </View>
          ) : null}
        </View>

        <ChevronRight color={colors.blue['500']} size={14} />
      </TouchableOpacity>

      <View style={styles.statsRow}>
        <TouchableOpacity
          activeOpacity={0.9}
          style={[
            styles.statCard,
            activeProgram && {
              backgroundColor: programPalette.background,
              borderColor: programPalette.button,
            },
          ]}
          onPress={() =>
            activeProgram
              ? navigate(routes.ProgramDetails, {
                  programId: activeProgram.id,
                })
              : navigate(routes.PaidPrograms)
          }
        >
          <View style={styles.cardHeader}>
            <ShieldPlusIcon
              width={18}
              height={18}
              color={activeProgram ? programPalette.text : colors.blue['400']}
            />
            <Text
              style={[
                styles.cardLabel,
                activeProgram && { color: programPalette.text },
              ]}
            >
              {t('home:myPrograms')}
            </Text>
            {extraProgramsCount > 0 ? (
              <View
                style={[
                  styles.cardBadge,
                  { backgroundColor: programPalette.button },
                ]}
              >
                <Text
                  style={[styles.cardBadgeText, { color: programPalette.text }]}
                >
                  +{extraProgramsCount}
                </Text>
              </View>
            ) : null}
          </View>

          {activeProgram ? (
            <View style={styles.cardBody}>
              <Text
                style={[styles.cardTitle, { color: programPalette.text }]}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {activeProgramTitle}
              </Text>

              {activeProgramCardNo ? (
                <Text
                  style={[styles.cardNoValue, { color: programPalette.text }]}
                  numberOfLines={1}
                  ellipsizeMode="middle"
                >
                  {activeProgramCardNo}
                </Text>
              ) : null}

              <View
                style={[
                  styles.cardDivider,
                  { backgroundColor: programPalette.button },
                ]}
              />

              <View style={styles.cardFooter}>
                <Text
                  style={[styles.cardMeta, { color: programPalette.text }]}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {t('home:programValidUntil', {
                    date: formatDate(activeProgram.dateEnd, 'DD.MM.YYYY'),
                  })}
                </Text>
                <TouchableOpacity
                  style={styles.showAllRow}
                  hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
                  onPress={() => navigate(routes.Programs)}
                >
                  <Text
                    style={[styles.showAllText, { color: programPalette.text }]}
                  >
                    {t('home:showAll')}
                  </Text>
                  <ChevronRight color={programPalette.text} size={12} />
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={styles.cardBody}>
              <Text style={styles.emptyValue}>
                {t('home:noActivePrograms')}
              </Text>
              <View style={styles.ctaRow}>
                <Text style={styles.ctaText}>{t('home:connectProgram')}</Text>
                <ChevronRight color={colors.green['600']} />
              </View>
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.9}
          style={[styles.statCard, styles.appointmentCard]}
          onPress={() =>
            navigate(
              nextAppointment
                ? routes.AppointmentsMain
                : routes.CreateAppointment,
            )
          }
        >
          <View style={styles.cardHeader}>
            <ClipboardListIcon
              width={18}
              height={18}
              color={colors.blue['400']}
            />
            <Text style={styles.cardLabel}>{t('home:myAppointments')}</Text>
            {extraAppointmentsCount > 0 ? (
              <View
                style={[
                  styles.cardBadge,
                  { backgroundColor: colors.blue['150'] },
                ]}
              >
                <Text
                  style={[styles.cardBadgeText, { color: colors.blue['500'] }]}
                >
                  +{extraAppointmentsCount}
                </Text>
              </View>
            ) : null}
          </View>

          {nextAppointment ? (
            <View style={styles.cardBody}>
              {nextAppointment.start_time ? (
                <Text
                  style={[styles.cardTitle, styles.appointmentDate]}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {formatDate(nextAppointment.start_time, 'D MMMM, HH:mm')}
                </Text>
              ) : null}

              {nextAppointment.doctor_name ? (
                <Text
                  style={styles.cardSubtitle}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {nextAppointment.doctor_name}
                </Text>
              ) : null}

              <View
                style={[
                  styles.cardDivider,
                  { backgroundColor: colors.blue['200'] },
                ]}
              />

              <View style={styles.cardFooter}>
                <Text
                  style={[styles.cardMeta, { color: colors.blue['500'] }]}
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
            <View style={styles.cardBody}>
              <Text style={styles.emptyValue}>{t('home:noAppointments')}</Text>
              <View style={styles.ctaRow}>
                <Text style={styles.ctaText}>{t('home:bookAppointment')}</Text>
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
    borderWidth: 1,
    borderColor: colors.blue['200'],
    padding: 14,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 2,
  },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 44,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.blue['150'],
  },
  userInfo: {
    flex: 1,
    gap: 2,
  },
  name: {
    fontSize: 17,
    lineHeight: 21,
    fontWeight: '700',
    fontFamily: fonts.SFPro.Bold,
    color: colors.blue['500'],
  },
  idPill: {
    alignSelf: 'flex-start',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.blue['200'],
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  idText: {
    fontSize: 12,
    lineHeight: 15,
    color: colors.blue['500'],
    fontFamily: fonts.SFPro.Semibold,
    fontWeight: '600',
    fontVariant: ['tabular-nums'],
  },
  statsRow: {
    gap: 10,
    marginTop: 12,
    width: '100%',
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'transparent',
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 8,
  },
  appointmentCard: {
    borderColor: colors.blue['200'],
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  cardLabel: {
    fontSize: 11,
    lineHeight: 16,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    opacity: 0.6,
    color: colors.blue['400'],
    fontFamily: fonts.SFPro.Semibold,
    fontWeight: '600',
  },
  cardBadge: {
    marginLeft: 'auto',
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  cardBadgeText: {
    fontSize: 11,
    lineHeight: 14,
    fontFamily: fonts.SFPro.Semibold,
    fontWeight: '600',
  },
  cardBody: {
    gap: 6,
  },
  cardTitle: {
    fontSize: 20,
    lineHeight: 24,
    color: colors.blue['500'],
    fontFamily: fonts.SFPro.Bold,
    fontWeight: '700',
  },
  appointmentDate: {
    textTransform: 'capitalize',
  },
  cardSubtitle: {
    fontSize: 14,
    lineHeight: 18,
    opacity: 0.75,
    color: colors.blue['500'],
    fontFamily: fonts.SFPro.Medium,
    fontWeight: '500',
  },
  cardNoValue: {
    fontSize: 14,
    lineHeight: 18,
    opacity: 0.75,
    fontFamily: fonts.SFPro.Medium,
    fontWeight: '500',
    fontVariant: ['tabular-nums'],
  },
  cardDivider: {
    height: 1,
    marginTop: 4,
    opacity: 0.7,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  showAllRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  showAllText: {
    fontSize: 12,
    lineHeight: 16,
    fontFamily: fonts.SFPro.Semibold,
    fontWeight: '600',
  },
  cardMeta: {
    flexShrink: 1,
    fontSize: 12,
    lineHeight: 16,
    opacity: 0.65,
    fontFamily: fonts.SFPro.Regular,
  },
  emptyValue: {
    fontSize: 15,
    lineHeight: 18,
    color: colors.blue['500'],
    fontFamily: fonts.SFPro.Semibold,
    fontWeight: '600',
  },
  ctaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  ctaText: {
    fontSize: 13,
    lineHeight: 16,
    color: colors.green['600'],
    fontFamily: fonts.SFPro.Semibold,
    fontWeight: '600',
  },
});
