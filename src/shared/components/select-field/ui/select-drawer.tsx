import { FC } from 'react';
import { ScrollView, Text, View } from 'react-native';

import { BottomDrawer } from '@/shared/components/bottom-drawer';
import { SelectOption } from '@/shared/components/select-field/ui/select-option';
import { useTheme } from '@/shared/theme';

import { SelectFieldOption, SelectFieldSection } from '../types';

interface SelectDrawerProps {
  options?: SelectFieldOption[];
  sections?: SelectFieldSection[];
  isOpen?: boolean;
  onClose?: () => void;
  onChange?: (value: string) => void;
  selected?: string;
  setSelected: (value: string) => void;
}

export const SelectDrawer: FC<SelectDrawerProps> = ({
  options,
  sections,
  isOpen,
  onClose,
  onChange,
  selected,
  setSelected,
}) => {
  const { colors } = useTheme();

  return (
    <BottomDrawer visible={isOpen} onClose={onClose}>
      <ScrollView
        contentContainerStyle={{
          paddingBottom: 120,
          paddingHorizontal: 16,
        }}
      >
        {sections && sections.length
          ? sections.map((section, sIdx) => (
              <View key={`section-${section.title}`}>
                <Text
                  style={{
                    fontSize: 14,
                    lineHeight: 18,
                    fontWeight: 600,
                    color: colors.gray['500'],
                    marginTop: sIdx === 0 ? 0 : 16,
                    marginBottom: 8,
                  }}
                >
                  {section.title}
                </Text>
                {section.options.map((option, index) => (
                  <SelectOption
                    key={`${section.title}-${option.value}`}
                    isSelected={option.value === selected}
                    isLast={section.options.length - 1 === index}
                    {...option}
                    onSelect={selectedValue => {
                      setSelected(selectedValue);
                      if (onChange) onChange(selectedValue);
                      if (onClose) onClose();
                    }}
                  />
                ))}
              </View>
            ))
          : (options || []).map((option, index) => (
              <SelectOption
                key={option.value}
                isSelected={option.value === selected}
                isLast={(options || []).length - 1 === index}
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
