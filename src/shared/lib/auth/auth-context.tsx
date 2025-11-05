import { useMutation, UseMutationResult } from '@tanstack/react-query';
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

import {
  authApi,
  RequestOTPBody,
  VerifyOTPBody,
  RequestOTPResponse,
  VerifyOTPResponse,
  setApiErrorHandler,
} from '@/api';
import { ScreenLoader } from '@/shared/components/screen-loader';
import { useToast } from '@/shared/lib/toast';
import { routes, useNavigation } from '@/shared/navigation';

import { getAuthToken, removeAuthToken, setAuthToken } from './utils';

type RequestOtpMutation = UseMutationResult<
  RequestOTPResponse,
  Error,
  RequestOTPBody
>;

type VerifyOtpMutation = UseMutationResult<
  VerifyOTPResponse,
  Error,
  VerifyOTPBody
>;

interface AuthContextProps {
  isAuthenticated: boolean;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  isLoading: boolean;
  requestOtpMutation: RequestOtpMutation;
  verifyOtpMutation: VerifyOtpMutation;
  logout: () => Promise<void>;
  loginIin: string;
  setLoginIin: (iin: string) => void;
}

const initialValues: AuthContextProps = {
  isAuthenticated: false,
  setIsAuthenticated: () => {},
  isLoading: false,
  requestOtpMutation: {} as RequestOtpMutation,
  verifyOtpMutation: {} as VerifyOtpMutation,
  logout: () => Promise.resolve(),
  loginIin: '',
  setLoginIin: () => {},
};

const AuthContext = createContext<AuthContextProps>(initialValues);

export const AuthContextProvider: FC<{ children: ReactNode }> = ({
  children,
}): ReactElement | null => {
  const { showToast } = useToast();
  const { resetNavigation, navigate } = useNavigation();
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

  const requestOtpMutation = useMutation({
    mutationFn: async (credentials: RequestOTPBody) =>
      (await authApi.requestOtpCreate(credentials)).data,
    onSuccess: async data => {
      console.log('otp: ', (data as { otp: string }).otp);
      navigate(routes.OtpVerification, { phone: data.phone });
    },
    onError: () => {
      showToast({
        type: 'error',
        message: 'Не удалось отправить код. Попробуйте снова',
      });
    },
  });

  const verifyOtpMutation = useMutation({
    mutationFn: async (body: VerifyOTPBody) =>
      (await authApi.verifyOtpCreate(body)).data,
    onSuccess: async data => {
      await authenticate(data);
    },
    onError: () => {
      showToast({
        type: 'error',
        message: 'Похоже вы ввели неверный код. Попробуйте снова',
      });
    },
  });

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
      requestOtpMutation,
      verifyOtpMutation,
      logout,
      loginIin,
      setLoginIin,
    }),
    [
      isAuthenticated,
      isLoading,
      requestOtpMutation.isPending,
      verifyOtpMutation.isPending,
    ],
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
