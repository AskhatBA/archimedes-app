import { FC } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';

import { Button } from '@/shared/components/button';
import { usePrograms } from '@/shared/lib/insurance';
import { useNavigation, routes } from '@/shared/navigation';
import { useTheme } from '@/shared/theme';

export const InsuranceCard: FC = () => {
  const { colors } = useTheme();
  const { programs, loadingPrograms } = usePrograms();
  const { navigate } = useNavigation();

  if (loadingPrograms) {
    return <ActivityIndicator color={colors.primary} />;
  }

  return (
    <View style={{ gap: 16 }}>
      {programs.map(program => {
        if (program.status === 'EXPIRED') return null;

        return (
          <View
            key={program.id}
            style={[styles.container, { backgroundColor: colors.blue['100'] }]}
          >
            <Text style={[styles.title, { color: colors.blue['500'] }]}>
              {program.title}
            </Text>
            <Text style={[styles.price, { color: colors.blue['500'] }]}>
              150 000 ₸
            </Text>
            <Button
              variant="secondary"
              size="sm"
              onPress={() =>
                navigate(routes.InsuranceDetails, { programId: program.id })
              }
            >
              Перейти к деталям страховки
            </Button>
          </View>
        );
      })}
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
