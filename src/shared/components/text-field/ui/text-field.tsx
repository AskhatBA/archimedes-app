import { FC, useState } from 'react';
import {
  TextInput,
  View,
  Text,
  StyleSheet,
  TextInputProps,
} from 'react-native';
import { MaskedTextInput, MaskedTextInputProps } from 'react-native-mask-text';

import { useTheme } from '@/shared/theme';

interface TextFieldProps extends TextInputProps {
  label?: string;
  mask?: string;
  error?: string;
}

export const TextField: FC<TextFieldProps> = ({
  style,
  label,
  mask,
  error,
  onFocus,
  onBlur,
  value,
  ...props
}) => {
  const { colors } = useTheme();
  const [focused, setFocused] = useState(false);

  const hasValue = !!value || !!props.defaultValue;

  const containerBg = () => {
    if (error) return colors.red['100'];
    if (focused || hasValue) return colors.blue['100'];
    return colors.gray['200'];
  };

  const borderColor = () => {
    if (error) return colors.error;
    if (focused) return colors.blue['400'];
    if (hasValue) return colors.blue['350'];
    return colors.gray['250'];
  };

  const textColor = () => {
    if (error) return colors.error;
    if (focused || hasValue) return colors.blue['400'];
    return colors.gray['500'];
  };

  const inputStyle = [
    styles.field,
    style,
    { color: textColor(), fontWeight: '600' as const },
  ];

  const handleFocus: TextInputProps['onFocus'] = e => {
    setFocused(true);
    onFocus?.(e);
  };

  const handleBlur: TextInputProps['onBlur'] = e => {
    setFocused(false);
    onBlur?.(e);
  };

  return (
    <View style={styles.wrapper}>
      {label && (
        <Text style={[styles.label, { color: colors.blue['370'] }]}>
          {label}
        </Text>
      )}
      <View style={[styles.container, { backgroundColor: containerBg(), borderColor: borderColor() }]}>
        {mask ? (
          <MaskedTextInput
            {...(props as MaskedTextInputProps)}
            value={value}
            placeholderTextColor={colors.blue['350']}
            mask={mask === 'currency' ? undefined : mask}
            type={mask === 'currency' ? mask : undefined}
            options={
              mask === 'currency'
                ? { suffix: '₸', decimalSeparator: '.', precision: 0 }
                : undefined
            }
            onFocus={handleFocus}
            onBlur={handleBlur}
            style={inputStyle}
          />
        ) : (
          <TextInput
            {...props}
            value={value}
            placeholderTextColor={colors.blue['350']}
            onFocus={handleFocus}
            onBlur={handleBlur}
            style={inputStyle}
          />
        )}
      </View>
      {error && (
        <Text style={[styles.error, { color: colors.error }]}>{error}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    gap: 8,
  },
  container: {
    borderRadius: 15,
    borderWidth: 1.5,
    paddingHorizontal: 18,
  },
  field: {
    paddingVertical: 16,
    fontSize: 18,
    lineHeight: 22,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
  },
  error: {
    fontSize: 12,
    fontWeight: '500',
    paddingHorizontal: 4,
  },
});
