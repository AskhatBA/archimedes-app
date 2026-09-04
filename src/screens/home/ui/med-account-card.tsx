import { FC } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { useMedAccount } from '@/modules/insurance';
import { SkeletonElement } from '@/shared/components/skeleton-element';
import { WalletIcon } from '@/shared/icons';
import { useTranslation } from '@/shared/lib/i18n';
import { colors, fonts } from '@/shared/theme';

/**
 * `0` -> `0,00 ₸`. Grouped by hand for the same reason as `formatPrice`: Hermes ships a
 * trimmed Intl, so `toLocaleString` would format differently on iOS and Android.
 */
const formatBalance = (value: number): string => {
  const [whole, cents] = Math.abs(value).toFixed(2).split('.');
  const grouped = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

  return `${value < 0 ? '-' : ''}${grouped},${cents} ₸`;
};

export const MedAccountCard: FC = () => {
  const { balance, isLoading } = useMedAccount();
  const { t } = useTranslation();

  return (
    <View style={styles.card}>
      <View style={styles.iconBadge}>
        <WalletIcon width={24} height={24} color={colors.blue['400']} />
      </View>

      <View style={styles.textBlock}>
        <Text style={styles.title}>{t('home:medAccountTitle')}</Text>
        <Text style={styles.subtitle} numberOfLines={1} ellipsizeMode="tail">
          {t('home:medAccountSubtitle')}
        </Text>
      </View>

      {isLoading ? (
        <SkeletonElement width={96} height={34} borderRadius={999} />
      ) : (
        <View style={[styles.amountPill, balance === null && styles.emptyPill]}>
          <Text
            style={[styles.amount, balance === null && styles.emptyAmount]}
            numberOfLines={1}
          >
            {balance === null
              ? t('home:medAccountUnavailable')
              : formatBalance(balance)}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.blue['100'],
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.blue['200'],
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  iconBadge: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    shadowColor: colors.blue['500'],
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  textBlock: {
    flex: 1,
  },
  title: {
    fontSize: 17,
    lineHeight: 22,
    fontWeight: '700',
    fontFamily: fonts.SFPro.Bold,
    color: colors.blue['500'],
  },
  subtitle: {
    fontSize: 12,
    lineHeight: 16,
    marginTop: 2,
    fontWeight: '500',
    fontFamily: fonts.SFPro.Medium,
    color: colors.blue['370'],
  },
  amountPill: {
    backgroundColor: colors.green['100'],
    borderWidth: 1,
    borderColor: colors.green['200'],
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  emptyPill: {
    backgroundColor: colors.blue['150'],
    borderColor: colors.blue['200'],
  },
  amount: {
    fontSize: 16,
    lineHeight: 18,
    fontWeight: '700',
    fontFamily: fonts.SFPro.Bold,
    color: colors.green['600'],
    fontVariant: ['tabular-nums'],
  },
  emptyAmount: {
    color: colors.blue['500'],
  },
});
