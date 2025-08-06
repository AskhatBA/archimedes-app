import { FC } from 'react';
import { View, SafeAreaView, StyleSheet, ScrollView } from 'react-native';

import { MainLayout } from '@/shared/layout/main-layout';

import { NotificationStack } from '../components/notification-stack';
import { Topbar } from '../components/topbar';
import { notifications } from '../data';

export const NotificationsScreen: FC = () => {
  return (
    <SafeAreaView style={styles.wrapper}>
      <ScrollView>
        <MainLayout>
          <View>
            <Topbar />
            <NotificationStack notifications={notifications} />
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
