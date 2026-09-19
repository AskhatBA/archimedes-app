import { useMedAccount } from '@/modules/insurance/hooks/use-med-account';
import { formatBalance } from '@/modules/insurance/lib/format-balance';
import { useTranslation } from '@/shared/lib/i18n';

/**
 * What the med-account programme shows where every other programme shows its card number:
 * the balance on the медсчёт, which is what a visit under it is paid from.
 *
 * Only read while `enabled` — i.e. while such a programme is actually on screen — and blank
 * until it loads, rather than flashing "unavailable" first.
 */
export const useMedAccountBalanceLabel = (enabled: boolean): string => {
  const { t } = useTranslation();
  const { balance, isLoading } = useMedAccount({ enabled });

  if (isLoading) return '';
  if (balance === null) {
    return t('appointments:create.programChoice.balanceUnavailable');
  }
  return t('appointments:create.programChoice.balance', {
    amount: formatBalance(balance),
  });
};
