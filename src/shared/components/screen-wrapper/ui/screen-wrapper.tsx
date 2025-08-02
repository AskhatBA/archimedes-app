import { FC, ReactNode } from 'react';
import { SafeAreaView } from 'react-native';

export const ScreenWrapper: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <SafeAreaView style={{ backgroundColor: '#000000', flex: 1 }}>
      {children}
    </SafeAreaView>
  );
};
