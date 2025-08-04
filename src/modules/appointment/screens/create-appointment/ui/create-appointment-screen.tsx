import { FC } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text } from 'react-native';

import { FindSpecialistBanner } from '@/shared/components/find-specialist-banner';
import { MainLayout } from '@/shared/layout/main-layout';
import { useTheme } from '@/shared/theme';

import { ChooseBranch } from '../components/choose-branch';

export const CreateAppointmentScreen: FC = () => {
  const { colors } = useTheme();

  return (
    <SafeAreaView style={styles.wrapper}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <MainLayout>
          <FindSpecialistBanner />
          <Text style={[styles.title, { color: colors.textMain }]}>
            Запись на прием
          </Text>
          <ChooseBranch />
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
  title: {
    marginTop: 40,
    fontSize: 24,
    lineHeight: 22,
    fontWeight: 700,
    letterSpacing: 0,
  },
});
