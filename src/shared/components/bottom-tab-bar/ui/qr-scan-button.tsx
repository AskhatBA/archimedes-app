import { FC } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { QrCodeIcon } from '@/shared/icons';
import { useTranslation } from '@/shared/lib/i18n';
import { routes, useNavigation } from '@/shared/navigation';
import { colors, fonts } from '@/shared/theme';

export const QrScanButton: FC = () => {
  const { t } = useTranslation();
  const { navigate } = useNavigation();

  return (
    <TouchableOpacity
      style={styles.wrapper}
      onPress={() => navigate(routes.QrScanner)}
      accessibilityRole="button"
      accessibilityLabel={t('tabs:qrReferrals')}
    >
      <View style={styles.container}>
        <QrCodeIcon width={22} height={22} color={colors.white} />
      </View>
      <Text style={styles.label}>{t('tabs:qrReferrals')}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 36,
    height: 36,
    borderRadius: 45,
    backgroundColor: colors.primary,
  },
  label: {
    fontSize: 10,
    textAlign: 'center',
    color: colors.blue['370'],
    fontWeight: '600',
    fontFamily: fonts.SFPro.Regular,
  },
});
