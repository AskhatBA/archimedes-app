import { FC } from 'react';
import { View, Image, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useUnreadCount } from '@/modules/notifications';
import { useUser } from '@/modules/user';
import { TabBarNotificationsIcon, UserFilledIcon } from '@/shared/icons';
import { useTranslation } from '@/shared/lib/i18n';
import { routes, useNavigation } from '@/shared/navigation';
import { colors, fonts } from '@/shared/theme';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const logoImage = require('@/assets/images/main-logo.png');

const HIT_SLOP = { top: 6, bottom: 6, left: 6, right: 6 };

interface HomeTopbarProps {
  /** Draws the hairline under the bar once the content has scrolled beneath it. */
  scrolled?: boolean;
}

export const HomeTopbar: FC<HomeTopbarProps> = ({ scrolled = false }) => {
  const insets = useSafeAreaInsets();
  const { navigate } = useNavigation();
  const { t } = useTranslation();
  const { user } = useUser();
  const { unreadCount = 0 } = useUnreadCount();

  const initial = user?.firstName?.trim().charAt(0).toUpperCase();

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top + 8 },
        scrolled && styles.containerScrolled,
      ]}
    >
      <Image source={logoImage} style={styles.logo} resizeMode="contain" />

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.iconButton}
          activeOpacity={0.7}
          hitSlop={HIT_SLOP}
          onPress={() => navigate(routes.Notifications)}
          accessibilityRole="button"
          accessibilityLabel={t('home:openNotifications')}
        >
          <TabBarNotificationsIcon
            width={22}
            height={22}
            color={colors.primary}
          />
          {unreadCount > 0 ? (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {unreadCount > 99 ? '99+' : unreadCount}
              </Text>
            </View>
          ) : null}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.iconButton, styles.avatarButton]}
          activeOpacity={0.7}
          hitSlop={HIT_SLOP}
          onPress={() => navigate(routes.Profile)}
          accessibilityRole="button"
          accessibilityLabel={t('home:openProfile')}
        >
          {initial ? (
            <Text style={styles.avatarText}>{initial}</Text>
          ) : (
            <UserFilledIcon width={20} height={20} color={colors.white} />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 10,
    backgroundColor: colors.backgroundMain,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'transparent',
  },
  containerScrolled: {
    borderBottomColor: colors.blue['200'],
  },
  logo: {
    width: 86,
    height: 36,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.blue['100'],
    borderWidth: 1,
    borderColor: colors.blue['200'],
  },
  avatarButton: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  avatarText: {
    fontSize: 16,
    lineHeight: 20,
    color: colors.white,
    fontFamily: fonts.SFPro.Bold,
    fontWeight: '700',
  },
  badge: {
    position: 'absolute',
    top: -3,
    right: -4,
    minWidth: 18,
    height: 18,
    paddingHorizontal: 4,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.red['500'],
    borderWidth: 2,
    borderColor: colors.backgroundMain,
  },
  badgeText: {
    fontSize: 10,
    lineHeight: 12,
    color: colors.white,
    fontFamily: fonts.SFPro.Bold,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
});
