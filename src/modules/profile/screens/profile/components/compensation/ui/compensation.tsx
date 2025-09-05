import { FC } from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { Button } from '@/shared/components/button';
import { useNavigation, routes } from '@/shared/navigation';
import { globalStyles } from '@/shared/theme';

export const Compensation: FC = () => {
  const { navigate } = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={globalStyles.sectionHeading}>Возмещение</Text>
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
});
