import { FC } from 'react';
import { View } from 'react-native';

import { History } from '../components/history';

export const CompensationsHistoryScreen: FC = () => {
  return (
    <View style={{ paddingHorizontal: 24 }}>
      <History />
    </View>
  );
};
