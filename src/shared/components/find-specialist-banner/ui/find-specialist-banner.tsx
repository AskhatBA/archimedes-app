import { FC } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

import { useTheme } from '@/shared/theme';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const image = require('@/assets/images/home-banner-doctor.png');

export const FindSpecialistBanner: FC = () => {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: colors.orange['200'] }]}
    >
      <View style={styles.infoContainer}>
        <Text style={[styles.title, { color: colors.orange['600'] }]}>
          Подобрать специалиста
        </Text>
        <Text style={[styles.subtitle, { color: colors.orange['400'] }]}>
          Запишитесь на прием к подходящему врачу, используя ИИ
        </Text>
      </View>
      <Image source={image} resizeMode="contain" style={styles.image} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: 23,
  },
  infoContainer: {
    marginTop: 28,
    marginLeft: 21,
    flex: 1,
  },
  title: {
    fontWeight: 700,
    fontSize: 24,
    lineHeight: 25,
    letterSpacing: 0,
  },
  subtitle: {
    fontWeight: 500,
    fontSize: 14,
    lineHeight: 16,
    letterSpacing: 0,
    marginTop: 7,
  },
  image: {
    height: 154,
    flex: 1,
    marginTop: 9,
  },
});
