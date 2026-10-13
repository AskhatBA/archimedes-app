import { FC } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

import { useUser } from '@/modules/user';
import { UserFilledIcon } from '@/shared/icons';
import { useTranslation } from '@/shared/lib/i18n';
import { routes, useNavigation } from '@/shared/navigation';
import { colors, fonts } from '@/shared/theme';

import { ChevronRight } from './home-stat-card';

export const ProfileCard: FC = () => {
  const { user } = useUser();
  const { navigate } = useNavigation();
  const { t } = useTranslation();

  const userIin = (user as unknown as { iin: string })?.iin;

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.9}
      onPress={() => navigate(routes.Profile)}
      accessibilityRole="button"
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
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.blue['100'],
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.blue['200'],
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  avatarCircle: {
    width: 48,
    height: 48,
    borderRadius: 48,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.blue['150'],
  },
  userInfo: {
    flex: 1,
    gap: 4,
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
});
