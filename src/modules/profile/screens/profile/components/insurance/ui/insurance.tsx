import { FC } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';

import { usePrograms } from '@/shared/lib/insurance';
import { globalStyles, useTheme } from '@/shared/theme';

import { InsuranceCard } from './insurance-card';

export const Insurance: FC = () => {
  const { colors } = useTheme();
  const { programs, loadingPrograms } = usePrograms();

  if (loadingPrograms) {
    return <ActivityIndicator color={colors.primary} />;
  }

  return (
    <View style={styles.container}>
      <Text style={globalStyles.sectionHeading}>Страховка</Text>
      <View style={styles.cards}>
        {programs?.map(program => {
          if (program.status === 'EXPIRED') return null;

          return (
            <InsuranceCard
              key={program.id}
              programId={program.id}
              price={150000}
              level={program.title}
            />
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  cards: {
    marginTop: 20,
    gap: 16,
  },
});
