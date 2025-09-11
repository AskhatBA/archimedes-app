import { FC } from 'react';
import { ScrollView, StyleSheet } from 'react-native';

import { BottomDrawer } from '@/shared/components/bottom-drawer';
import { Button } from '@/shared/components/button';
import { SelectOption } from '@/shared/components/select-field/ui/select-option';

import { SelectFieldOption } from '../types';

interface SelectDrawerProps {
  options: SelectFieldOption[];
  isOpen?: boolean;
  onClose?: () => void;
  onChange?: (value: string) => void;
  buttonText?: string;
  selected: string;
  setSelected: (value: string) => void;
}

export const SelectDrawer: FC<SelectDrawerProps> = ({
  options,
  isOpen,
  onClose,
  onChange,
  buttonText,
  selected,
  setSelected,
}) => {
  return (
    <BottomDrawer visible={isOpen} onClose={onClose}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 24, paddingHorizontal: 16 }}
      >
        {options.map(option => (
          <SelectOption
            key={option.value}
            isSelected={option.value === selected}
            {...option}
            onSelect={selectedValue => setSelected(selectedValue)}
          />
        ))}
      </ScrollView>
      <Button
        onPress={() => onChange(selected)}
        style={styles.selectButton}
        disabled={!selected}
      >
        {buttonText}
      </Button>
    </BottomDrawer>
  );
};

const styles = StyleSheet.create({
  selectButton: {
    marginTop: 16,
    marginHorizontal: 16,
  },
});
