import { FC } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '@/shared/theme';

export const MessageInput: FC = () => {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { backgroundColor: colors.gray['200'] }]}>
      <View style={[styles.inputWrapper, { paddingBottom: insets.bottom }]}>
        <TextInput
          style={styles.input}
          placeholderTextColor={colors.gray['500']}
          placeholder="Нажмите, чтобы написать сообщение"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  inputWrapper: {},
  input: {
    height: 82,
    paddingHorizontal: 28,
    fontSize: 14,
    fontWeight: 500,
  },
});
