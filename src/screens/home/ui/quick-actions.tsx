import { FC, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';

import { SelectCaretIcon, StethoscopeIcon } from '@/shared/icons';
import { useTranslation } from '@/shared/lib/i18n';
import { routes, useNavigation } from '@/shared/navigation';
import { colors, fonts } from '@/shared/theme';

export const QuickActions: FC = () => {
  const { navigate } = useNavigation();
  const { t } = useTranslation();
  const scale = useRef(new Animated.Value(1)).current;

  const animateTo = (value: number) =>
    Animated.spring(scale, {
      toValue: value,
      useNativeDriver: true,
      speed: 40,
      bounciness: 4,
    }).start();

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <Pressable
        style={styles.card}
        onPressIn={() => animateTo(0.97)}
        onPressOut={() => animateTo(1)}
        onPress={() => navigate(routes.CreateAppointment)}
        accessibilityRole="button"
        accessibilityLabel={t('home:bookAppointment')}
      >
        <View style={styles.content}>
          <View style={styles.iconBadge}>
            <StethoscopeIcon
              width={28}
              height={28}
              color={colors.blue['400']}
            />
          </View>

          <View style={styles.textBlock}>
            <Text style={styles.title}>{t('home:bookAppointment')}</Text>
            <Text style={styles.subtitle}>
              {t('home:bookAppointmentSubtitle')}
            </Text>
          </View>

          <View style={styles.arrowButton}>
            <View style={styles.arrowIcon}>
              <SelectCaretIcon width={14} height={14} color={colors.white} />
            </View>
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.blue['100'],
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.blue['200'],
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingHorizontal: 16,
    paddingVertical: 18,
  },
  iconBadge: {
    width: 56,
    height: 56,
    borderRadius: 18,
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
    fontSize: 18,
    lineHeight: 22,
    fontWeight: '700',
    fontFamily: fonts.SFPro.Bold,
    color: colors.blue['500'],
  },
  subtitle: {
    fontSize: 13,
    lineHeight: 17,
    marginTop: 4,
    fontWeight: '500',
    fontFamily: fonts.SFPro.Medium,
    color: colors.blue['370'],
  },
  arrowButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.blue['500'],
  },
  arrowIcon: {
    transform: [{ rotate: '-90deg' }],
  },
});
