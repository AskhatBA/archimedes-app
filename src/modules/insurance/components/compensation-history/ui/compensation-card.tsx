import { FC } from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { InsuranceRefundRequest } from '@/api';
import { formatDate } from '@/shared/lib/date';
import { colors as themeColors, useTheme } from '@/shared/theme';

type CompensationCardProps = InsuranceRefundRequest;

const STATUS_MAP: Record<string, { label: string; bg: string; text: string }> =
  {
    pending: {
      label: 'На рассмотрении',
      bg: themeColors.orange['200'],
      text: themeColors.orange['600'],
    },
    approved: {
      label: 'Одобрено',
      bg: themeColors.green['100'],
      text: themeColors.green['600'],
    },
    rejected: {
      label: 'Отклонено',
      bg: themeColors.red['100'],
      text: themeColors.red['500'],
    },
  };

const getStatus = (status: string) =>
  STATUS_MAP[status.toLowerCase()] ?? {
    label: status,
    bg: themeColors.gray['200'],
    text: themeColors.gray['600'],
  };

export const CompensationCard: FC<CompensationCardProps> = ({
  id,
  person,
  date,
  amount,
  status,
  comments,
}) => {
  const { colors } = useTheme();
  const statusStyle = getStatus(status);

  return (
    <View style={[styles.container, { backgroundColor: colors.blue['100'] }]}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text
            style={[styles.person, { color: colors.textMain }]}
            numberOfLines={1}
          >
            {person}
          </Text>
          <Text style={[styles.date, { color: colors.gray['500'] }]}>
            {formatDate(date, 'DD.MM.YYYY')}
          </Text>
        </View>
        <View style={[styles.badge, { backgroundColor: statusStyle.bg }]}>
          <Text style={[styles.badgeText, { color: statusStyle.text }]}>
            {statusStyle.label}
          </Text>
        </View>
      </View>

      <View style={[styles.divider, { backgroundColor: colors.blue['200'] }]} />

      <View style={styles.footer}>
        <View>
          <Text style={[styles.amountLabel, { color: colors.gray['500'] }]}>
            Сумма
          </Text>
          <Text style={[styles.amount, { color: colors.primary }]}>
            {amount.toLocaleString('ru-RU')}₸
          </Text>
        </View>
        <View style={styles.idContainer}>
          <Text style={[styles.idLabel, { color: colors.gray['500'] }]}>
            № заявки
          </Text>
          <Text style={[styles.idValue, { color: colors.blue['400'] }]}>
            {id}
          </Text>
        </View>
      </View>

      {comments && (
        <View
          style={[styles.commentsBox, { backgroundColor: colors.blue['150'] }]}
        >
          <Text style={[styles.commentsLabel, { color: colors.gray['500'] }]}>
            Комментарий
          </Text>
          <Text style={[styles.commentsText, { color: colors.textMain }]}>
            {comments}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    padding: 16,
    gap: 12,
  },
  header: {
    gap: 12,
  },
  headerLeft: {
    flex: 1,
    gap: 3,
  },
  person: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 20,
  },
  date: {
    fontSize: 13,
    fontWeight: '400',
  },
  badge: {
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    flexShrink: 0,
    alignSelf: 'flex-end',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  divider: {
    height: 1,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  amountLabel: {
    fontSize: 12,
    fontWeight: '400',
    marginBottom: 2,
  },
  amount: {
    fontSize: 22,
    fontWeight: '700',
    lineHeight: 26,
  },
  idContainer: {
    alignItems: 'flex-end',
    gap: 2,
  },
  idLabel: {
    fontSize: 12,
    fontWeight: '400',
  },
  idValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  commentsBox: {
    borderRadius: 10,
    padding: 12,
    gap: 4,
  },
  commentsLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  commentsText: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
  },
});
