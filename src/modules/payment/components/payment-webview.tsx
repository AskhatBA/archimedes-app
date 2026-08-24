import { FC, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { WebView } from 'react-native-webview';

import { useTheme } from '@/shared/theme';

import { usePaymentBridge } from '../hooks/use-payment-bridge';
import { paymentWebUrl } from '../lib/payment-url';
import { PaymentResultPayload } from '../types';

interface PaymentWebViewProps {
  /** Pay this amount without asking the user — the web page skips its form. */
  amount?: number;
  description?: string;
  /** Receives the final state of the payment before the screen closes. */
  onResult?: (result: PaymentResultPayload) => void;
}

export const PaymentWebView: FC<PaymentWebViewProps> = ({
  amount,
  description,
  onResult,
}) => {
  const { colors } = useTheme();
  const { webViewProps, isTokenReady, hasToken } = usePaymentBridge({
    amount,
    description,
    onResult,
  });
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [hasFailed, setHasFailed] = useState(false);

  if (!isTokenReady) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    );
  }

  if (!hasToken) {
    return (
      <View style={styles.centered}>
        <Text style={[styles.message, { color: colors.textMain }]}>
          Сессия истекла. Войдите в аккаунт заново, чтобы оплатить.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <WebView
        {...webViewProps}
        source={{ uri: paymentWebUrl }}
        // The payment provider redirects across its own domains, so navigation stays
        // open; the bridge and the token are fenced off by origin instead.
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
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  message: { textAlign: 'center', fontSize: 15 },
});
