import { FC } from 'react';
import { StyleSheet, Text, View } from 'react-native';

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
  emptyText?: string;
}

export const SelectDrawer: FC<SelectDrawerProps> = ({
  options,
  sections,
  isOpen,
  onClose,
  onChange,
  selected,
  setSelected,
  emptyText = 'Список пуст',
}) => {
  const { colors } = useTheme();

  const hasSections = !!sections?.some(section => section.options.length);
  const hasOptions = !!options?.length;
  const isEmpty = !hasSections && !hasOptions;

  const renderContent = () => {
    if (isEmpty) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, { color: colors.gray['500'] }]}>
            {emptyText}
          </Text>
        </View>
      );
    }

    if (sections && sections.length) {
      return sections.map((section, sIdx) => (
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
      ));
    }

    return (options || []).map((option, index) => (
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
    ));
  };

  return (
    <BottomDrawer visible={isOpen} onClose={onClose} scrollable>
      <View style={styles.container}>{renderContent()}</View>
    </BottomDrawer>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 120,
    paddingHorizontal: 16,
  },
  emptyContainer: {
    paddingVertical: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '500',
    textAlign: 'center',
  },
});
