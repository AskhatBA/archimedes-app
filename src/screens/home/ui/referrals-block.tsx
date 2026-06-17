import { FC } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { useReferralsSummary } from '@/modules/insurance';
import { FileTextIcon, QrCodeIcon } from '@/shared/icons';
import { useTranslation } from '@/shared/lib/i18n';
import { routes, useNavigation } from '@/shared/navigation';
import { colors, fonts } from '@/shared/theme';

export const ReferralsBlock: FC = () => {
  const { t } = useTranslation();
  const { navigate } = useNavigation();
  const { summary } = useReferralsSummary();

  const count = summary.activeCount;
  const countLabel =
    count === 0 ? t('home:noReferrals') : t('home:referralsCount', { count });

  return (
    <View style={styles.container}>
      <View style={styles.info}>
        <View style={styles.iconBadge}>
          <FileTextIcon width={20} height={20} color={colors.blue['400']} />
        </View>
        <View style={styles.textBlock}>
          <Text style={styles.title}>{t('home:referralsTitle')}</Text>
          <Text style={styles.count}>{countLabel}</Text>
          <Text style={styles.subtitle}>{t('home:referralsSubtitle')}</Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.scanButton}
        activeOpacity={0.85}
        onPress={() => navigate(routes.QrScanner)}
      >
        <QrCodeIcon width={20} height={20} color={colors.white} />
        <Text style={styles.scanButtonText}>{t('home:scanQr')}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 14,
    gap: 14,
    borderWidth: 1,
    borderColor: colors.blue['150'],
  },
  info: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconBadge: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.blue['150'],
    alignItems: 'center',
    justifyContent: 'center',
  },
  textBlock: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontSize: 13,
    lineHeight: 16,
    color: colors.blue['400'],
    fontFamily: fonts.SFPro.Medium,
    fontWeight: '500',
  },
  count: {
    fontSize: 18,
    lineHeight: 22,
    color: colors.blue['500'],
    fontFamily: fonts.SFPro.Bold,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 12,
    lineHeight: 16,
    color: colors.gray['500'],
    fontFamily: fonts.SFPro.Regular,
  },
  scanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.blue['400'],
    borderRadius: 12,
    paddingVertical: 12,
  },
  scanButtonText: {
    color: colors.white,
    fontSize: 15,
    lineHeight: 18,
    fontFamily: fonts.SFPro.Semibold,
    fontWeight: '600',
  },
});
