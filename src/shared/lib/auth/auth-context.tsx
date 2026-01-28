import {
  createContext,
  FC,
  ReactElement,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { VerifyOTPResponse, setApiErrorHandler } from '@/api';
import { ScreenLoader } from '@/shared/components/screen-loader';
import { routes, useNavigation } from '@/shared/navigation';

import { getAuthToken, removeAuthToken, setAuthToken } from './utils';

interface AuthContextProps {
  isAuthenticated: boolean;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  isLoading: boolean;
  logout: () => Promise<void>;
  loginIin: string;
  setLoginIin: (iin: string) => void;
  authenticate: (tokens: VerifyOTPResponse) => Promise<void>;
}

const initialValues: AuthContextProps = {
  isAuthenticated: false,
  setIsAuthenticated: () => {},
  isLoading: false,
  logout: () => Promise.resolve(),
  loginIin: '',
  setLoginIin: () => {},
  authenticate: async () => {},
};

const AuthContext = createContext<AuthContextProps>(initialValues);

export const AuthContextProvider: FC<{ children: ReactNode }> = ({
  children,
}): ReactElement | null => {
  const { resetNavigation } = useNavigation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loginIin, setLoginIin] = useState('');

  const authenticate = async (tokens: VerifyOTPResponse) => {
    setIsLoading(true);
    await setAuthToken(tokens);
    setIsAuthenticated(true);
    setIsLoading(false);
    resetNavigation(routes.TabNavigation);
  };

  const initializeAuth = async () => {
    setIsLoading(true);
    const tokens = await getAuthToken();
    setIsAuthenticated(!!tokens?.accessToken);
    setIsLoading(false);
  };

  const logout = async () => {
    await removeAuthToken();
    setIsAuthenticated(false);
    resetNavigation(routes.SignIn);
  };

  useEffect(() => {
    initializeAuth();
    setApiErrorHandler(logout);
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
    }),
    [isAuthenticated, isLoading],
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
