import { FC } from 'react';
import { ScrollView } from 'react-native';

import { BottomDrawer } from '@/shared/components/bottom-drawer';
import { SelectOption } from '@/shared/components/select-field/ui/select-option';

import { SelectFieldOption } from '../types';

interface SelectDrawerProps {
  options: SelectFieldOption[];
  isOpen?: boolean;
  onClose?: () => void;
  onChange?: (value: string) => void;
  selected: string;
  setSelected: (value: string) => void;
}

export const SelectDrawer: FC<SelectDrawerProps> = ({
  options,
  isOpen,
  onClose,
  onChange,
  selected,
  setSelected,
}) => {
  return (
    <BottomDrawer visible={isOpen} onClose={onClose}>
      <ScrollView
        contentContainerStyle={{
          paddingBottom: 120,
          paddingHorizontal: 16,
        }}
      >
        {options.map((option, index) => (
          <SelectOption
            key={option.value}
            isSelected={option.value === selected}
            isLast={options.length - 1 === index}
            {...option}
            onSelect={selectedValue => {
              setSelected(selectedValue);
              if (onChange) onChange(selectedValue);
              if (onClose) onClose();
            }}
          />
        ))}
      </ScrollView>
    </BottomDrawer>
  );
};
