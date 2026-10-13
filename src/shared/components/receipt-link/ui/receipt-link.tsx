import { FC } from 'react';
import { Linking, StyleSheet, Text, TouchableOpacity } from 'react-native';

import { useTranslation } from '@/shared/lib/i18n';
import { useToast } from '@/shared/lib/toast';
import { colors, fonts } from '@/shared/theme';

interface ReceiptLinkProps {
  /** The OFD page of an issued fiscal receipt, as the backend returns it. */
  url: string;
  /** `sale` — the receipt for a payment, `return` — for a refund. */
  kind?: 'sale' | 'return';
}

/**
 * A text link to a fiscal receipt, opened in the external browser.
 *
 * The app deliberately does not draw a receipt of its own: the OFD page is the legal
 * document, and rendering one ourselves would make its content (and its two languages) our
 * responsibility. Callers render this only when a link exists — a receipt that is not
 * issued yet comes back as `null` and simply shows nothing.
 */
export const ReceiptLink: FC<ReceiptLinkProps> = ({ url, kind = 'sale' }) => {
  const { t } = useTranslation();
  const { showToast } = useToast();

  const open = () => {
    Linking.openURL(url).catch(() => {
      showToast({ type: 'error', message: t('common:receipt.openFailed') });
    });
  };

  return (
    <TouchableOpacity
      accessibilityRole="link"
      hitSlop={8}
      onPress={open}
      style={styles.link}
    >
      <Text style={styles.text}>{t(`common:receipt.${kind}`)}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  link: {
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 13,
    lineHeight: 18,
    fontFamily: fonts.SFPro.Medium,
    color: colors.blue['400'],
    textDecorationLine: 'underline',
  },
});
