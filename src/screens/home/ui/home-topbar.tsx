import { FC } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { MapPinnedIcon, SelectCaretIcon, UserFilledIcon } from '@/shared/icons';
import { routes, useNavigation } from '@/shared/navigation';
import { colors, fonts } from '@/shared/theme';

export const HomeTopbar: FC = () => {
  const insets = useSafeAreaInsets();
  const { navigate } = useNavigation();

  return (
    <View style={[styles.container, { paddingTop: insets.top + 6 }]}>
      <View style={styles.side} />

      <View style={styles.titleBlock}>
        <Text style={styles.title}>Мое здоровье</Text>
      </View>

      <TouchableOpacity
        style={styles.profileButton}
        onPress={() => navigate(routes.Profile)}
        accessibilityLabel="Открыть профиль"
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
  side: {
    width: 40,
  },
  titleBlock: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    lineHeight: 22,
    fontWeight: '700',
    fontFamily: fonts.SFPro.Bold,
    color: colors.textMain,
  },
  cityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  cityText: {
    fontSize: 13,
    lineHeight: 16,
    color: colors.gray['500'],
    fontFamily: fonts.SFPro.Medium,
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
