import { FC } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

import { SelectCaretIcon } from '@/shared/icons';
import { useToast } from '@/shared/lib/toast';
import { colors, fonts } from '@/shared/theme';

interface Metric {
  key: 'height' | 'weight' | 'blood';
  label: string;
  accent: string;
}

const METRICS: Metric[] = [
  { key: 'height', label: 'Рост', accent: '#C77DFF' },
  { key: 'weight', label: 'Вес', accent: colors.blue['400'] },
  { key: 'blood', label: 'Группа крови', accent: colors.red['500'] },
];

const ChevronRight: FC = () => (
  <View style={{ transform: [{ rotate: '-90deg' }] }}>
    <SelectCaretIcon width={14} height={14} color={colors.gray['500']} />
  </View>
);

export const HealthMetrics: FC = () => {
  const { showToast } = useToast();

  const handlePress = (label: string) =>
    showToast({
      type: 'info',
      message: `${label}: ввод данных скоро`,
      duration: 2000,
    });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Показатели здоровья</Text>
        <TouchableOpacity onPress={() => handlePress('Показатели')}>
          <Text style={styles.allLink}>Все</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.row}>
        {METRICS.map(metric => (
          <TouchableOpacity
            key={metric.key}
            style={styles.card}
            onPress={() => handlePress(metric.label)}
          >
            <View style={styles.cardHeader}>
              <View style={[styles.dot, { backgroundColor: metric.accent }]} />
              <Text style={[styles.label, { color: metric.accent }]}>
                {metric.label}
              </Text>
            </View>
            <View style={styles.valueRow}>
              <Text style={styles.valueText}>Указать</Text>
              <ChevronRight />
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.gray['200'],
    borderRadius: 24,
    padding: 16,
    gap: 14,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 16,
    lineHeight: 20,
    fontWeight: '700',
    fontFamily: fonts.SFPro.Bold,
    color: colors.textMain,
  },
  allLink: {
    fontSize: 14,
    lineHeight: 18,
    color: colors.green['600'],
    fontFamily: fonts.SFPro.Semibold,
    fontWeight: '600',
  },
  row: {
    flexDirection: 'row',
    gap: 8,
  },
  card: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 8,
  },
  label: {
    fontSize: 12,
    lineHeight: 14,
    fontFamily: fonts.SFPro.Semibold,
    fontWeight: '600',
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  valueText: {
    fontSize: 14,
    lineHeight: 18,
    color: colors.gray['600'],
    fontFamily: fonts.SFPro.Semibold,
    fontWeight: '600',
  },
});
