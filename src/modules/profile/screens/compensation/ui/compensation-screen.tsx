import { FC } from 'react';
import { Text, StyleSheet, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '@/shared/theme';

import { CompensationRequestForm } from '../forms/compensation-request-form';

export const CompensationScreen: FC = () => {
  const { colors } = useTheme();
  const deviceInsets = useSafeAreaInsets();

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        { paddingBottom: deviceInsets.bottom + 32 },
      ]}
    >
      <Text style={[styles.heading, { color: colors.primary }]}>
        Заявка на возмещение
      </Text>
      <CompensationRequestForm />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    gap: 32,
  },
  heading: {
    fontSize: 24,
    fontWeight: 700,
  },
});
