import { FC } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  TouchableOpacityProps as NativeButtonProps,
} from 'react-native';

import { useTheme } from '@/shared/theme';

import { ButtonVariant, ButtonSize } from '../types';

interface ButtonProps extends NativeButtonProps {
  children: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export const Button: FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  ...props
}) => {
  const { colors } = useTheme();

  const background = {
    primary: colors.blue['400'],
    secondary: colors.blue['150'],
  };

  const fontColor = {
    primary: colors.blue['100'],
    secondary: colors.blue['400'],
  };

  const fontSize = {
    sm: 14,
    md: 18,
  };

  const fontWeight = {
    sm: 600,
    md: 700,
  };

  return (
    <TouchableOpacity
      {...props}
      style={[
        styles.containerPrimary,
        { backgroundColor: background[variant] },
      ]}
    >
      <Text
        style={[
          styles.primaryText,
          {
            color: fontColor[variant],
            fontSize: fontSize[size],
            fontWeight: fontWeight[size],
          },
        ]}
      >
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
    lineHeight: 22,
    textAlign: 'center',
  },
});
