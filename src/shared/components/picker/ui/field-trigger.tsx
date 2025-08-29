import { FC } from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

import { useTheme } from '@/shared/theme';

interface FieldTriggerProps {
  onOpen: () => void;
  value?: string;
  error?: string;
}

export const FieldTrigger: FC<FieldTriggerProps> = ({
  onOpen,
  value,
  error,
}) => {
  const { colors } = useTheme();

  return (
    <>
      <TouchableOpacity
        style={[
          styles.trigger,
          {
            backgroundColor: colors.white,
            borderColor: error ? colors.error : colors.gray['250'],
          },
        ]}
        onPress={onOpen}
      >
        <Text style={[styles.value, { color: colors.textMain }]}>{value}</Text>
      </TouchableOpacity>
      {error && (
        <Text style={[styles.error, { color: colors.error }]}>{error}</Text>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 15,
    padding: 18,
    borderWidth: 1,
    borderStyle: 'solid',
  },
  label: {
    fontSize: 14,
    fontWeight: 600,
    marginBottom: 9,
  },
  value: {
    fontSize: 14,
    fontWeight: 500,
  },
  error: {
    fontSize: 12,
    fontWeight: 500,
    marginTop: 4,
    paddingHorizontal: 16,
  },
});
