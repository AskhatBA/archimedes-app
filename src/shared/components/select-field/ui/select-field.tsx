import { FC, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

import { SelectCaretIcon } from '@/shared/icons';
import { useTheme } from '@/shared/theme';

import { SelectFieldOption } from '../types';

import { SelectDrawer } from './select-drawer';

interface SelectFieldProps {
  options: SelectFieldOption[];
  placeholder?: string;
  onChange?: (value: string) => void;
  value?: string;
  error?: string;
}

export const SelectField: FC<SelectFieldProps> = ({
  options,
  placeholder,
  onChange,
  value,
  error,
}) => {
  const [selected, setSelected] = useState<string>();
  const [optionsOpened, setOptionsOpened] = useState(false);
  const { colors } = useTheme();
  const selectedOption = options.find(option => option.value === value);
  const isValueSelected = !!selectedOption;

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
    if (value) setSelected(value);
  };

  const fieldContainerBackground = () => {
    if (error) return colors.red['100'];
    if (isValueSelected) return colors.blue['100'];
    return colors.gray['200'];
  };

  const valueFontColor = () => {
    if (error) return colors.error;
    if (isValueSelected) return colors.blue['400'];
    return colors.gray['500'];
  };

  return (
    <>
      <View>
        <TouchableOpacity
          onPress={onOpen}
          style={[
            styles.fieldContainer,
            {
              backgroundColor: fieldContainerBackground(),
            },
          ]}
        >
          <Text
            numberOfLines={1}
            style={[
              styles.value,
              {
                color: valueFontColor(),
              },
            ]}
          >
            {selectedOption?.label || placeholder}
          </Text>
          <SelectCaretIcon
            color={isValueSelected ? colors.blue['400'] : colors.gray['500']}
          />
        </TouchableOpacity>
        {error && (
          <Text style={[styles.error, { color: colors.error }]}>{error}</Text>
        )}
      </View>
      <SelectDrawer
        isOpen={optionsOpened}
        onClose={onClose}
        options={options}
        selected={selected}
        setSelected={setSelected}
        onChange={handleChange}
      />
    </>
  );
};

const styles = StyleSheet.create({
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
  error: {
    fontSize: 12,
    fontWeight: 500,
    marginTop: 4,
    paddingHorizontal: 16,
  },
});
