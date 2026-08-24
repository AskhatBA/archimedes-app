import { FC } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { FolderPlusIcon } from '@/shared/icons';
import { useTranslation } from '@/shared/lib/i18n';
import { routes, useNavigation } from '@/shared/navigation';
import { colors, fonts } from '@/shared/theme';

export const PaidProgramsBanner: FC = () => {
  const { t } = useTranslation();
  const { navigate } = useNavigation();

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      style={styles.container}
      onPress={() => navigate(routes.PaidPrograms)}
    >
      <View style={styles.iconBadge}>
        <FolderPlusIcon width={24} height={24} color={colors.white} />
      </View>
      <View style={styles.textBlock}>
        <Text style={styles.title}>{t('home:paidProgramsTitle')}</Text>
        <Text style={styles.subtitle}>{t('home:paidProgramsSubtitle')}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: colors.blue['500'],
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  iconBadge: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.blue['400'],
  },
  textBlock: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontSize: 17,
    lineHeight: 22,
    fontWeight: '700',
    fontFamily: fonts.SFPro.Bold,
    color: colors.white,
  },
  subtitle: {
    fontSize: 12,
    lineHeight: 16,
    fontFamily: fonts.SFPro.Regular,
    color: colors.blue['200'],
  },
});
