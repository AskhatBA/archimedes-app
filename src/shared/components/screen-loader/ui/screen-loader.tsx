import { FC } from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';

import { SCREEN_WIDTH, SCREEN_HEIGHT } from '@/shared/constants';
import { colors } from '@/shared/theme';

interface ScreenLoaderProps {
  text?: string;
}

export const ScreenLoader: FC<ScreenLoaderProps> = ({ text }) => {
  return (
    <View
      style={[styles.container, { width: SCREEN_WIDTH, height: SCREEN_HEIGHT }]}
    >
      <ActivityIndicator color={colors.primary} size="large" />
      {text && <Text style={styles.text}>{text}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.backgroundMain,
  },
  text: {
    fontSize: 16,
    fontWeight: 600,
    color: colors.textMain,
    marginTop: 16,
  },
});
