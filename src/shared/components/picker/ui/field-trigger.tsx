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
            borderColor: error ? colors.error : colors.blue['350'],
          },
        ]}
        onPress={onOpen}
      >
        <Text style={[styles.value, { color: colors.primary }]}>{value}</Text>
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
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderStyle: 'solid',
  },
  label: {
    fontSize: 16,
    fontWeight: 600,
    marginBottom: 9,
  },
  value: {
    fontSize: 16,
    fontWeight: 600,
  },
  error: {
    fontSize: 12,
    fontWeight: 500,
    marginTop: 4,
    paddingHorizontal: 16,
  },
});
