import { FC } from 'react';
import {
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { PhoneIcon } from '@/shared/icons';
import { useTranslation } from '@/shared/lib/i18n';
import { useCallCenterPhone } from '@/shared/lib/insurance';
import { colors, fonts } from '@/shared/theme';

export const CallCenterCard: FC = () => {
  const { t } = useTranslation();
  const phone = useCallCenterPhone();

  const callCallCenter = () => {
    Linking.openURL(`tel:${phone}`).catch(() => {});
  };

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={callCallCenter}
      style={styles.card}
      accessibilityRole="button"
      accessibilityLabel={t('programs:details.callCenter.title')}
    >
      <View style={styles.iconBadge}>
        <PhoneIcon width={24} height={24} color={colors.blue['400']} />
      </View>
      <View style={styles.textBlock}>
        <Text style={styles.title}>
          {t('programs:details.callCenter.title')}
        </Text>
        <Text style={styles.subtitle} numberOfLines={1} ellipsizeMode="tail">
          {t('programs:details.callCenter.subtitle')}
        </Text>
      </View>
      <View style={styles.numberPill}>
        <Text style={styles.number}>{phone}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.blue['100'],
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.blue['200'],
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  iconBadge: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    shadowColor: colors.blue['500'],
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  textBlock: {
    flex: 1,
  },
  title: {
    fontSize: 17,
    lineHeight: 22,
    fontWeight: '700',
    fontFamily: fonts.SFPro.Bold,
    color: colors.blue['500'],
  },
  subtitle: {
    fontSize: 12,
    lineHeight: 16,
    marginTop: 2,
    fontWeight: '500',
    fontFamily: fonts.SFPro.Medium,
    color: colors.blue['370'],
  },
  numberPill: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.blue['200'],
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  number: {
    fontSize: 16,
    lineHeight: 18,
    fontWeight: '700',
    fontFamily: fonts.SFPro.Bold,
    color: colors.blue['500'],
    fontVariant: ['tabular-nums'],
  },
});
