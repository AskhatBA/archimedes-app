import { FC } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

import { useTheme } from '@/shared/theme';

interface HistoryCardProps {
  name: string;
  color: 'orange' | 'blue';
}

export const HistoryCard: FC<HistoryCardProps> = ({ name, color }) => {
  const { colors } = useTheme();

  const background = {
    orange: colors.orange['50'],
    blue: colors.blue['100'],
  };

  const secondary = {
    orange: colors.orange['600'],
    blue: colors.primary,
  };

  return (
    <View style={[styles.container, { backgroundColor: background[color] }]}>
      <Text
        numberOfLines={1}
        style={[styles.name, { color: secondary[color] }]}
      >
        {name}
      </Text>
      <TouchableOpacity
        style={[styles.openButton, { backgroundColor: secondary[color] }]}
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
    flex: 1,
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
