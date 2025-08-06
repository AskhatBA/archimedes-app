import { FC } from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { globalStyles } from '@/shared/theme';

import { TestCard } from './test-card';

export const MyTests: FC = () => {
  return (
    <View style={styles.container}>
      <Text style={globalStyles.sectionHeading}>Мои анализы</Text>
      <View style={styles.tests}>
        <TestCard />
        <TestCard />
        <TestCard />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  tests: {
    marginTop: 20,
    gap: 7,
  },
});
