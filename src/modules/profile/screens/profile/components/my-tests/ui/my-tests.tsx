import { FC, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

import { SelectCaretIcon, ClipboardListIcon } from '@/shared/icons';
import { useTheme } from '@/shared/theme';

import { HistoryCard } from '../../history-card';

export const MyTests: FC = () => {
  const [open, setOpen] = useState(false);
  const { colors } = useTheme();

  const headerBg = open ? colors.blue['100'] : colors.gray['200'];
  const headerText = open ? colors.blue['400'] : colors.gray['700'];
  const caretColor = open ? colors.blue['400'] : colors.gray['700'];

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => setOpen(prev => !prev)}
        style={[styles.fieldContainer, { backgroundColor: headerBg }]}
        accessibilityRole="button"
        accessibilityState={{ expanded: open }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
          <ClipboardListIcon color={headerText} />
          <Text numberOfLines={1} style={[styles.value, { color: headerText }]}>
            Мои анализы
          </Text>
        </View>
        <SelectCaretIcon color={caretColor} />
      </TouchableOpacity>
      {open && (
        <View style={styles.tests}>
          <HistoryCard color="orange" name="12/09 - ОАК" />
          <HistoryCard color="orange" name="12/09 - Анализ мочи" />
          <HistoryCard color="orange" name="12/09 - Глубинный анализ" />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  fieldContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 15,
    padding: 18,
  },
  value: {
    fontSize: 18,
    lineHeight: 22,
    fontWeight: 600,
  },
  tests: {
    marginTop: 8,
    gap: 7,
  },
});
