import { FC } from 'react';
import { SafeAreaView, ScrollView, StyleSheet } from 'react-native';

import { UserWelcomeContainer } from '@/shared/components/user-welcome-container';
import { MainLayout } from '@/shared/layout/main-layout';

import { Insurance } from '../components/insurance';

export const ProfileScreen: FC = () => {
  return (
    <SafeAreaView style={styles.wrapper}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <MainLayout>
          <UserWelcomeContainer />
          <Insurance />
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
});
