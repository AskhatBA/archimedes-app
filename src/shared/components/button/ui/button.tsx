import { FC } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  TouchableOpacityProps as NativeButtonProps,
  StyleProp,
  ViewStyle,
  ActivityIndicator,
} from 'react-native';

import { useTheme } from '@/shared/theme';

import { ButtonVariant, ButtonSize } from '../types';

interface ButtonProps extends NativeButtonProps {
  children: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  style?: StyleProp<ViewStyle>;
  isLoading?: boolean;
}

export const Button: FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  style,
  isLoading,
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
      disabled={isLoading}
      {...props}
      style={[
        styles.containerPrimary,
        { backgroundColor: background[variant] },
        style,
      ]}
    >
      {isLoading && (
        <ActivityIndicator color={fontColor[variant]} size="small" />
      )}
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    justifyContent: 'center',
  },
  primaryText: {
    fontWeight: 700,
    lineHeight: 22,
    textAlign: 'center',
  },
});
