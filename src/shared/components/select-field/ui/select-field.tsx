import { FC, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Keyboard,
} from 'react-native';

import { SelectCaretIcon } from '@/shared/icons';
import { fonts, useTheme } from '@/shared/theme';

import { SelectFieldOption, SelectFieldSection } from '../types';

import { SelectDrawer } from './select-drawer';

interface SelectFieldProps {
  options?: SelectFieldOption[];
  sections?: SelectFieldSection[];
  placeholder?: string;
  onChange?: (value: string) => void;
  value?: string;
  error?: string;
  emptyText?: string;
}

export const SelectField: FC<SelectFieldProps> = ({
  options,
  sections,
  placeholder,
  onChange,
  value,
  error,
  emptyText,
}) => {
  const [selected, setSelected] = useState<string>();
  const [optionsOpened, setOptionsOpened] = useState(false);
  const { colors } = useTheme();
  const allOptions: SelectFieldOption[] = sections
    ? sections.flatMap(s => s.options)
    : options || [];
  const selectedOption = allOptions.find(option => option.value === value);
  const isValueSelected = !!selectedOption;
  const isTinted = optionsOpened || isValueSelected;

  const handleChange = (val: string) => {
    if (onChange) onChange(val);
    setOptionsOpened(false);
  };

  const onClose = () => {
    setOptionsOpened(false);
    setSelected(undefined);
  };

  const onOpen = () => {
    setOptionsOpened(true);
    Keyboard.dismiss();
    if (value) setSelected(value);
  };

  const fieldContainerBackground = (() => {
    if (error) return colors.red['100'];
    if (isTinted) return colors.blue['100'];
    return colors.gray['200'];
  })();

  const fieldBorderColor = (() => {
    if (error) return colors.error;
    if (optionsOpened) return colors.blue['400'];
    if (isValueSelected) return colors.blue['200'];
    return colors.gray['250'];
  })();

  const valueFontColor = (() => {
    if (error) return colors.error;
    if (isValueSelected) return colors.blue['400'];
    return colors.gray['500'];
  })();

  const caretBg = isTinted ? colors.white : 'transparent';
  const caretColor = isValueSelected ? colors.blue['400'] : colors.gray['500'];

  return (
    <>
      <View>
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={onOpen}
          style={[
            styles.fieldContainer,
            {
              backgroundColor: fieldContainerBackground,
              borderColor: fieldBorderColor,
            },
          ]}
        >
          <View style={styles.valueContainer}>
            <Text
              numberOfLines={1}
              style={[styles.value, { color: valueFontColor }]}
            >
              {selectedOption?.label || placeholder}
            </Text>
            {selectedOption?.subtitle && (
              <Text
                numberOfLines={1}
                style={[styles.subtitle, { color: colors.gray['500'] }]}
              >
                {selectedOption.subtitle}
              </Text>
            )}
          </View>
          <View
            style={[
              styles.caretChip,
              {
                backgroundColor: caretBg,
                transform: [{ rotate: optionsOpened ? '180deg' : '0deg' }],
              },
            ]}
          >
            <SelectCaretIcon color={caretColor} />
          </View>
        </TouchableOpacity>
        {error && (
          <Text style={[styles.error, { color: colors.error }]}>{error}</Text>
        )}
      </View>
      <SelectDrawer
        isOpen={optionsOpened}
        onClose={onClose}
        options={options}
        sections={sections}
        selected={selected}
        setSelected={setSelected}
        onChange={handleChange}
        emptyText={emptyText}
      />
    </>
  );
};

const styles = StyleSheet.create({
  fieldContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  valueContainer: {
    flex: 1,
    gap: 2,
  },
  value: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '600',
    fontFamily: fonts.SFPro.Semibold,
  },
  subtitle: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '500',
  },
  caretChip: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  error: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 4,
    paddingHorizontal: 4,
  },
});
