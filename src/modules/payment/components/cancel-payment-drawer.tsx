import { FC } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BottomDrawer } from '@/shared/components/bottom-drawer';
import { Button } from '@/shared/components/button';
import { InfoIcon } from '@/shared/icons';
import { useTranslation } from '@/shared/lib/i18n';
import { fonts, useTheme } from '@/shared/theme';

interface CancelPaymentDrawerProps {
  visible: boolean;
  /** Dismissing the sheet keeps the payment alive — the safe half of the choice. */
  onClose: () => void;
  onConfirm: () => void;
  isCancelling?: boolean;
  title: string;
  description: string;
  /** Wording of the destructive action; the flow decides what is being given up. */
  confirmLabel: string;
  /**
   * Wording of the safe action. Defaults to carrying on with the payment, which only
   * makes sense while the provider's page is still on screen — a flow reached from
   * elsewhere passes its own.
   */
  keepLabel?: string;
}

/** Fallback bottom inset for devices (or contexts) that report none. */
const MIN_BOTTOM_INSET = 24;

/**
 * Confirms giving up on a payment in progress.
 *
 * Carrying on is the primary button and cancelling is a plain text action: leaving the
 * payment page is usually a slip, and the sheet exists to make the accidental exit
 * recoverable — not to talk the payer out of anything.
 */
export const CancelPaymentDrawer: FC<CancelPaymentDrawerProps> = ({
  visible,
  onClose,
  onConfirm,
  isCancelling = false,
  title,
  description,
  confirmLabel,
  keepLabel,
}) => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  // The sheet renders through a portal, where the inset can come back as 0 even on a
  // device with a home indicator, leaving the last action flush against the edge.
  const bottomInset = Math.max(insets.bottom, MIN_BOTTOM_INSET);

  return (
    <BottomDrawer visible={visible} onClose={onClose}>
      <View style={[styles.content, { paddingBottom: bottomInset }]}>
        <View
          style={[styles.iconCircle, { backgroundColor: colors.gold['100'] }]}
        >
          <InfoIcon width={22} height={22} color={colors.gold['700']} />
        </View>

        <Text style={[styles.title, { color: colors.textMain }]}>{title}</Text>
        <Text style={[styles.description, { color: colors.gray['600'] }]}>
          {description}
        </Text>

        <Button
          onPress={onClose}
          disabled={isCancelling}
          style={styles.keepButton}
        >
          {keepLabel ?? t('payment:cancel.keep')}
        </Button>

        <TouchableOpacity
          onPress={onConfirm}
          disabled={isCancelling}
          style={styles.confirmButton}
        >
          <Text
            style={[
              styles.confirmLabel,
              { color: isCancelling ? colors.gray['500'] : colors.red['500'] },
            ]}
          >
            {isCancelling ? t('common:loading') : confirmLabel}
          </Text>
        </TouchableOpacity>
      </View>
    </BottomDrawer>
  );
};

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontFamily: fonts.SFPro.Bold,
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },
  description: {
    fontFamily: fonts.SFPro.Regular,
    marginTop: 8,
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
  keepButton: {
    alignSelf: 'stretch',
    marginTop: 24,
  },
  confirmButton: {
    marginTop: 8,
    paddingVertical: 14,
  },
  confirmLabel: {
    fontFamily: fonts.SFPro.Semibold,
    fontSize: 15,
    fontWeight: '600',
  },
});
