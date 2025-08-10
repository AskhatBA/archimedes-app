import { FC, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';

import { BottomDrawer } from '@/shared/components/bottom-drawer';
import { Button } from '@/shared/components/button';
import { SelectCaretIcon } from '@/shared/icons';
import { useTheme } from '@/shared/theme';

import { SelectFieldOption } from '../types';

import { SelectOption } from './select-option';

interface SelectFieldProps {
  options: SelectFieldOption[];
  placeholder?: string;
  selectButtonText?: string;
  onChange?: (value: string) => void;
  value?: string;
}

export const SelectField: FC<SelectFieldProps> = ({
  options,
  placeholder,
  selectButtonText = 'Выбрать',
  onChange,
  value,
}) => {
  const [selected, setSelected] = useState<string>();
  const [optionsOpened, setOptionsOpened] = useState(false);
  const { colors } = useTheme();
  const selectedOption = options.find(option => option.value === value);
  const isValueSelected = !!selectedOption;

  const handleChange = () => {
    if (onChange) onChange(selected);
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

  return (
    <>
      <TouchableOpacity
        onPress={onOpen}
        style={[
          styles.fieldContainer,
          {
            backgroundColor: isValueSelected
              ? colors.blue['100']
              : colors.gray['200'],
          },
        ]}
      >
        <Text
          style={[
            styles.value,
            {
              color: isValueSelected ? colors.blue['400'] : colors.gray['500'],
            },
          ]}
        >
          {selectedOption?.label || placeholder}
        </Text>
        <SelectCaretIcon
          color={isValueSelected ? colors.blue['400'] : colors.gray['500']}
        />
      </TouchableOpacity>
      <BottomDrawer visible={optionsOpened} onClose={onClose}>
        <View>
          <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
            {options.map(option => (
              <SelectOption
                key={option.value}
                isSelected={option.value === selected}
                {...option}
                onSelect={value => setSelected(value)}
              />
            ))}
          </ScrollView>
          <Button onPress={handleChange} style={styles.selectButton}>
            {selectButtonText}
          </Button>
        </View>
      </BottomDrawer>
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
  selectButton: {
    marginTop: 16,
  },
});
