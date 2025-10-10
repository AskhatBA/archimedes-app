import { FC } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors } from '@/shared/theme';

export const StatusBarUnderlay: FC = () => {
  const insets = useSafeAreaInsets();

  return <View style={{ height: insets.top, backgroundColor: colors.white }} />;
};
