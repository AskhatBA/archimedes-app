import { FC } from 'react';
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
  ...props
}) => {
  const { colors } = useTheme();

  return (
    <View>
      {label && (
        <Text style={[styles.label, { color: colors.blue['370'] }]}>
          {label}
        </Text>
      )}
      <View
        style={[
          styles.container,
          { borderColor: error ? colors.error : colors.blue['350'] },
        ]}
      >
        {mask ? (
          <MaskedTextInput
            {...(props as MaskedTextInputProps)}
            placeholderTextColor={colors.blue['350']}
            mask={mask === 'currency' ? undefined : mask}
            type={mask === 'currency' ? mask : undefined}
            options={
              mask === 'currency'
                ? {
                    suffix: '₸',
                    decimalSeparator: '.',
                    precision: 0,
                  }
                : undefined
            }
            style={[
              styles.field,
              style,
              {
                color: colors.primary,
                fontWeight: 600,
              },
            ]}
          />
        ) : (
          <TextInput
            {...props}
            placeholderTextColor={colors.blue['350']}
            style={[
              styles.field,
              style,
              {
                color: colors.textMain,
                fontWeight: 600,
              },
            ]}
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
  container: {
    borderBottomWidth: 2,
    borderStyle: 'solid',
  },
  field: {
    paddingVertical: 16,
    fontSize: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: 600,
    marginBottom: 8,
  },
  error: {
    fontSize: 12,
    fontWeight: 500,
    marginTop: 4,
    paddingHorizontal: 16,
  },
});
