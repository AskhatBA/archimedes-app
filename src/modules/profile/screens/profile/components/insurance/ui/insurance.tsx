import { FC } from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { globalStyles } from '@/shared/theme';

import { InsuranceCard } from './insurance-card';

export const Insurance: FC = () => {
  return (
    <View style={styles.container}>
      <Text style={globalStyles.sectionHeading}>Страховка</Text>
      <View style={styles.cards}>
        <InsuranceCard />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  cards: {
    marginTop: 20,
  },
});
