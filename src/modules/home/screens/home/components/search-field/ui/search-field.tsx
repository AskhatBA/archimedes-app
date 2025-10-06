import { FC, useRef } from 'react';
import { View, TextInput, Pressable, StyleSheet } from 'react-native';

import { SearchIcon } from '@/shared/icons';
import { useTheme } from '@/shared/theme';

export const SearchField: FC = () => {
  const { colors } = useTheme();
  const inputRef = useRef(null);

  return (
    <Pressable onPress={() => inputRef.current?.focus()}>
      <View style={[styles.container, { backgroundColor: colors.gray['200'] }]}>
        <SearchIcon color={colors.gray['250']} />
        <TextInput
          ref={inputRef}
          style={styles.input}
          placeholder="Искать в Archimedes"
        />
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 15,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  input: {
    flex: 1,
    paddingLeft: 8,
  },
});
