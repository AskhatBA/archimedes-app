import { FC } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { APPOINTMENT_CANCELLATION_ERRORS } from '@/api';
import { formatPrice } from '@/modules/paid-programs/lib/format-price';
import { BottomDrawer } from '@/shared/components/bottom-drawer';
import { Button } from '@/shared/components/button';
import { InfoIcon, WalletIcon } from '@/shared/icons';
import { formatDate } from '@/shared/lib/date';
import { useTranslation } from '@/shared/lib/i18n';
import { fonts, useTheme } from '@/shared/theme';

import {
  cancellationErrorCode,
  useCancellationPreview,
} from '../../../hooks/use-appointment-cancellation';

interface CancelAppointmentDrawerProps {
  visible: boolean;
  /** Dismissing keeps the appointment — the safe half of the choice. */
  onClose: () => void;
  onConfirm: () => void;
  /** Our appointment id or the MIS id the list knows the visit by; both work. */
  appointmentId: string;
  isCancelling?: boolean;
}

/** Fallback bottom inset for devices (or contexts) that report none. */
const MIN_BOTTOM_INSET = 24;

/** Which "cannot cancel this" wording a refused preview gets. */
const REFUSAL_KEYS: Record<string, string> = {
  [APPOINTMENT_CANCELLATION_ERRORS.alreadyStarted]:
    'appointments:cancel.errorAlreadyStarted',
  [APPOINTMENT_CANCELLATION_ERRORS.notCancellable]:
    'appointments:cancel.errorNotCancellable',
  [APPOINTMENT_CANCELLATION_ERRORS.notFound]:
    'appointments:cancel.errorNotFound',
};

/**
 * Confirms cancelling a visit, and says what it costs first.
 *
 * The money is the reason this is a sheet rather than an alert: a paid visit cancelled
 * less than twelve hours ahead only refunds 70%, and that has to be on screen *before*
 * the tap, not in the receipt afterwards. The figures are the backend's own — the split
 * moves with the clock, so it is read when the sheet opens rather than computed here.
 *
 * Keeping the appointment is the primary button and cancelling is a plain text action:
 * this sheet exists to make a destructive tap deliberate, not to push it.
 */
