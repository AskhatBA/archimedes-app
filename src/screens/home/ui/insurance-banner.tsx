import { FC } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

import { ShieldPlusIcon } from '@/shared/icons';
import { routes, useNavigation } from '@/shared/navigation';
import { colors, fonts } from '@/shared/theme';

export const InsuranceBanner: FC = () => {
  const { navigate } = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.infoContainer}>
        <Text style={styles.title}>Оформить{'\n'}страхование онлайн</Text>
        <Text style={styles.subtitle}>С кешбэком до 29%</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigate(routes.Programs)}
          activeOpacity={0.85}
        >
          <Text style={styles.buttonText}>Оформить</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.iconContainer}>
        <ShieldPlusIcon width={92} height={92} color={colors.blue['500']} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.blue['150'],
    borderRadius: 24,
    padding: 20,
    overflow: 'hidden',
  },
  infoContainer: {
    flex: 1,
    gap: 6,
  },
  title: {
    fontSize: 20,
    lineHeight: 24,
    fontWeight: '700',
    fontFamily: fonts.SFPro.Bold,
    color: colors.blue['500'],
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 18,
    color: colors.blue['400'],
    fontFamily: fonts.SFPro.Medium,
    fontWeight: '500',
  },
  button: {
    marginTop: 12,
    alignSelf: 'flex-start',
    backgroundColor: colors.white,
    paddingHorizontal: 22,
    paddingVertical: 10,
    borderRadius: 999,
  },
  buttonText: {
    fontSize: 14,
    lineHeight: 18,
    color: colors.blue['500'],
    fontFamily: fonts.SFPro.Semibold,
    fontWeight: '600',
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 100,
  },
});
