import { FC } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {
  LANGUAGE_FLAGS,
  LANGUAGE_LABELS,
  SUPPORTED_LANGUAGES,
} from '@/shared/lib/i18n/constants';
import type { SupportedLanguage } from '@/shared/lib/i18n/constants';
import { colors, fonts } from '@/shared/theme';

interface LanguageSelectScreenProps {
  onSelect: (lng: SupportedLanguage) => void;
}

export const LanguageSelectScreen: FC<LanguageSelectScreenProps> = ({
  onSelect,
}) => {
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Тіл / Язык / Language</Text>
          <Text style={styles.subtitle}>
            Тілді таңдаңыз{'\n'}Выберите язык{'\n'}Select a language
          </Text>
        </View>

        <View style={styles.list}>
          {SUPPORTED_LANGUAGES.map(code => (
            <TouchableOpacity
              key={code}
              activeOpacity={0.85}
              onPress={() => onSelect(code)}
              accessibilityRole="button"
              style={styles.option}
            >
              <Text style={styles.flag}>{LANGUAGE_FLAGS[code]}</Text>
              <Text style={styles.label}>{LANGUAGE_LABELS[code]}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.backgroundMain,
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 32,
    gap: 32,
  },
  header: {
    gap: 12,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontFamily: fonts.SFPro.Bold,
    color: colors.textMain,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    fontFamily: fonts.SFPro.Regular,
    color: colors.gray[500],
    textAlign: 'center',
  },
  list: {
    gap: 12,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.gray[250],
    backgroundColor: colors.gray[200],
  },
  flag: {
    fontSize: 24,
  },
  label: {
    flex: 1,
    fontSize: 16,
    fontFamily: fonts.SFPro.Semibold,
    color: colors.textMain,
  },
});
