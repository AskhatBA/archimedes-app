import { FC } from 'react';
import { View, Text } from 'react-native';

import { Button } from '@/shared/components/button';

export const InsuranceCard: FC = () => {
  return (
    <View>
      <Text>Остаток счета</Text>
      <Text>150 000 ₸</Text>
      <Button title="Add insurance" variant="secondary" size="sm">
        + Добавить страховку
      </Button>
    </View>
  );
};
