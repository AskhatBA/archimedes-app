import { FC } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { News } from '@/modules/insurance';
import { FindSpecialistBanner } from '@/shared/components/find-specialist-banner';
import { MainLayout } from '@/shared/layout/main-layout';

import { CurrentAppointments } from './current-appointments';
import { SearchField } from './search-field';

export const HomeScreen: FC = () => {
  return (
    <ScrollView>
      <MainLayout>
        <View style={styles.content}>
          <SearchField />
          <FindSpecialistBanner />
          <CurrentAppointments />
          <News />
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
