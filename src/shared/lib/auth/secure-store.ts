import * as Keychain from 'react-native-keychain';

/**
 * The refresh token is the long-lived re-auth credential. It lives in the
 * device secure store (iOS Keychain / Android Keystore), NOT in AsyncStorage.
 * Access to it is gated on the client by a biometric prompt (Variant B).
 */
const REFRESH_SERVICE = 'kz.archimedes.refresh-token';

export const saveRefreshTokenSecure = async (token: string): Promise<void> => {
  await Keychain.setGenericPassword('refresh', token, {
    service: REFRESH_SERVICE,
    // Keep it on this device only and available while the device is unlocked.
    accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
  });
};

export const getRefreshTokenSecure = async (): Promise<string | null> => {
  try {
    const creds = await Keychain.getGenericPassword({
      service: REFRESH_SERVICE,
    });
    return creds ? creds.password : null;
  } catch {
    return null;
  }
};

export const clearRefreshTokenSecure = async (): Promise<void> => {
  await Keychain.resetGenericPassword({ service: REFRESH_SERVICE });
};
