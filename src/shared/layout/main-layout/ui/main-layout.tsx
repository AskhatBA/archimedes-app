import { FC, ReactNode } from 'react';
import { View, StyleSheet } from 'react-native';

interface MainLayoutProps {
  children: ReactNode;
}

export const MainLayout: FC<MainLayoutProps> = ({ children }) => {
  return <View style={styles.container}>{children}</View>;
};

const styles = StyleSheet.create({
  container: {
    padding: 32,
    flex: 1,
  },
});
