import { FC } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';

import { useTheme } from '@/shared/theme';

interface RadioProps {
  onChange?: (value: string) => void;
  value?: string;
  checked?: boolean;
}

export const Radio: FC<RadioProps> = ({ onChange, value, checked }) => {
  const { colors } = useTheme();

  return (
    <Pressable
      onPress={() => {
        if (onChange) onChange(value);
      }}
    >
      <View
        style={[
          styles.indicatorContainer,
          { borderColor: checked ? colors.blue['400'] : colors.gray['500'] },
        ]}
      >
        {checked && (
          <View
            style={[styles.indicator, { backgroundColor: colors.blue['400'] }]}
          />
        )}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  indicatorContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 21,
    height: 21,
    borderWidth: 1,
    borderStyle: 'solid',
    borderRadius: 21,
  },
  indicator: {
    width: 11,
    height: 11,
    borderRadius: 11,
  },
});
