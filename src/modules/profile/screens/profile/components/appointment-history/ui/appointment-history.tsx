import { FC } from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { globalStyles } from '@/shared/theme';

import { HistoryCard } from '../../history-card';

export const AppointmentHistory: FC = () => {
  return (
    <View style={styles.container}>
      <Text style={globalStyles.sectionHeading}>История обращений</Text>
      <View style={styles.tests}>
        <HistoryCard color="blue" name="12/09 - Терапевт" />
        <HistoryCard color="blue" name="15/09 - Оториноларин..." />
        <HistoryCard color="blue" name="30/10 - Терапевт" />
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
