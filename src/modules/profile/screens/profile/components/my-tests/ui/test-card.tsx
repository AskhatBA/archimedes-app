import { FC } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

import { useTheme } from '@/shared/theme';

export const TestCard: FC = () => {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.orange['50'] }]}>
      <Text style={[styles.name, { color: colors.orange['600'] }]}>
        Название анализа
      </Text>
      <TouchableOpacity
        style={[styles.openButton, { backgroundColor: colors.orange['600'] }]}
      >
        <Text style={[styles.openButtonLabel, { color: colors.white }]}>
          Открыть
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingVertical: 19,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 15,
  },
  name: {
    fontSize: 16,
    fontWeight: 600,
    lineHeight: 25,
  },
  openButton: {
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  openButtonLabel: {
    fontSize: 13,
    lineHeight: 25,
    fontWeight: 600,
  },
});
