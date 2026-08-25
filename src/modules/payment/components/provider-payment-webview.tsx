import { FC, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { WebView } from 'react-native-webview';

import { useTheme } from '@/shared/theme';

import { PAYMENT_RETURN_PATHS } from '../constants';

interface ProviderPaymentWebViewProps {
  /** Provider page returned by `/payment/init`. */
  paymentUrl: string;
  /**
   * Called when the provider sends the user back to one of our return URLs. This is only
   * a hint that the payer is done — the authoritative outcome comes from polling the
   * payment status, so callers should close the screen here, not book anything.
   */
  onReturn?: (outcome: 'success' | 'failure') => void;
}

const outcomeOfUrl = (url: string): 'success' | 'failure' | null => {
  const path = url.split('?')[0].replace(/\/+$/, '');

  if (path.endsWith(PAYMENT_RETURN_PATHS.success)) return 'success';
  if (path.endsWith(PAYMENT_RETURN_PATHS.failure)) return 'failure';
  return null;
};

/**
 * Hosts the payment provider's own page.
 *
 * Unlike `PaymentWebView`, no bridge and no token go in here — this loads FreedomPay
 * directly, so the page is treated as untrusted and the only thing read back from it is
 * which return URL it lands on.
 */
export const ProviderPaymentWebView: FC<ProviderPaymentWebViewProps> = ({
  paymentUrl,
  onReturn,
}) => {
  const { colors } = useTheme();
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [hasFailed, setHasFailed] = useState(false);

  return (
    <View style={styles.container}>
      <WebView
        source={{ uri: paymentUrl }}
        // The provider redirects across its own domains and the acquirer's 3-D Secure page.
        originWhitelist={['*']}
        setSupportMultipleWindows={false}
        domStorageEnabled
        thirdPartyCookiesEnabled
        onLoadStart={() => setIsPageLoading(true)}
        onLoadEnd={() => setIsPageLoading(false)}
        onError={() => {
          setIsPageLoading(false);
          setHasFailed(true);
        }}
        onNavigationStateChange={({ url }) => {
          const outcome = outcomeOfUrl(url);
          if (outcome) onReturn?.(outcome);
        }}
        style={styles.webView}
      />

      {isPageLoading && !hasFailed && (
        <View
          style={[styles.overlay, { backgroundColor: colors.backgroundMain }]}
        >
          <ActivityIndicator color={colors.primary} size="large" />
        </View>
      )}

      {hasFailed && (
        <View
          style={[styles.overlay, { backgroundColor: colors.backgroundMain }]}
        >
          <Text style={[styles.message, { color: colors.textMain }]}>
            Не удалось загрузить страницу оплаты. Проверьте соединение.
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  webView: { flex: 1 },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  message: { textAlign: 'center', fontSize: 15 },
});
