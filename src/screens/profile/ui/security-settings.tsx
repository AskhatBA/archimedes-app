import { FC, useState } from 'react';
import { StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';

import { useAuth } from '@/shared/lib/auth';
import { useTranslation } from '@/shared/lib/i18n';
import { useToast } from '@/shared/lib/toast';
import { routes, useNavigation } from '@/shared/navigation';
import { colors, fonts } from '@/shared/theme';

export const SecuritySettings: FC = () => {
  const { biometricEnabled, enableBiometric, disableBiometric } = useAuth();
  const { showToast } = useToast();
  const { navigate } = useNavigation();
  const { t } = useTranslation();
  const [isToggling, setIsToggling] = useState(false);

  const handleToggle = async (value: boolean) => {
    setIsToggling(true);
    try {
      if (value) {
        const ok = await enableBiometric();
        if (!ok) {
          showToast({
            type: 'error',
            message: t('profile:security.biometricUnavailable'),
          });
        }
      } else {
        await disableBiometric();
      }
    } finally {
      setIsToggling(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.eyebrow}>{t('profile:security.eyebrow')}</Text>

      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.label}>{t('profile:security.biometric')}</Text>
          <Switch
            value={biometricEnabled}
            disabled={isToggling}
            onValueChange={handleToggle}
            trackColor={{ false: colors.gray[300], true: colors.blue[350] }}
            thumbColor={biometricEnabled ? colors.blue[500] : colors.gray[50]}
            style={{ marginRight: 8 }}
          />
        </View>

        <View style={styles.divider} />

        <TouchableOpacity
          activeOpacity={0.85}
          style={styles.row}
          onPress={() => navigate(routes.SetPin)}
        >
          <Text style={styles.label}>{t('profile:security.pin')}</Text>
          <Text style={styles.action}>{t('profile:security.change')}</Text>
        </TouchableOpacity>

        <View style={styles.divider} />

        <TouchableOpacity
          activeOpacity={0.85}
          style={styles.row}
          onPress={() => navigate(routes.SessionHistory)}
        >
          <Text style={styles.label}>{t('profile:security.sessionHistory')}</Text>
          <Text style={styles.action}>{t('profile:security.open')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 10,
  },
  eyebrow: {
    fontSize: 11,
    fontFamily: fonts.SFPro.Semibold,
    color: colors.gray[500],
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    paddingHorizontal: 4,
  },
  card: {
    backgroundColor: colors.gray[200],
    borderRadius: 14,
    paddingHorizontal: 14,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
  },
  divider: {
    height: 1,
    backgroundColor: colors.gray[250],
  },
  label: {
    fontSize: 14,
    fontFamily: fonts.SFPro.Semibold,
    color: colors.gray[700],
  },
  action: {
    fontSize: 14,
    fontFamily: fonts.SFPro.Semibold,
    color: colors.blue[500],
  },
});
