import { FC } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@/shared/theme';

const MAX_LEVEL = 5;

const LEVEL_LABELS: Record<number, string> = {
  1: 'Очень плохо',
  2: 'Плохо',
  3: 'Удовлетворительно',
  4: 'Хорошо',
  5: 'Отлично',
};

interface SatisfactionRatingProps {
  value?: number | null;
  onChange?: (value: number) => void;
  title?: string;
  disabled?: boolean;
}

export const SatisfactionRating: FC<SatisfactionRatingProps> = ({
  value,
  onChange,
  title = 'Оцените качество услуги',
  disabled = false,
}) => {
  const { colors } = useTheme();

  const levels = Array.from({ length: MAX_LEVEL }, (_, i) => i + 1);
  const selectedLabel =
    value && LEVEL_LABELS[value] ? LEVEL_LABELS[value] : 'Не оценено';

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.gray['600'] }]}>{title}</Text>

      <View style={styles.row}>
        {levels.map(level => {
          const isSelected = value === level;
          return (
            <Pressable
              key={level}
              disabled={disabled}
              onPress={() => onChange?.(level)}
              style={[
                styles.cell,
                {
                  backgroundColor: isSelected
                    ? colors.blue['400']
                    : colors.gray['200'],
                  borderColor: isSelected
                    ? colors.blue['400']
                    : colors.blue['200'],
                  opacity: disabled ? 0.6 : 1,
                },
              ]}
            >
              <Text
                style={[
                  styles.cellText,
                  {
                    color: isSelected ? colors.white : colors.gray['600'],
                  },
                ]}
              >
                {level}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <Text
        style={[
          styles.subtitle,
          {
            color: value ? colors.blue['400'] : colors.gray['500'],
            fontWeight: value ? '600' : '400',
          },
        ]}
      >
        {selectedLabel}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 10,
  },
  title: {
    fontSize: 13,
    fontWeight: '500',
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'space-between',
  },
  cell: {
    flex: 1,
    aspectRatio: 1,
    maxWidth: 56,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cellText: {
    fontSize: 18,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 13,
    textAlign: 'center',
  },
});
