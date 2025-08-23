import { FC } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

import { SCREEN_WIDTH, SCREEN_HEIGHT } from '@/shared/constants';
import { colors } from '@/shared/theme';

export const ScreenLoader: FC = () => {
  return (
    <View
      style={[styles.container, { width: SCREEN_WIDTH, height: SCREEN_HEIGHT }]}
    >
      <ActivityIndicator color={colors.primary} size="large" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.backgroundMain,
  },
});
