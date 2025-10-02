import { FC } from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';

import { useTheme } from '@/shared/theme';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const image = require('@/assets/images/support.png');

export const SupportDetails: FC = () => {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <Image source={image} style={{ width: 279, height: 334 }} />
      <Text style={[styles.informationText, { color: colors.gray['500'] }]}>
        Служба поддержки работает круглосуточно
      </Text>
      <Text
        style={[
          styles.informationText,
          { color: colors.gray['500'], marginTop: 16 },
        ]}
      >
        Напишите нам свой запрос, по почте:
      </Text>
      <Text
        style={[
          styles.informationText,
          { color: colors.gray['500'], marginTop: 4 },
        ]}
      >
        archimedes.medical.group.kaz@gmail.com
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  informationText: {
    fontSize: 16,
    fontWeight: 500,
    textAlign: 'center',
  },
});
