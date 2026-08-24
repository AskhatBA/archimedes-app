import { useEffect, useMemo, useState } from 'react';
import { Platform } from 'react-native';

import { GET_USER_INFO_QUERY } from '@/shared/constants';
import { getAuthToken } from '@/shared/lib/auth';
import { queryClient } from '@/shared/lib/query';
import { useToast } from '@/shared/lib/toast';
import { useWebViewBridge } from '@/shared/lib/webview-bridge';
import { useNavigation } from '@/shared/navigation';
import { usePageHeaderStore } from '@/shared/store';

import { PAYMENT_BRIDGE_ACTIONS } from '../constants';
import { buildAuthBootstrap } from '../lib/auth-bootstrap';
import { paymentWebOrigin } from '../lib/payment-url';
import { PaymentResultPayload, ToastPayload } from '../types';

interface PaymentBridgeOptions {
  /** When given, the web page skips its form and pays this amount immediately. */
  amount?: number;
  description?: string;
  /**
   * Called with the final state of the payment, before the screen closes. Lets a caller
   * record the outcome against whatever it sent the user here to pay for.
   */
  onResult?: (result: PaymentResultPayload) => void;
}

/**
 * Loads the access token, then hands back the props that connect the payment WebView to
 * native toasts, the screen title and navigation.
 *
 * The WebView is only rendered once `isTokenReady` is true — mounting it earlier would
 * load the page without a token and the first request would come back 401.
 */
export const usePaymentBridge = ({
  amount,
  description,
  onResult,
}: PaymentBridgeOptions = {}) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isTokenReady, setIsTokenReady] = useState(false);

  const { showToast } = useToast();
  const { goBack } = useNavigation();
  const setTitle = usePageHeaderStore(state => state.setTitle);

  useEffect(() => {
    let cancelled = false;

    getAuthToken()
      .then(stored => {
        if (cancelled) return;
        setAccessToken(stored?.accessToken ?? null);
      })
      .finally(() => {
        if (!cancelled) setIsTokenReady(true);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const allowedOrigins = useMemo(() => [paymentWebOrigin], []);

  const context = useMemo(
    () => ({
      token: accessToken,
      platform: Platform.OS,
      // Lets the web page render a native-embedded layout instead of the browser one.
      embedded: true,
      // The amount is decided here, so the page has no form to show — it creates the
      // payment on load and sends the user straight to the provider.
      amount,
      description,
    }),
    [accessToken, amount, description],
  );

  const bootstrap = useMemo(
    () => (accessToken ? buildAuthBootstrap(accessToken) : ''),
    [accessToken],
  );

  const bridge = useWebViewBridge({
    allowedOrigins,
    context,
    bootstrap,
    handlers: {
      [PAYMENT_BRIDGE_ACTIONS.close]: () => goBack(),

      [PAYMENT_BRIDGE_ACTIONS.toast]: ({ message, type }: ToastPayload) =>
        showToast({ message, type: type ?? 'info' }),

      [PAYMENT_BRIDGE_ACTIONS.setTitle]: ({ title }: { title: string }) =>
        setTitle(title),

      [PAYMENT_BRIDGE_ACTIONS.result]: (result: PaymentResultPayload) => {
        const { status } = result;

        // Reported first: the SUCCESS branch navigates away right after.
        onResult?.(result);

        if (status === 'SUCCESS') {
          // The balance just changed server-side, so the cached profile is stale.
          queryClient.invalidateQueries({ queryKey: [GET_USER_INFO_QUERY] });
          showToast({ message: 'Платёж прошёл успешно', type: 'success' });
          goBack();
          return;
        }

        if (status === 'FAILED') {
          showToast({ message: 'Платёж не прошёл', type: 'error' });
        }
      },
    },
  });

  return { ...bridge, isTokenReady, hasToken: Boolean(accessToken) };
};
