import { FC, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { formatBalance, useMedAccount } from '@/modules/insurance';
import { SkeletonElement } from '@/shared/components/skeleton-element';
import { RefreshIcon, WalletIcon } from '@/shared/icons';
import { useTranslation } from '@/shared/lib/i18n';
import { routes, useNavigation } from '@/shared/navigation';
import { colors, fonts } from '@/shared/theme';

/** How long the refresh button stays off after a tap, so it cannot hammer the insurer. */
export const MED_ACCOUNT_REFRESH_COOLDOWN_MS = 10_000;

/**
 * The medical-account balance on the home screen, and the way in to topping it up.
 *
 * The whole card is the entry point rather than a separate button: the balance is exactly
 * what makes someone want to top up, so tapping the number they just read is the gesture
 * they already reach for.
 *
 * A top-up can settle a moment after the patient is back on this screen, so the balance
 * read on focus may still be the old one. The refresh button re-reads it on demand, at most
 * once per `MED_ACCOUNT_REFRESH_COOLDOWN_MS`.
 */
export const MedAccountCard: FC = () => {
  const { balance, isLoading, isFetching, refetch } = useMedAccount();
  const { navigate } = useNavigation();
  const { t } = useTranslation();

  const [isCoolingDown, setIsCoolingDown] = useState(false);
  const cooldownTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (cooldownTimer.current) {
        clearTimeout(cooldownTimer.current);
      }
    },
    [],
  );

  const onRefresh = () => {
    if (isCoolingDown) {
      return;
    }

    setIsCoolingDown(true);
    refetch();
    cooldownTimer.current = setTimeout(
      () => setIsCoolingDown(false),
      MED_ACCOUNT_REFRESH_COOLDOWN_MS,
    );
  };

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      style={styles.card}
      onPress={() => navigate(routes.MedAccountTopup)}
      accessibilityRole="button"
      accessibilityLabel={t('home:medAccountOpenA11y')}
    >
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
        <View style={styles.balanceBlock}>
          <View
            style={[styles.amountPill, balance === null && styles.emptyPill]}
          >
            <Text
              style={[styles.amount, balance === null && styles.emptyAmount]}
              numberOfLines={1}
            >
              {balance === null
                ? t('home:medAccountUnavailable')
                : formatBalance(balance)}
            </Text>
          </View>

          <TouchableOpacity
            style={[
              styles.refreshButton,
              isCoolingDown && !isFetching && styles.refreshButtonDisabled,
            ]}
            onPress={onRefresh}
            disabled={isCoolingDown || isFetching}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel={t('home:medAccountRefreshA11y')}
            accessibilityState={{
              disabled: isCoolingDown || isFetching,
              busy: isFetching,
            }}
          >
            {isFetching ? (
              <ActivityIndicator size="small" color={colors.blue['400']} />
            ) : (
              <RefreshIcon width={16} height={16} color={colors.blue['400']} />
            )}
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
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
  balanceBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
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
  refreshButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.blue['200'],
  },
  refreshButtonDisabled: {
    opacity: 0.4,
  },
});
