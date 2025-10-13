import { FC } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BottomDrawer } from '@/shared/components/bottom-drawer';
import { Button } from '@/shared/components/button';
import { SelectOption } from '@/shared/components/select-field/ui/select-option';
import { colors } from '@/shared/theme';

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
  const insets = useSafeAreaInsets();

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
            onSelect={selectedValue => setSelected(selectedValue)}
          />
        ))}
      </ScrollView>
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
          backgroundColor: colors.white,
          paddingBottom: insets.bottom,
          shadowColor: colors.gray['500'],
          shadowOffset: {
            width: 0,
            height: -2,
          },
          shadowOpacity: 0.1,
          shadowRadius: 3,
          elevation: 5,
        }}
      >
        <Button
          onPress={() => onChange(selected)}
          style={styles.selectButton}
          disabled={selected === null || selected === undefined}
        >
          {buttonText}
        </Button>
      </View>
    </BottomDrawer>
  );
};

const styles = StyleSheet.create({
  selectButton: {
    marginTop: 16,
    marginHorizontal: 16,
  },
});
