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
}

export const TextField: FC<TextFieldProps> = ({
  style,
  label,
  mask,
  ...props
}) => {
  const { colors } = useTheme();

  return (
    <View>
      {label && (
        <Text style={[styles.label, { color: colors.textMain }]}>{label}</Text>
      )}
      <View style={[styles.container, { borderColor: colors.gray['250'] }]}>
        {mask ? (
          <MaskedTextInput
            {...(props as MaskedTextInputProps)}
            mask={mask}
            style={[
              styles.field,
              style,
              { color: colors.textMain, fontWeight: 600 },
            ]}
          />
        ) : (
          <TextInput
            {...props}
            placeholderTextColor={colors.gray['250']}
            style={[
              styles.field,
              style,
              { color: colors.textMain, fontWeight: 600 },
            ]}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderStyle: 'solid',
    borderRadius: 15,
  },
  field: {
    padding: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: 600,
    marginBottom: 9,
  },
});
