import { FC, useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BottomDrawer } from '@/shared/components/bottom-drawer';
import { Button } from '@/shared/components/button';
import { Checkbox } from '@/shared/components/checkbox';
import { publicOfferFileFor } from '@/shared/constants';
import { FileTextIcon, SelectCaretIcon, ShieldPlusIcon } from '@/shared/icons';
import { useLanguage, useTranslation } from '@/shared/lib/i18n';
import { routes, useNavigation } from '@/shared/navigation';
import { colors, fonts } from '@/shared/theme';

interface PublicOfferDrawerProps {
  visible: boolean;
  onClose: () => void;
  /** Called once the patient has ticked the box and confirmed. */
  onAccept: () => void;
  isSubmitting?: boolean;
}

/** Fallback bottom inset for devices (or contexts) that report none. */
const MIN_BOTTOM_INSET = 24;

/** Breathing room between the confirm button and the bottom edge of the sheet. */
const BOTTOM_SPACING = 16;

/** Short extracts shown in the drawer; the full text lives in the linked document. */
const SUMMARY_KEYS = [
  'appointments:create.offer.points.priceList',
  'appointments:create.offer.points.confidentiality',
] as const;

/**
 * Public offer a paid patient accepts before checkout.
 *
 * Only shown for patients without an insurance programme — an insured visit is covered
 * by their programme's own terms, so nothing is charged and nothing is accepted here.
 */
export const PublicOfferDrawer: FC<PublicOfferDrawerProps> = ({
  visible,
  onClose,
  onAccept,
  isSubmitting = false,
}) => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const { navigate } = useNavigation();
  const insets = useSafeAreaInsets();
  const [accepted, setAccepted] = useState(false);

  // The sheet is rendered through a portal, where the safe-area inset can come back as 0
  // even on a device with a home indicator — hence the floor. Without it the confirm
  // button ends up flush against the bottom edge of the sheet.
  const bottomInset = Math.max(insets.bottom, MIN_BOTTOM_INSET);

  // A fresh consent every time: the previous tick belongs to the previous booking.
  useEffect(() => {
    if (!visible) setAccepted(false);
  }, [visible]);

  /**
   * The document opens as a full screen, so the sheet steps aside instead of staying
   * behind it — coming back from the document lands on the form, not on a stale drawer.
   *
   * The offer is a .docx, which Android's WebView cannot render on its own, so the
   * viewer is asked to wrap it in its document renderer instead of loading the URL raw.
   */
  const openDocument = () => {
    onClose();
    navigate(routes.DocumentViewer, {
      uri: publicOfferFileFor(language),
      isOnlyUrl: false,
    });
  };

  return (
    <BottomDrawer visible={visible} onClose={onClose} scrollable>
      <View
        style={[
          styles.content,
          { paddingBottom: bottomInset + BOTTOM_SPACING },
        ]}
      >
        <View style={styles.header}>
          <View style={styles.badge}>
            <ShieldPlusIcon width={24} height={24} color={colors.blue['400']} />
          </View>
          <Text style={styles.title}>
            {t('appointments:create.offer.title')}
          </Text>
        </View>

        <Text style={styles.intro}>{t('appointments:create.offer.intro')}</Text>

        <View style={styles.points}>
          {SUMMARY_KEYS.map(key => (
            <View key={key} style={styles.pointRow}>
              <View style={styles.bullet} />
              <Text style={styles.pointText}>{t(key)}</Text>
            </View>
          ))}

          <View style={styles.warning}>
            <Text style={styles.warningText}>
              <Text style={styles.warningLabel}>
                {t('appointments:create.offer.points.noShowLabel')}
              </Text>
              {t('appointments:create.offer.points.noShow')}
            </Text>
          </View>

          <View style={styles.pointRow}>
            <View style={styles.bullet} />
            <Text style={styles.pointText}>
              {t('appointments:create.offer.points.termination')}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.documentCard}
          onPress={openDocument}
        >
          <FileTextIcon width={20} height={20} color={colors.blue['400']} />
          <Text style={styles.documentText}>
            {t('appointments:create.offer.document')}
          </Text>
          <View style={styles.documentCaret}>
            <SelectCaretIcon color={colors.blue['400']} />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.agreeRow}
          onPress={() => setAccepted(current => !current)}
        >
          <Checkbox checked={accepted} onCheck={setAccepted} />
          <Text style={styles.agreeText}>
            {t('appointments:create.offer.agree')}
          </Text>
        </TouchableOpacity>

        <Button
          disabled={!accepted}
          isLoading={isSubmitting}
          onPress={onAccept}
        >
          {t('appointments:create.offer.submit')}
        </Button>
      </View>
    </BottomDrawer>
  );
};

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 16,
    gap: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  badge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.blue['150'],
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    flex: 1,
    fontSize: 20,
    lineHeight: 26,
    fontWeight: '700',
    fontFamily: fonts.SFPro.Bold,
    color: colors.textMain,
  },
  intro: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: fonts.SFPro.Regular,
    color: colors.gray['600'],
  },
  points: {
    gap: 10,
  },
  pointRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 7,
    backgroundColor: colors.blue['400'],
  },
  pointText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    fontFamily: fonts.SFPro.Regular,
    color: colors.textMain,
  },
  warning: {
    backgroundColor: colors.gold['50'],
    borderWidth: 1,
    borderColor: colors.gold['300'],
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  warningText: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: fonts.SFPro.Regular,
    color: colors.gold['700'],
  },
  warningLabel: {
    fontWeight: '700',
    fontFamily: fonts.SFPro.Bold,
  },
  documentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.blue['100'],
    borderWidth: 1,
    borderColor: colors.blue['200'],
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  documentText: {
    flex: 1,
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '600',
    fontFamily: fonts.SFPro.Semibold,
    color: colors.blue['400'],
  },
  documentCaret: {
    transform: [{ rotate: '-90deg' }],
  },
  agreeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  agreeText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    fontFamily: fonts.SFPro.Regular,
    color: colors.textMain,
  },
});
