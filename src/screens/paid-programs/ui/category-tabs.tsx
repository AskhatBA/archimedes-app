import { FC } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import {
  CATEGORY_LABEL_KEYS,
  PAID_PROGRAM_CATEGORIES,
  type PaidProgramCategory,
} from '@/modules/paid-programs';
import { useTranslation } from '@/shared/lib/i18n';
import { colors, fonts } from '@/shared/theme';

interface CategoryTabsProps {
  value: PaidProgramCategory;
  onChange: (category: PaidProgramCategory) => void;
}

export const CategoryTabs: FC<CategoryTabsProps> = ({ value, onChange }) => {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      {PAID_PROGRAM_CATEGORIES.map(category => {
        const isActive = category === value;

        return (
          <TouchableOpacity
            key={category}
            activeOpacity={0.9}
            style={[styles.tab, isActive && styles.tabActive]}
            onPress={() => onChange(category)}
          >
            <Text style={[styles.label, isActive && styles.labelActive]}>
              {t(CATEGORY_LABEL_KEYS[category])}
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
    gap: 8,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: colors.blue['100'],
    borderWidth: 1,
    borderColor: colors.blue['200'],
  },
  tabActive: {
    backgroundColor: colors.blue['400'],
    borderColor: colors.blue['400'],
  },
  label: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '600',
    fontFamily: fonts.SFPro.Semibold,
    color: colors.blue['500'],
  },
  labelActive: {
    color: colors.white,
  },
});
