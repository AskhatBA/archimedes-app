import { PAYMENT_WEB_URL } from '@env';
import { Platform } from 'react-native';

const DEFAULT_URL = 'https://dashboard.archimedes.kz/payment';

/**
 * `localhost` inside an Android emulator is the emulator itself, not the dev machine —
 * 10.0.2.2 is the host loopback alias. iOS simulators share the host network, so they
 * need no rewrite.
 */
const forEmulator = (url: string): string =>
  Platform.OS === 'android'
    ? url.replace(/\/\/(localhost|127\.0\.0\.1)/, '//10.0.2.2')
    : url;

export const paymentWebUrl = forEmulator(PAYMENT_WEB_URL || DEFAULT_URL);

export const originOfUrl = (url: string): string => {
  const match = /^(https?:\/\/[^/?#]+)/i.exec(url);
  return match ? match[1] : '';
};

/** Only this origin gets the bridge and the auth token — never the payment provider's. */
export const paymentWebOrigin = originOfUrl(paymentWebUrl);
