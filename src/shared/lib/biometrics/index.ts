import {
  isSensorAvailable,
  simplePrompt,
} from '@sbaiahmed1/react-native-biometrics';

export type BiometryType =
  | 'Biometrics'
  | 'FaceID'
  | 'TouchID'
  | 'None'
  | 'Unknown';

/**
 * Whether the device has an enrolled biometric sensor available.
 */
export const isBiometricAvailable = async (): Promise<boolean> => {
  try {
    const { available } = await isSensorAvailable();
    return available;
  } catch {
    return false;
  }
};

export const getBiometryType = async (): Promise<BiometryType | null> => {
  try {
    const { available, biometryType } = await isSensorAvailable();
    return available ? (biometryType ?? 'Unknown') : null;
  } catch {
    return null;
  }
};

/**
 * Show the OS biometric prompt. Returns true only if the user successfully
 * authenticated. In Variant B this gates access to the refresh token that is
 * kept in the device secure store — the backend never verifies biometrics.
 */
export const promptBiometric = async (
  promptMessage: string,
): Promise<boolean> => {
  try {
    const { success } = await simplePrompt(promptMessage);
    return success;
  } catch {
    return false;
  }
};
