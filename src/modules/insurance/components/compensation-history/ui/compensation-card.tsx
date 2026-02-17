import { FC } from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { InsuranceRefundRequest } from '@/api';
import { formatDate } from '@/shared/adapters/date';
import { useTheme } from '@/shared/theme';

type CompensationCardProps = InsuranceRefundRequest;

export const CompensationCard: FC<CompensationCardProps> = ({
  id,
  person,
  date,
  amount,
  status,
}) => {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.gray['200'],
        },
      ]}
    >
      <Text style={[styles.name, { color: colors.textMain }]}>{person}</Text>
      <View style={[styles.row, { marginBottom: 4 }]}>
        <Text style={{ color: colors.primary }}>Номер заявки: </Text>
        <Text style={[styles.indificator, { color: colors.primary }]}>
          {id}
        </Text>
      </View>
      <View style={styles.row}>
        <Text style={[styles.label, { color: colors.textMain }]}>Дата: </Text>
        <Text style={[styles.value, { color: colors.textMain }]}>
          {formatDate(date, 'DD.MM.YYYY')}
        </Text>
      </View>
      <View style={styles.row}>
        <Text style={[styles.label, { color: colors.textMain }]}>Цена: </Text>
        <Text style={[styles.value, { color: colors.textMain }]}>
          {amount}₸
        </Text>
      </View>
      <View style={styles.row}>
        <Text style={[styles.label, { color: colors.textMain }]}>Статус: </Text>
        <Text style={[styles.value, { color: colors.textMain }]}>{status}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 16,
    gap: 6,
  },
  indificator: {
    fontWeight: 600,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  value: {
    fontSize: 14,
    fontWeight: 300,
  },
  label: {
    fontSize: 14,
    fontWeight: 500,
  },
  name: {
    fontSize: 16,
    fontWeight: 600,
  },
});
