import { FC } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import {
  PURCHASE_FILTERS,
  PURCHASE_FILTER_LABEL_KEYS,
  type PurchaseFilter,
} from '@/modules/paid-programs';
import { useTranslation } from '@/shared/lib/i18n';
import { colors, fonts } from '@/shared/theme';

interface PurchaseFiltersProps {
  value: PurchaseFilter;
  onChange: (filter: PurchaseFilter) => void;
}

/**
 * Narrows the history to one catalogue category.
 *
 * Pills rather than the catalogue's equal-width tabs: there are three of them here, and
 * the labels are translated — a fixed third of the row clips "Мед. жоспарлар" in Kazakh.
 */
export const PurchaseFilters: FC<PurchaseFiltersProps> = ({
  value,
  onChange,
}) => {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      {PURCHASE_FILTERS.map(filter => {
        const isActive = filter === value;

        return (
          <TouchableOpacity
            key={filter}
            activeOpacity={0.9}
            style={[styles.chip, isActive && styles.chipActive]}
            onPress={() => onChange(filter)}
            accessibilityRole="button"
            accessibilityState={{ selected: isActive }}
          >
            <Text style={[styles.label, isActive && styles.labelActive]}>
              {t(PURCHASE_FILTER_LABEL_KEYS[filter])}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingBottom: 16,
  },
  chip: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: colors.blue['100'],
    borderWidth: 1,
    borderColor: colors.blue['200'],
  },
  chipActive: {
    backgroundColor: colors.blue['400'],
    borderColor: colors.blue['400'],
  },
  label: {
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '600',
    fontFamily: fonts.SFPro.Semibold,
    color: colors.blue['500'],
  },
  labelActive: {
    color: colors.white,
  },
});
