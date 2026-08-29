import { FC } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { TrashIcon } from '@/shared/icons';
import { formatDate } from '@/shared/lib/date';
import { useTranslation } from '@/shared/lib/i18n';
import { colors, fonts } from '@/shared/theme';

import { formatPrice } from '../../../lib/format-price';
import { Purchase, PurchaseStatus } from '../../../types';

interface PurchaseCardProps {
  purchase: Purchase;
  /**
   * Given for purchases still waiting on a result — an abandoned checkout never gets
   * one, and would otherwise sit in the list as pending forever.
   */
  onDelete?: () => void;
}

const STATUS_STYLE: Record<
  PurchaseStatus,
  { background: string; text: string }
> = {
  PENDING: { background: colors.orange['100'], text: colors.orange['600'] },
  SUCCESS: { background: colors.green['200'], text: colors.green['600'] },
  FAILED: { background: colors.red['100'], text: colors.red['500'] },
  CANCELLED: { background: colors.gray['200'], text: colors.gray['600'] },
};

export const PurchaseCard: FC<PurchaseCardProps> = ({ purchase, onDelete }) => {
  const { t } = useTranslation();

  const statusStyle = STATUS_STYLE[purchase.status];

  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <Text style={styles.date}>
          {formatDate(purchase.createdAt, 'DD.MM.YYYY, HH:mm')}
        </Text>
        <View style={styles.topRowActions}>
          <View
            style={[styles.status, { backgroundColor: statusStyle.background }]}
          >
            <Text style={[styles.statusText, { color: statusStyle.text }]}>
              {t(`paidPrograms:history.status.${purchase.status}`)}
            </Text>
          </View>

          {onDelete ? (
            <TouchableOpacity
              onPress={onDelete}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              accessibilityLabel={t('paidPrograms:history.deleteA11y')}
            >
              <TrashIcon width={16} height={16} color={colors.gray['500']} />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      <View style={styles.programs}>
        {purchase.programs.map(program => (
          <View key={program.id} style={styles.programRow}>
            <Text numberOfLines={2} style={styles.programTitle}>
              {program.title}
            </Text>
            <Text style={styles.programPrice}>
              {formatPrice(program.price)}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.totalRow}>
        <Text style={styles.totalLabel}>{t('paidPrograms:history.total')}</Text>
        <Text style={styles.totalValue}>{formatPrice(purchase.total)}</Text>
      </View>

      {purchase.paymentId ? (
        <Text style={styles.paymentId}>
          {t('paidPrograms:history.paymentId', { id: purchase.paymentId })}
        </Text>
      ) : null}
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
    gap: 12,
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
  topRowActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  status: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  statusText: {
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '600',
    fontFamily: fonts.SFPro.Semibold,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  programs: {
    gap: 8,
  },
  programRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
  },
  programTitle: {
    flex: 1,
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '600',
    fontFamily: fonts.SFPro.Semibold,
    color: colors.blue['500'],
  },
  programPrice: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: fonts.SFPro.Medium,
    color: colors.gray['600'],
  },
  totalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: colors.blue['200'],
    paddingTop: 10,
  },
  totalLabel: {
    fontSize: 14,
    fontFamily: fonts.SFPro.Medium,
    color: colors.gray['600'],
  },
  totalValue: {
    fontSize: 17,
    fontWeight: '700',
    fontFamily: fonts.SFPro.Bold,
    color: colors.blue['500'],
  },
  paymentId: {
    fontSize: 11,
    fontFamily: fonts.SFPro.Regular,
    color: colors.gray['500'],
  },
});
