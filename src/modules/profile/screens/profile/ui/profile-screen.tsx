import { FC } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';

import { UserWelcomeContainer } from '@/shared/components/user-welcome-container';
import { MainLayout } from '@/shared/layout/main-layout';

import { Insurance } from '../components/insurance';
import { MyTests } from '../components/my-tests';

export const ProfileScreen: FC = () => {
  return (
    <SafeAreaView style={styles.wrapper}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <MainLayout>
          <UserWelcomeContainer />
          <View style={styles.main}>
            <Insurance />
            <MyTests />
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
  main: {
    marginTop: 48,
    gap: 32,
  },
});
