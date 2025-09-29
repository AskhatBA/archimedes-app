import { FC } from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { Button } from '@/shared/components/button';
import { useNavigation, routes } from '@/shared/navigation';
import { useTheme } from '@/shared/theme';

interface InsuranceCardProps {
  level: string;
  price: number;
  programId: string;
}

export const InsuranceCard: FC<InsuranceCardProps> = ({
  level,
  price,
  programId,
}) => {
  const { colors } = useTheme();
  const { navigate } = useNavigation();

  return (
    <View style={{ gap: 16 }}>
      <View style={[styles.container, { backgroundColor: colors.blue['100'] }]}>
        <Text style={[styles.title, { color: colors.blue['500'] }]}>
          {level}
        </Text>
        <Text style={[styles.price, { color: colors.blue['500'] }]}>
          {price} ₸
        </Text>
        <Button
          variant="secondary"
          size="sm"
          onPress={() => navigate(routes.InsuranceDetails, { programId })}
        >
          Перейти к деталям страховки
        </Button>
      </View>
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
