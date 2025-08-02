import { FC } from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

import { useTheme } from '@/shared/theme';

import { ButtonVariant } from '../types';

interface ButtonProps {
  children: string;
  variant?: ButtonVariant;
}

export const Button: FC<ButtonProps> = ({ children, variant = 'primary' }) => {
  const { colors } = useTheme();

  const background = {
    primary: colors.blue['400'],
  };

  return (
    <TouchableOpacity
      style={[
        styles.containerPrimary,
        { backgroundColor: background[variant] },
      ]}
    >
      <Text style={[styles.primaryText, { color: colors.blue['100'] }]}>
        {children}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  containerPrimary: {
    borderRadius: 100,
    paddingVertical: 16,
  },
  primaryText: {
    fontWeight: 700,
    fontSize: 18,
    lineHeight: 22,
    textAlign: 'center',
  },
});
