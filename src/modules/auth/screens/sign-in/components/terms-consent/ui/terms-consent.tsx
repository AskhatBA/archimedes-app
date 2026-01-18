import { FC } from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { Checkbox } from '@/shared/components/checkbox';
import { colors } from '@/shared/theme';

interface TermsConsentProps {
  terms: boolean;
  setTerms: (terms: boolean) => void;
  error?: string;
}

export const TermsConsent: FC<TermsConsentProps> = ({
  terms,
  setTerms,
  error,
}) => {
  return (
    <View style={styles.container}>
      <Checkbox checked={terms} onCheck={setTerms} error={error} />
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
    color: colors.textMain,
  },
});
