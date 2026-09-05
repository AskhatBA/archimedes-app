import { FC } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BottomDrawer } from '@/shared/components/bottom-drawer';
import { Button } from '@/shared/components/button';
import { useTranslation } from '@/shared/lib/i18n';
import { colors, fonts } from '@/shared/theme';

interface TopupInfoDrawerProps {
  visible: boolean;
  onClose: () => void;
}

/** The three points the info sheet makes, in order. */
const POINT_KEYS = [
  'medAccount:info.points.network',
  'medAccount:info.points.noCard',
  'medAccount:info.points.priceList',
] as const;

/** What a medical account is and what topping it up buys — the "i" next to the title. */
export const TopupInfoDrawer: FC<TopupInfoDrawerProps> = ({
  visible,
  onClose,
}) => {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  return (
    <BottomDrawer visible={visible} onClose={onClose} scrollable>
      <View style={[styles.content, { paddingBottom: insets.bottom + 24 }]}>
        <Text style={styles.title}>{t('medAccount:info.title')}</Text>
        <Text style={styles.intro}>{t('medAccount:info.intro')}</Text>

        <View style={styles.points}>
          {POINT_KEYS.map(key => (
            <View key={key} style={styles.point}>
              <View style={styles.bullet} />
              <Text style={styles.pointText}>{t(key)}</Text>
            </View>
          ))}
        </View>

        <Button onPress={onClose}>{t('medAccount:info.close')}</Button>
      </View>
    </BottomDrawer>
  );
};

const styles = StyleSheet.create({
  content: {
    gap: 16,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  title: {
    fontSize: 20,
    lineHeight: 26,
    fontWeight: '700',
    fontFamily: fonts.SFPro.Bold,
    color: colors.blue['500'],
  },
  intro: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
    fontFamily: fonts.SFPro.Medium,
    color: colors.blue['370'],
  },
  points: {
    gap: 12,
  },
  point: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    // Nudged down onto the first line's optical centre rather than its top.
    marginTop: 7,
    backgroundColor: colors.blue['400'],
  },
  pointText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
    fontFamily: fonts.SFPro.Medium,
    color: colors.blue['500'],
  },
});
