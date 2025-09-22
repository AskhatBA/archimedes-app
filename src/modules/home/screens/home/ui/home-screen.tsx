import { FC } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { FindSpecialistBanner } from '@/shared/components/find-specialist-banner';
import { UserWelcomeContainer } from '@/shared/components/user-welcome-container';
import { MainLayout } from '@/shared/layout/main-layout';

import { CurrentAppointments } from '../components/current-appointments';
import { SearchField } from '../components/search-field';

export const HomeScreen: FC = () => {
  return (
    <ScrollView>
      <MainLayout>
        <View style={styles.content}>
          <UserWelcomeContainer />
          <SearchField />
          <FindSpecialistBanner />
          <CurrentAppointments />
        </View>
      </MainLayout>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  content: {
    flex: 1,
    gap: 24,
  },
});
