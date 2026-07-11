import { VerifyOTPResponse } from '@/api';
import {
  saveToLocalStorage,
  getFromLocalStorage,
  removeFromLocalStorage,
} from '@/shared/utils/local-storage';

import {
  AUTH_TOKEN_KEY,
  AUTH_PHONE_KEY,
  BIOMETRIC_ENABLED_KEY,
  BIOMETRIC_PROMPTED_KEY,
  PIN_CONFIGURED_KEY,
} from './constants';
import {
  saveRefreshTokenSecure,
  getRefreshTokenSecure,
  clearRefreshTokenSecure,
} from './secure-store';

export interface StoredAccess {
  accessToken?: string;
}

/**
 * Persist a token pair: the short-lived (15 min) access token goes to
 * AsyncStorage, while the refresh token goes to the device secure store.
 */
export const setAuthToken = async (token: VerifyOTPResponse) => {
  await saveToLocalStorage(AUTH_TOKEN_KEY, { accessToken: token.accessToken });
  if (token.refreshToken) {
    await saveRefreshTokenSecure(token.refreshToken);
  }
};

export const getAuthToken = async (): Promise<StoredAccess | null> => {
  const tokens: StoredAccess = await getFromLocalStorage(AUTH_TOKEN_KEY, {
    convertToJSON: true,
  });

  if (!tokens) return null;

  return tokens;
};

export const getRefreshToken = getRefreshTokenSecure;

export const removeAuthToken = async () => {
  await removeFromLocalStorage(AUTH_TOKEN_KEY);
  await clearRefreshTokenSecure();
};

/**
 * The phone number identifies the user during PIN verification (which happens
 * when biometrics are unavailable). Kept in plain AsyncStorage: it is not a
 * secret and must be readable without a biometric prompt.
 */
export const setAuthPhone = async (phone: string) => {
  await saveToLocalStorage(AUTH_PHONE_KEY, phone);
};

export const getAuthPhone = async (): Promise<string | null> => {
  const phone = await getFromLocalStorage(AUTH_PHONE_KEY, {
    convertToJSON: true,
  });
  return phone || null;
};

export const setBiometricEnabledFlag = async (enabled: boolean) => {
  await saveToLocalStorage(BIOMETRIC_ENABLED_KEY, enabled);
};

export const getBiometricEnabledFlag = async (): Promise<boolean> => {
  const value = await getFromLocalStorage(BIOMETRIC_ENABLED_KEY, {
    convertToJSON: true,
  });
  return value === true;
};

/**
 * Whether we already offered to enable biometrics after login. Persisted across
 * logout so the one-time onboarding prompt is not shown repeatedly.
 */
export const setBiometricPromptedFlag = async (prompted: boolean) => {
  await saveToLocalStorage(BIOMETRIC_PROMPTED_KEY, prompted);
};

export const getBiometricPromptedFlag = async (): Promise<boolean> => {
  const value = await getFromLocalStorage(BIOMETRIC_PROMPTED_KEY, {
    convertToJSON: true,
  });
  return value === true;
};

export const setPinConfiguredFlag = async (configured: boolean) => {
  await saveToLocalStorage(PIN_CONFIGURED_KEY, configured);
};

export const getPinConfiguredFlag = async (): Promise<boolean> => {
  const value = await getFromLocalStorage(PIN_CONFIGURED_KEY, {
    convertToJSON: true,
  });
  return value === true;
};

export const removeAuthMeta = async () => {
  await removeFromLocalStorage(AUTH_PHONE_KEY);
  await removeFromLocalStorage(BIOMETRIC_ENABLED_KEY);
  await removeFromLocalStorage(PIN_CONFIGURED_KEY);
};
