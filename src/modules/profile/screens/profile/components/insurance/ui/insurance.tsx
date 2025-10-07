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

  const renderInsuranceDetails = () => {
    if (!programs || programs?.length === 0) {
      return (
        <Text style={[styles.noInsuranceText, { color: colors.gray['500'] }]}>
          Нет активных страховок
        </Text>
      );
    }

    return programs.map(program => {
      if (program.status === 'EXPIRED') return null;

      return (
        <InsuranceCard
          key={program.id}
          programId={program.id}
          price={program.cardNo}
          level={program.title}
        />
      );
    });
  };

  return (
    <View style={styles.container}>
      <Text style={globalStyles.sectionHeading}>Страховка</Text>
      <View style={styles.cards}>{renderInsuranceDetails()}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  cards: {
    marginTop: 20,
    gap: 16,
  },
  noInsuranceText: {
    fontSize: 14,
    textAlign: 'center',
  },
  unauthorizedContainer: {
    alignItems: 'center',
    padding: 16,
    gap: 16,
  },
  unauthorizedText: {
    fontSize: 14,
    textAlign: 'center',
  },
  verifyButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
  },
  verifyButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