export const CancelAppointmentDrawer: FC<CancelAppointmentDrawerProps> = ({
  visible,
  onClose,
  onConfirm,
  appointmentId,
  isCancelling = false,
}) => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  const { preview, isPreviewLoading, previewError } = useCancellationPreview(
    appointmentId,
    visible,
  );

  // The sheet renders through a portal, where the inset can come back as 0 even on a
  // device with a home indicator, leaving the last action flush against the edge.
  const bottomInset = Math.max(insets.bottom, MIN_BOTTOM_INSET);

  const refusalKey = previewError
    ? (REFUSAL_KEYS[cancellationErrorCode(previewError) ?? ''] ??
      'appointments:cancel.errorPreview')
    : null;

  const refund = preview?.refund ?? null;
  const isPartialRefund = Boolean(refund && refund.refundPercent < 100);

  const renderBody = () => {
    if (isPreviewLoading) {
      return (
        <View style={styles.loader}>
          <ActivityIndicator color={colors.primary} />
        </View>
      );
    }

    if (refusalKey) {
      return (
        <Text style={[styles.description, { color: colors.gray['600'] }]}>
          {t(refusalKey)}
        </Text>
      );
    }

    // Booked through an insurance programme: the insurer paid, so there is nothing to
    // return and nothing to warn about beyond losing the slot.
    if (!refund) {
      return (
        <Text style={[styles.description, { color: colors.gray['600'] }]}>
          {t('appointments:cancel.programDescription')}
        </Text>
      );
    }

    return (
      <>
        <Text style={[styles.description, { color: colors.gray['600'] }]}>
          {isPartialRefund
            ? t('appointments:cancel.lateDescription', {
                percent: 100 - refund.refundPercent,
              })
            : t('appointments:cancel.fullDescription', {
                date: formatDate(
                  refund.freeCancellationUntil,
                  'DD MMMM, HH:mm',
                ),
              })}
        </Text>

        <View
          style={[
            styles.breakdown,
            {
              backgroundColor: isPartialRefund
                ? colors.orange['200']
                : colors.green['100'],
            },
          ]}
        >
          <View style={styles.breakdownRow}>
            <Text
              style={[styles.breakdownLabel, { color: colors.gray['600'] }]}
            >
              {t('appointments:cancel.paidLabel')}
            </Text>
            <Text
              style={[styles.breakdownValue, { color: colors.gray['600'] }]}
            >
              {formatPrice(refund.paidAmount)}
            </Text>
          </View>

          {isPartialRefund && (
            <View style={styles.breakdownRow}>
              <Text
                style={[styles.breakdownLabel, { color: colors.orange['600'] }]}
              >
                {t('appointments:cancel.feeLabel', {
                  percent: 100 - refund.refundPercent,
                })}
              </Text>
              <Text
                style={[styles.breakdownValue, { color: colors.orange['600'] }]}
              >
                −{formatPrice(refund.feeAmount)}
              </Text>
            </View>
          )}

          <View style={[styles.breakdownRow, styles.totalRow]}>
            <View style={styles.totalLabel}>
              <WalletIcon
                width={18}
                height={18}
                color={
                  isPartialRefund ? colors.orange['600'] : colors.green['600']
                }
              />
              <Text
                style={[
                  styles.totalText,
                  {
                    color: isPartialRefund
                      ? colors.orange['600']
                      : colors.green['600'],
                  },
                ]}
              >
                {t('appointments:cancel.refundLabel')}
              </Text>
            </View>
            <Text
              style={[
                styles.totalValue,
                {
                  color: isPartialRefund
                    ? colors.orange['600']
                    : colors.green['600'],
                },
              ]}
            >
              {formatPrice(refund.amount)}
            </Text>
          </View>
        </View>

        {/* The reversal is queued for the provider, not done — promising otherwise here
            would be a lie the card statement takes days to correct. */}
        <Text style={[styles.note, { color: colors.gray['500'] }]}>
          {t('appointments:cancel.refundNote')}
        </Text>
      </>
    );
  };

  const canConfirm = !isPreviewLoading && !refusalKey && !isCancelling;

  return (
    <BottomDrawer visible={visible} onClose={onClose}>
      <View style={[styles.content, { paddingBottom: bottomInset }]}>
        <View
          style={[styles.iconCircle, { backgroundColor: colors.gold['100'] }]}
        >
          <InfoIcon width={22} height={22} color={colors.gold['700']} />
        </View>

        <Text style={[styles.title, { color: colors.textMain }]}>
          {t('appointments:cancel.title')}
        </Text>

        {renderBody()}

        <Button
          onPress={onClose}
          disabled={isCancelling}
          style={styles.keepButton}
        >
          {refusalKey ? t('common:close') : t('appointments:cancel.keep')}
        </Button>

        {!refusalKey && (
          <TouchableOpacity
            onPress={onConfirm}
            disabled={!canConfirm}
            style={styles.confirmButton}
          >
            <Text
              style={[
                styles.confirmLabel,
                { color: canConfirm ? colors.red['500'] : colors.gray['500'] },
              ]}
            >
              {isCancelling
                ? t('common:loading')
                : t('appointments:cancel.confirm')}
            </Text>
          </TouchableOpacity>
        )}
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
  loader: {
    paddingVertical: 32,
  },
  breakdown: {
    alignSelf: 'stretch',
    marginTop: 16,
    padding: 16,
    borderRadius: 16,
    gap: 10,
  },
  breakdownRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  breakdownLabel: {
    fontFamily: fonts.SFPro.Regular,
    flexShrink: 1,
    fontSize: 14,
  },
  breakdownValue: {
    fontFamily: fonts.SFPro.Semibold,
    fontSize: 14,
    fontWeight: '600',
  },
  totalRow: {
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.06)',
  },
  totalLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexShrink: 1,
  },
  totalText: {
    fontFamily: fonts.SFPro.Semibold,
    fontSize: 15,
    fontWeight: '600',
  },
  totalValue: {
    fontFamily: fonts.SFPro.Bold,
    fontSize: 17,
    fontWeight: '700',
  },
  note: {
    fontFamily: fonts.SFPro.Regular,
    marginTop: 12,
    fontSize: 12,
    lineHeight: 16,
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
