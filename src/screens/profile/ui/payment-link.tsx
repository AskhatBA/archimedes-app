import { FC } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { TEST_PAYMENT_AMOUNT } from '@/modules/payment';
import { useTranslation } from '@/shared/lib/i18n';
import { routes, useNavigation } from '@/shared/navigation';
import { colors, fonts } from '@/shared/theme';

/**
 * Entry point into the WebView payment page. Kept in the profile for testing, so it sends
 * a fixed amount and the web page goes straight to the provider without asking for one.
 */
export const PaymentLink: FC = () => {
  const { navigate } = useNavigation();
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <Text style={styles.eyebrow}>{t('profile:payment.eyebrow')}</Text>

      <View style={styles.card}>
        <TouchableOpacity
          activeOpacity={0.85}
          style={styles.row}
          onPress={() =>
            navigate(routes.Payment, { amount: TEST_PAYMENT_AMOUNT })
          }
        >
          <Text style={styles.label}>
            {t('profile:payment.topUp', { amount: TEST_PAYMENT_AMOUNT })}
          </Text>
          <Text style={styles.action}>{t('profile:payment.open')}</Text>
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
