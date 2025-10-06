import { FC } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import ArrowBackIcon from '@/assets/icons/arrow-back.svg';
import ThreeDotsIcon from '@/assets/icons/three-dots.svg';
import TwitchIcon from '@/assets/icons/twitch.svg';
import { useNavigation } from '@/shared/navigation';
import { useTheme } from '@/shared/theme';

export const MedBotTopbar: FC = () => {
  const { colors } = useTheme();
  const { goBack } = useNavigation();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top + 8 }]}>
      <TouchableOpacity onPress={goBack}>
        <ArrowBackIcon color={colors.gray['250']} width={24} height={24} />
      </TouchableOpacity>
      <View style={styles.centerContainer}>
        <View style={[styles.centerIcon, { backgroundColor: colors.primary }]}>
          <TwitchIcon />
        </View>
        <Text style={[styles.title, { color: colors.textMain }]}>Мед Бот</Text>
      </View>
      <TouchableOpacity>
        <ThreeDotsIcon color={colors.gray['250']} width={24} height={24} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 28,
    paddingBottom: 8,
  },
  centerIcon: {
    width: 44,
    height: 44,
    borderRadius: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontWeight: 600,
    fontSize: 18,
    marginTop: 12,
  },
  centerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
