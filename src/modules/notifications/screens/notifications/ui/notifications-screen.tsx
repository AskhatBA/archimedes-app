import { FC } from 'react';
import { View, Text, SafeAreaView, StyleSheet, ScrollView } from 'react-native';

import { MainLayout } from '@/shared/layout/main-layout';

export const NotificationsScreen: FC = () => {
  return (
    <SafeAreaView style={styles.wrapper}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <MainLayout>
          <View>
            <Text>Notifications</Text>
          </View>
        </MainLayout>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
  },
  content: {
    flex: 1,
    gap: 24,
  },
});
