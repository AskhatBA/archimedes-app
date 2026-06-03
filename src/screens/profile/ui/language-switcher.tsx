import { FC } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { useLanguage, useTranslation } from '@/shared/lib/i18n';
import { colors, fonts } from '@/shared/theme';

export const LanguageSwitcher: FC = () => {
  const { t } = useTranslation();
  const { options, changeLanguage, isCurrent } = useLanguage();

  return (
    <View style={styles.container}>
      <Text style={styles.eyebrow}>{t('language:title')}</Text>
      <View style={styles.row}>
        {options.map(option => {
          const active = isCurrent(option.code);
          return (
            <TouchableOpacity
              key={option.code}
              activeOpacity={0.85}
              onPress={() => changeLanguage(option.code)}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
              style={[
                styles.pill,
                active ? styles.pillActive : styles.pillIdle,
              ]}
            >
              {active && (
                <View style={styles.checkDot}>
                  <Text style={styles.checkGlyph}>✓</Text>
                </View>
              )}
              <Text style={styles.flag}>{option.flag}</Text>
              <Text
                style={[
                  styles.label,
                  active ? styles.labelActive : styles.labelIdle,
                ]}
                numberOfLines={1}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 10,
  },
  eyebrow: {
    fontSize: 11,
    fontFamily: fonts.SFPro.Semibold,
    color: colors.gray[500],
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    paddingHorizontal: 4,
  },
  row: {
    flexDirection: 'row',
    gap: 8,
  },
  pill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 14,
    borderWidth: 2,
    position: 'relative',
  },
  pillActive: {
    backgroundColor: colors.blue[100],
    borderColor: colors.blue[500],
    shadowColor: colors.blue[500],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 10,
    elevation: 4,
  },
  pillIdle: {
    backgroundColor: colors.gray[200],
    borderColor: 'transparent',
  },
  checkDot: {
    position: 'absolute',
    top: -6,
    right: -6,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.blue[500],
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.white,
  },
  checkGlyph: {
    color: colors.white,
    fontSize: 10,
    fontFamily: fonts.SFPro.Bold,
    lineHeight: 12,
  },
  flag: {
    fontSize: 18,
  },
  label: {
    fontSize: 14,
    fontFamily: fonts.SFPro.Semibold,
  },
  labelActive: {
    color: colors.blue[500],
  },
  labelIdle: {
    color: colors.gray[700],
  },
});
