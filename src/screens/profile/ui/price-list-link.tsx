import { FC } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { useTranslation } from '@/shared/lib/i18n';
import { routes, useNavigation } from '@/shared/navigation';
import { colors, fonts } from '@/shared/theme';

export const PriceListLink: FC = () => {
  const { navigate } = useNavigation();
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <Text style={styles.eyebrow}>{t('profile:insurance.eyebrow')}</Text>

      <View style={styles.card}>
        <TouchableOpacity
          activeOpacity={0.85}
          style={styles.row}
          onPress={() => navigate(routes.PriceList)}
        >
          <Text style={styles.label}>{t('profile:insurance.priceList')}</Text>
          <Text style={styles.action}>{t('profile:insurance.open')}</Text>
        </TouchableOpacity>
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
  card: {
    backgroundColor: colors.gray[200],
    borderRadius: 14,
    paddingHorizontal: 14,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
  },
  label: {
    fontSize: 14,
    fontFamily: fonts.SFPro.Semibold,
    color: colors.gray[700],
  },
  action: {
    fontSize: 14,
    fontFamily: fonts.SFPro.Semibold,
    color: colors.blue[500],
  },
});
