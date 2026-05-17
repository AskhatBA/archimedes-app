import { FC, ReactNode } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  TouchableOpacityProps as NativeButtonProps,
  StyleProp,
  ViewStyle,
  ActivityIndicator,
  View,
} from 'react-native';

import { fonts, useTheme } from '@/shared/theme';

import { ButtonVariant, ButtonSize } from '../types';

interface ButtonProps extends NativeButtonProps {
  children: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  style?: StyleProp<ViewStyle>;
  isLoading?: boolean;
  icon?: ReactNode;
}

const SIZE_CONFIG: Record<
  ButtonSize,
  {
    paddingVertical: number;
    paddingHorizontal: number;
    fontSize: number;
    lineHeight: number;
    fontWeight: '600' | '700';
    gap: number;
  }
> = {
  sm: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '600',
    gap: 8,
  },
  md: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '700',
    gap: 10,
  },
  lg: {
    paddingVertical: 18,
    paddingHorizontal: 24,
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '700',
    gap: 12,
  },
};

export const Button: FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  style,
  isLoading,
  icon,
  disabled,
  ...props
}) => {
  const { colors } = useTheme();
  const isDisabled = disabled || isLoading;

  const variantStyle = (() => {
    if (variant === 'secondary') {
      return {
        background: isDisabled ? colors.gray['200'] : colors.blue['150'],
        text: isDisabled ? colors.gray['500'] : colors.blue['400'],
        borderColor: isDisabled ? colors.gray['250'] : colors.blue['200'],
        borderWidth: 1,
      };
    }
    return {
      background: isDisabled ? colors.gray['300'] : colors.blue['400'],
      text: isDisabled ? colors.gray['50'] : colors.white,
      borderColor: 'transparent',
      borderWidth: 0,
    };
  })();

  const sizing = SIZE_CONFIG[size];

  const shadowStyle =
    variant === 'primary' && !isDisabled
      ? {
          shadowColor: colors.blue['400'],
          shadowOpacity: 0.18,
          shadowRadius: 12,
          shadowOffset: { width: 0, height: 6 },
          elevation: 3,
        }
      : null;

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      disabled={isDisabled}
      {...props}
      style={[
        styles.container,
        {
          backgroundColor: variantStyle.background,
          borderColor: variantStyle.borderColor,
          borderWidth: variantStyle.borderWidth,
          paddingVertical: sizing.paddingVertical,
          paddingHorizontal: sizing.paddingHorizontal,
          gap: sizing.gap,
        },
        shadowStyle,
        style,
      ]}
    >
      {isLoading && (
        <ActivityIndicator color={variantStyle.text} size="small" />
      )}
      {!isLoading && icon && <View>{icon}</View>}
      <Text
        style={[
          styles.label,
          {
            color: variantStyle.text,
            fontSize: sizing.fontSize,
            lineHeight: sizing.lineHeight,
            fontWeight: sizing.fontWeight,
          },
        ]}
      >
        {children}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 100,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    textAlign: 'center',
    fontFamily: fonts.SFPro.Semibold,
    letterSpacing: 0.2,
  },
});
