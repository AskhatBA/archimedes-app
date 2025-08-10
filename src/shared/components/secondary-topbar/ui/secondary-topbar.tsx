import { FC } from 'react';
import { TouchableOpacity, View, StyleSheet, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ArrowBackIcon } from '@/shared/icons';
import { useNavigation } from '@/shared/navigation';
import { useTheme } from '@/shared/theme';

interface SecondaryTopbarProps {
  title: string;
}

export const SecondaryTopbar: FC<SecondaryTopbarProps> = ({ title }) => {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const { goBack } = useNavigation();

  return (
    <View style={[styles.container, { paddingTop: insets.top + 16 }]}>
      <TouchableOpacity style={styles.backButton} onPress={goBack}>
        <ArrowBackIcon width={18} height={18} color={colors.primary} />
        <Text style={[styles.backButtonLabel, { color: colors.blue['400'] }]}>
          Назад
        </Text>
      </TouchableOpacity>
      <Text
        numberOfLines={1}
        style={[styles.title, { color: colors.textMain }]}
      >
        {title}
      </Text>
      <View style={{ flex: 1 }} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  backButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  backButtonLabel: {
    fontSize: 14,
    fontWeight: 500,
  },
  title: {
    fontWeight: 600,
    fontSize: 18,
    lineHeight: 22,
  },
});
