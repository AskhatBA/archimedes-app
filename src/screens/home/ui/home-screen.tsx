import { FC } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { FindSpecialistBanner } from '@/shared/components/find-specialist-banner';
import { GreetUser } from '@/shared/components/greet-user';
import { MainLayout } from '@/shared/layout/main-layout';

import { CurrentAppointments } from './current-appointments';
import { SearchField } from './search-field';

export const HomeScreen: FC = () => {
  return (
    <ScrollView>
      <MainLayout>
        <View style={styles.content}>
          <GreetUser />
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
