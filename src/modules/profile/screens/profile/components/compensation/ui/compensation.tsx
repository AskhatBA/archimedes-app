import { FC } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

import { Button } from '@/shared/components/button';
import { useNavigation, routes } from '@/shared/navigation';
import { globalStyles, useTheme } from '@/shared/theme';

export const Compensation: FC = () => {
  const { colors } = useTheme();
  const { navigate } = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.heading}>
        <Text style={globalStyles.sectionHeading}>Возмещение</Text>
        <TouchableOpacity onPress={() => navigate(routes.CompensationsHistory)}>
          <Text style={[styles.historyButtonText, { color: colors.primary }]}>
            История
          </Text>
        </TouchableOpacity>
      </View>
      <Button onPress={() => navigate(routes.Compensation)}>
        Создать новую заявку
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 20,
  },
  heading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  historyButtonText: {
    fontSize: 16,
    fontWeight: 500,
  },
});
