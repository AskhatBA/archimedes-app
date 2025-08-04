import { FC } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';

import { FindSpecialistBanner } from '@/shared/components/find-specialist-banner';
import { UserWelcomeContainer } from '@/shared/components/user-welcome-container';
import { MainLayout } from '@/shared/layout/main-layout';

import { CurrentAppointments } from '../components/current-appointments';
import { SearchField } from '../components/search-field';

export const HomeScreen: FC = () => {
  return (
    <SafeAreaView style={styles.wrapper}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <MainLayout>
          <View style={styles.content}>
            <UserWelcomeContainer />
            <SearchField />
            <FindSpecialistBanner />
            <CurrentAppointments />
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
