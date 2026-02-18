import { FC, ReactNode } from 'react';
import { View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface MainLayoutProps {
  children: ReactNode;
}

export const MainLayout: FC<MainLayoutProps> = ({ children }) => {
  const deviceInsets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: 16,
          paddingBottom: deviceInsets.bottom + 16,
        },
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    flex: 1,
  },
});
