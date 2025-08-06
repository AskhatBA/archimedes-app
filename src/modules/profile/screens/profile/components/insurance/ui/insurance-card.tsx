import { FC } from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { Button } from '@/shared/components/button';
import { useTheme } from '@/shared/theme';

export const InsuranceCard: FC = () => {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.blue['100'] }]}>
      <Text style={[styles.title, { color: colors.blue['500'] }]}>
        Остаток счета
      </Text>
      <Text style={[styles.price, { color: colors.blue['500'] }]}>
        150 000 ₸
      </Text>
      <Button title="Add insurance" variant="secondary" size="sm">
        + Добавить страховку
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    paddingHorizontal: 14,
    borderRadius: 15,
  },
  title: {
    fontWeight: 300,
    fontSize: 16,
    lineHeight: 25,
    marginBottom: 8,
  },
  price: {
    fontSize: 30,
    fontWeight: 500,
    marginBottom: 24,
  },
});
