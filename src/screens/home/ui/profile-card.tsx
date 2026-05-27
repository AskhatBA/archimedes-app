import dayjs from 'dayjs';
import { FC } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

import { useAppointments } from '@/modules/appointment/hooks/use-appointments';
import { useUser } from '@/modules/user';
import {
  ClipboardListIcon,
  SelectCaretIcon,
  ShieldPlusIcon,
  UserFilledIcon,
} from '@/shared/icons';
import { useAuth } from '@/shared/lib/auth';
import { useToast } from '@/shared/lib/toast';
import { routes, useNavigation } from '@/shared/navigation';
import { colors, fonts } from '@/shared/theme';

const formatAge = (years: number) => {
  const mod10 = years % 10;
  const mod100 = years % 100;
  if (mod10 === 1 && mod100 !== 11) return `${years} год`;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14))
    return `${years} года`;
  return `${years} лет`;
};

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
  const { loginIin } = useAuth();
  const { appointments } = useAppointments();
  const { navigate } = useNavigation();
  const { showToast } = useToast();

  const age = user?.birthDate ? dayjs().diff(user.birthDate, 'year') : null;
  const appointmentsCount = appointments?.length ?? 0;
  const appointmentsLabel = appointmentsCount
    ? `${appointmentsCount} ${appointmentsCount === 1 ? 'запись' : 'записи'}`
    : 'Нет записей';

  return (
    <View style={styles.container}>
      <View style={styles.avatarCircle}>
        <UserFilledIcon width={48} height={48} color={colors.primary} />
      </View>

      <TouchableOpacity
        style={styles.nameRow}
        onPress={() => navigate(routes.Profile)}
        accessibilityLabel="Открыть профиль"
      >
        <Text style={styles.name}>{user?.lastName || 'Профиль'}</Text>
        <ChevronRight color={colors.blue['500']} size={16} />
      </TouchableOpacity>

      <View style={styles.idPill}>
        <Text style={styles.idText}>
          {loginIin}
          {age !== null ? `  •  ${formatAge(age)}` : ''}
        </Text>
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
            <Text style={styles.statLabel}>Мои записи</Text>
          </View>
          <Text style={styles.statValue}>{appointmentsLabel}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.statCard}
          onPress={() => navigate(routes.Programs)}
        >
          <View style={styles.statHeader}>
            <ShieldPlusIcon width={18} height={18} color={colors.blue['400']} />
            <Text style={styles.statLabel}>Мои программы</Text>
          </View>
          <View style={styles.statValueRow}>
            <Text style={styles.statValue}>Открыть</Text>
            <ChevronRight />
          </View>
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
});
