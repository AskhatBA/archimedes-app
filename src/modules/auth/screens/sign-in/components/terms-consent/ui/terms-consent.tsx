import { FC, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { Checkbox } from '@/shared/components/checkbox';

export const TermsConsent: FC = () => {
  const [terms, setTerms] = useState(false);

  return (
    <View style={styles.container}>
      <Checkbox checked={terms} onCheck={setTerms} />
      <Text style={styles.text}>
        Я соглашаюсь с условиями Пользовательского соглашения и Политики
        конфиденциальности.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  text: {
    fontSize: 12,
  },
});
