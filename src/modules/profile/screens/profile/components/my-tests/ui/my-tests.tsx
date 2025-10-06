import { FC } from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { globalStyles } from '@/shared/theme';

import { HistoryCard } from '../../history-card';

export const MyTests: FC = () => {
  return (
    <View style={styles.container}>
      <Text style={globalStyles.sectionHeading}>Мои анализы</Text>
      <View style={styles.tests}>
        <HistoryCard color="orange" name="12/09 - ОАК" />
        <HistoryCard color="orange" name="12/09 - Анализ мочи" />
        <HistoryCard color="orange" name="12/09 - Глубинный анализ" />
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
