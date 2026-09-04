import { FC } from 'react';
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { UserFilledIcon } from '@/shared/icons';
import { useTranslation } from '@/shared/lib/i18n';
import { routes, useNavigation } from '@/shared/navigation';
import { colors } from '@/shared/theme';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const logoImage = require('@/assets/images/main-logo.png');

export const HomeTopbar: FC = () => {
  const insets = useSafeAreaInsets();
  const { navigate } = useNavigation();
  const { t } = useTranslation();

  return (
    <View style={[styles.container, { paddingTop: insets.top + 6 }]}>
      <View style={styles.titleBlock}>
        <Image source={logoImage} style={styles.logo} resizeMode="contain" />
      </View>

      <TouchableOpacity
        style={styles.profileButton}
        onPress={() => navigate(routes.Profile)}
        accessibilityLabel={t('home:openProfile')}
      >
        <View style={styles.avatarThumb}>
          <UserFilledIcon width={18} height={18} color={colors.primary} />
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 12,
    backgroundColor: colors.backgroundMain,
  },
  titleBlock: {
    flex: 1,
    alignItems: 'flex-start',
  },
  logo: {
    width: 77,
    height: 32,
  },
  profileButton: {
    width: 40,
    alignItems: 'flex-end',
  },
  avatarThumb: {
    width: 32,
    height: 32,
    borderRadius: 36,
    backgroundColor: colors.blue['100'],
    alignItems: 'center',
    justifyContent: 'center',
  },
});
