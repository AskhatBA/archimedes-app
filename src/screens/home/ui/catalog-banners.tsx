import { FC, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';

import { CATEGORY_LABEL_KEYS } from '@/modules/paid-programs';
import { ClipboardListIcon, ShieldPlusIcon } from '@/shared/icons';
import { useTranslation } from '@/shared/lib/i18n';
import { routes, useNavigation } from '@/shared/navigation';
import { colors, fonts } from '@/shared/theme';

import type { Routes } from '@/shared/navigation/types';
import type { SvgProps } from 'react-native-svg';

interface CatalogCardProps {
  icon: FC<SvgProps>;
  title: string;
  subtitle: string;
  route: Routes;
}

const CatalogCard: FC<CatalogCardProps> = ({
  icon: Icon,
  title,
  subtitle,
  route,
}) => {
  const { navigate } = useNavigation();
  const scale = useRef(new Animated.Value(1)).current;

  const animateTo = (value: number) =>
    Animated.spring(scale, {
      toValue: value,
      useNativeDriver: true,
      speed: 40,
      bounciness: 4,
    }).start();

  return (
    <Animated.View style={[styles.cardWrapper, { transform: [{ scale }] }]}>
      <Pressable
        style={styles.card}
        onPressIn={() => animateTo(0.97)}
        onPressOut={() => animateTo(1)}
        onPress={() => navigate(route)}
        accessibilityRole="button"
        accessibilityLabel={title}
      >
        <View style={styles.iconBadge}>
          <Icon width={24} height={24} color={colors.blue['400']} />
        </View>

        <View style={styles.textBlock}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>
      </Pressable>
    </Animated.View>
  );
};

/**
 * The two paid catalogues, side by side. They were one banner behind a tab switcher —
 * a check-up is a different purchase from a yearly med plan, so each gets its own way in.
 */
export const CatalogBanners: FC = () => {
  const { t } = useTranslation();

  return (
    <View style={styles.row}>
      <CatalogCard
        icon={ShieldPlusIcon}
        title={t(CATEGORY_LABEL_KEYS.MED_PLAN)}
        subtitle={t('home:medPlansSubtitle')}
        route={routes.PaidPrograms}
      />
      <CatalogCard
        icon={ClipboardListIcon}
        title={t(CATEGORY_LABEL_KEYS.CHECKUP)}
        subtitle={t('home:checkupsSubtitle')}
        route={routes.Checkups}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  // Equal halves rather than content-sized: the two catalogues are siblings, and the
  // titles differ in length in every locale. The scale animation lives on the wrapper so
  // the card itself keeps the row's own sizing.
  cardWrapper: {
    flex: 1,
  },
  card: {
    flex: 1,
    gap: 12,
    backgroundColor: colors.blue['100'],
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.blue['200'],
    paddingHorizontal: 14,
    paddingVertical: 16,
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
    gap: 2,
  },
  title: {
    fontSize: 16,
    lineHeight: 20,
    fontWeight: '700',
    fontFamily: fonts.SFPro.Bold,
    color: colors.blue['500'],
  },
  subtitle: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '500',
    fontFamily: fonts.SFPro.Medium,
    color: colors.blue['370'],
  },
});
