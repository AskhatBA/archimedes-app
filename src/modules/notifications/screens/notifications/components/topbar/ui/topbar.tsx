import { FC } from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { useTheme } from '@/shared/theme';

export const Topbar: FC = () => {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <Text style={[styles.dateText, { color: colors.gray['600'] }]}>
        Вторник, 10 июня
      </Text>
      <Text style={[styles.title, { color: colors.gray['600'] }]}>
        Уведомления
      </Text>
      <View style={[styles.badge, { backgroundColor: colors.primary }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: 'flex-start',
  },
  dateText: {
    fontSize: 16,
    fontWeight: 300,
    lineHeight: 22,
  },
  title: {
    fontSize: 24,
    fontWeight: 700,
  },
  badge: {
    position: 'absolute',
    right: -16,
    top: 28,
    width: 8,
    height: 8,
    borderRadius: 8,
  },
});
