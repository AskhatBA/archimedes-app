import { FC } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';

import { UserWelcomeContainer } from '@/shared/components/user-welcome-container';
import { MainLayout } from '@/shared/layout/main-layout';

import { BannerSection } from '../components/banner-section';
import { CurrentAppointments } from '../components/current-appointments';
import { SearchField } from '../components/search-field';

export const HomeScreen: FC = () => {
  return (
    <SafeAreaView style={styles.wrapper}>
      <MainLayout>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.content}>
            <UserWelcomeContainer />
            <SearchField />
            <BannerSection />
            <CurrentAppointments />
          </View>
        </ScrollView>
      </MainLayout>
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
