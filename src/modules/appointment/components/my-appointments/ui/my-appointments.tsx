import { FC } from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { useTranslation } from '@/shared/lib/i18n';
import { useTheme } from '@/shared/theme';

import { Appointments } from './appointments';

export const MyAppointments: FC = () => {
  const { colors } = useTheme();
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <View style={styles.heading}>
        <Text style={[styles.title, { color: colors.gray['700'] }]}>
          {t('appointments:upcomingTitle')}
        </Text>
      </View>
      <View style={styles.appointments}>
        <Appointments mode="upcoming" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
    marginHorizontal: -16,
  },
  heading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontWeight: '700',
    fontSize: 18,
    lineHeight: 22,
  },
  appointments: {
    marginTop: 16,
  },
});
