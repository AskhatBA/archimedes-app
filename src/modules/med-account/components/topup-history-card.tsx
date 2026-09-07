import { FC } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { formatDate } from '@/shared/lib/date';
import { useTranslation } from '@/shared/lib/i18n';
import { colors, fonts } from '@/shared/theme';

import { formatAmount } from '../lib/format-amount';
import { Topup, TopupStatus } from '../types';

const STATUS_STYLE: Record<TopupStatus, { background: string; text: string }> =
  {
    PENDING: { background: colors.orange['100'], text: colors.orange['600'] },
    CREDITED: { background: colors.green['200'], text: colors.green['600'] },
    FAILED: { background: colors.red['100'], text: colors.red['500'] },
  };

interface TopupHistoryCardProps {
  topup: Topup;
}

/**
 * One top-up in the patient's history.
 *
 * The status carries an explanation rather than standing alone: "зачисляется" on its own
 * reads as a stuck payment, when in fact the money has been taken and is waiting on the
 * clinic to post it. A failed one has to say what to do next, because the patient has paid
 * and cannot fix it from the app.
 */
export const TopupHistoryCard: FC<TopupHistoryCardProps> = ({ topup }) => {
  const { t } = useTranslation();

  const statusStyle = STATUS_STYLE[topup.status];

  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <Text style={styles.date}>
          {formatDate(topup.createdAt, 'DD.MM.YYYY, HH:mm')}
        </Text>
        <View
          style={[styles.status, { backgroundColor: statusStyle.background }]}
        >
          <Text style={[styles.statusText, { color: statusStyle.text }]}>
            {t(`medAccount:history.status.${topup.status}`)}
          </Text>
        </View>
      </View>

      <Text style={styles.amount}>{formatAmount(topup.amount)}</Text>

      <Text style={styles.hint}>
        {topup.status === 'CREDITED' && topup.creditedAt
          ? t('medAccount:history.hint.CREDITED_ON', {
              date: formatDate(topup.creditedAt, 'DD.MM.YYYY'),
            })
          : t(`medAccount:history.hint.${topup.status}`)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.blue['200'],
    backgroundColor: colors.blue['100'],
    paddingHorizontal: 14,
    paddingVertical: 14,
    gap: 6,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  date: {
    fontSize: 13,
    fontFamily: fonts.SFPro.Medium,
    color: colors.gray['500'],
  },
  status: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  statusText: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '700',
    fontFamily: fonts.SFPro.Bold,
  },
  amount: {
    fontSize: 20,
    lineHeight: 25,
    fontWeight: '700',
    fontFamily: fonts.SFPro.Bold,
    color: colors.blue['500'],
    fontVariant: ['tabular-nums'],
  },
  hint: {
    fontSize: 13,
    lineHeight: 18,
    fontFamily: fonts.SFPro.Regular,
    color: colors.blue['370'],
  },
});
