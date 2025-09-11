import { FC } from 'react';
import { View, StyleSheet, Text } from 'react-native';

import { Button } from '@/shared/components/button';
import { SuccessCheckIcon } from '@/shared/icons';
import { useNavigation, routes } from '@/shared/navigation';
import { useTheme } from '@/shared/theme';

export const SuccessRefundRequest: FC = () => {
  const { colors } = useTheme();
  const { goBack } = useNavigation();

  return (
    <View style={styles.container}>
      <SuccessCheckIcon width={120} height={120} color={colors.primary} />
      <Text style={[styles.successText, { color: colors.textMain }]}>
        Заявка успешно отправлена
      </Text>
      <Button style={{ width: '100%', marginTop: 64 }} onPress={() => goBack()}>
        Вернуться
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 120,
    paddingHorizontal: 32,
  },
  successText: {
    fontSize: 22,
    fontWeight: 500,
    marginTop: 16,
  },
});
