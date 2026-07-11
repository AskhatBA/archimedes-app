import {
  createContext,
  FC,
  ReactElement,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { VerifyOTPResponse, setApiErrorHandler } from '@/api';
import { ScreenLoader } from '@/shared/components/screen-loader';
import { isBiometricAvailable, promptBiometric } from '@/shared/lib/biometrics';
import { queryClient } from '@/shared/lib/query';
import { routes, useNavigation } from '@/shared/navigation';

import {
  refreshSession,
  setBiometricRequest,
  setPinRequest,
  verifyPinRequest,
} from './session-api';
import {
  getAuthToken,
  getAuthPhone,
  getBiometricEnabledFlag,
  getBiometricPromptedFlag,
  getPinConfiguredFlag,
  getRefreshToken,
  removeAuthMeta,
  removeAuthToken,
  setAuthPhone,
  setAuthToken,
  setBiometricEnabledFlag,
  setBiometricPromptedFlag,
  setPinConfiguredFlag,
} from './utils';

interface AuthContextProps {
  isAuthenticated: boolean;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  isLoading: boolean;
  logout: () => Promise<void>;
  loginIin: string;
  setLoginIin: (iin: string) => void;
  authenticate: (tokens: VerifyOTPResponse, phone?: string) => Promise<void>;
  // Session lock (access token expired -> needs biometric/PIN re-auth)
  isLocked: boolean;
  biometricEnabled: boolean;
  pinConfigured: boolean;
  unlockWithBiometrics: () => Promise<boolean>;
  unlockWithPin: (pin: string) => Promise<void>;
  enableBiometric: () => Promise<boolean>;
  disableBiometric: () => Promise<void>;
  dismissBiometricOffer: () => Promise<void>;
  setPin: (pin: string) => Promise<void>;
}

const initialValues: AuthContextProps = {
  isAuthenticated: false,
  setIsAuthenticated: () => {},
  isLoading: false,
  logout: () => Promise.resolve(),
  loginIin: '',
  setLoginIin: () => {},
  authenticate: async () => {},
  isLocked: false,
  biometricEnabled: false,
  pinConfigured: false,
  unlockWithBiometrics: async () => false,
  unlockWithPin: async () => {},
  enableBiometric: async () => false,
  disableBiometric: async () => {},
  dismissBiometricOffer: async () => {},
  setPin: async () => {},
};

const AuthContext = createContext<AuthContextProps>(initialValues);

export const AuthContextProvider: FC<{ children: ReactNode }> = ({
  children,
}): ReactElement | null => {
  const { resetNavigation } = useNavigation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loginIin, setLoginIin] = useState('');
  const [isLocked, setIsLocked] = useState(false);
  const [biometricEnabled, setBiometricEnabledState] = useState(false);
  const [pinConfigured, setPinConfiguredState] = useState(false);

  // Mirror the flags into refs so the (once-registered) 401 handler always
  // reads their latest value instead of the mount-time closure.
  const biometricRef = useRef(false);
  const pinRef = useRef(false);

  const setBiometricEnabled = (value: boolean) => {
    biometricRef.current = value;
    setBiometricEnabledState(value);
  };

  const setPinConfigured = (value: boolean) => {
    pinRef.current = value;
    setPinConfiguredState(value);
  };

  // Offer to enable biometrics right after login — once per device, only if the
  // hardware is available and biometrics aren't already on.
  const shouldOfferBiometric = async (): Promise<boolean> => {
    if (biometricRef.current) return false;
    if (await getBiometricPromptedFlag()) return false;
    return isBiometricAvailable();
  };

  const authenticate = async (tokens: VerifyOTPResponse, phone?: string) => {
    setIsLoading(true);
    await setAuthToken(tokens);
    if (phone) await setAuthPhone(phone);
    setIsLocked(false);
    setIsAuthenticated(true);

    const offerBiometric = await shouldOfferBiometric();
    setIsLoading(false);

    resetNavigation(
      offerBiometric ? routes.BiometricSetup : routes.TabNavigation,
    );
  };

  const dismissBiometricOffer = async () => {
    await setBiometricPromptedFlag(true);
  };

  const initializeAuth = async () => {
    setIsLoading(true);
    const tokens = await getAuthToken();
    setIsAuthenticated(!!tokens?.accessToken);
    setBiometricEnabled(await getBiometricEnabledFlag());
    setPinConfigured(await getPinConfiguredFlag());
    setIsLoading(false);
  };

  const logout = async () => {
    await removeAuthToken();
    await removeAuthMeta();
    setBiometricEnabled(false);
    setPinConfigured(false);
    setIsLocked(false);
    setIsAuthenticated(false);
    resetNavigation(routes.SignIn);
  };

  // Called by the API layer when a request 401s because the access token
  // expired. If the user has set up biometrics or a PIN we lock the session and
  // let them re-authenticate; otherwise there is no fast re-auth path, so fall
  // back to a full OTP re-login.
  const lock = () => {
    if (biometricRef.current || pinRef.current) {
      setIsLocked(true);
    } else {
      logout();
    }
  };

  const applyFreshSession = async (tokens: VerifyOTPResponse) => {
    await setAuthToken(tokens);
    setIsLocked(false);
    // Access token changed — refetch anything that errored while locked.
    await queryClient.invalidateQueries();
  };

  const unlockWithBiometrics = async (): Promise<boolean> => {
    const ok = await promptBiometric('Подтвердите вход');
    if (!ok) return false;

    const refreshToken = await getRefreshToken();
    if (!refreshToken) return false;

    try {
      const tokens = await refreshSession(refreshToken);
      await applyFreshSession(tokens);
      return true;
    } catch {
      // Refresh token revoked / superseded / expired -> force a full re-login.
      await logout();
      return false;
    }
  };

  // Throws on wrong/locked PIN so the caller can surface the message.
  const unlockWithPin = async (pin: string): Promise<void> => {
    const phone = await getAuthPhone();
    if (!phone) {
      await logout();
      return;
    }

    const tokens = await verifyPinRequest(phone, pin);
    await applyFreshSession(tokens);
  };

  const enableBiometric = async (): Promise<boolean> => {
    const available = await isBiometricAvailable();
    if (!available) return false;

    const confirmed = await promptBiometric('Включить вход по биометрии');
    if (!confirmed) return false;

    await setBiometricRequest(true);
    await setBiometricEnabledFlag(true);
    setBiometricEnabled(true);
    return true;
  };

  const disableBiometric = async (): Promise<void> => {
    await setBiometricRequest(false);
    await setBiometricEnabledFlag(false);
    setBiometricEnabled(false);
  };

  const setPin = async (pin: string): Promise<void> => {
    await setPinRequest(pin);
    await setPinConfiguredFlag(true);
    setPinConfigured(true);
  };

  useEffect(() => {
    initializeAuth();
    setApiErrorHandler({ onSessionExpired: lock, onLogout: logout });
  }, []);

  const value = useMemo(
    (): AuthContextProps => ({
      isAuthenticated,
      setIsAuthenticated,
      isLoading,
      logout,
      loginIin,
      setLoginIin,
      authenticate,
      isLocked,
      biometricEnabled,
      pinConfigured,
      unlockWithBiometrics,
      unlockWithPin,
      enableBiometric,
      disableBiometric,
      dismissBiometricOffer,
      setPin,
    }),
    [isAuthenticated, isLoading, isLocked, biometricEnabled, pinConfigured],
  );

  if (isLoading) return <ScreenLoader />;

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextProps => {
  const ctx = useContext(AuthContext);
  if (!ctx)
    throw new Error('Attempt to use AuthContext context outside its scope');
  return ctx;
};
