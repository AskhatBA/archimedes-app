import { FC } from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { useTheme } from '@/shared/theme';

export const WelcomeMessage: FC = () => {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.gray['200'] }]}>
      <Text style={[styles.title, { color: colors.gray['500'] }]}>Привет!</Text>
      <Text style={[styles.text, { color: colors.gray['500'] }]}>
        Я ваш виртуальный ассистент Мед Бот. Выберите одну из тем ниже или
        напишите свой запрос.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 22,
    paddingVertical: 18,
    borderRadius: 15,
  },
  title: {
    fontSize: 15,
    lineHeight: 22,
    fontWeight: 700,
  },
  text: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: 500,
  },
});
