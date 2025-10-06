import { FC, ReactNode } from 'react';
import { View, StyleSheet } from 'react-native';

import { CardRadioGroupProvider } from '../card-radio-group-context';

interface CardRadioGroupProps {
  children: ReactNode;
  onChange?: (value: string) => void;
  value?: string;
}

export const CardRadioGroup: FC<CardRadioGroupProps> = ({
  children,
  onChange,
  value,
}) => {
  return (
    <CardRadioGroupProvider value={value} onChange={onChange}>
      <View style={styles.container}>{children}</View>
    </CardRadioGroupProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 18,
  },
});
