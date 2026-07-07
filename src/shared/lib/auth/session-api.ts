import axios from 'axios';

import { baseURL } from '@/api/config';

import { getAuthToken } from './utils';

export interface SessionTokens {
  success?: boolean;
  accessToken?: string;
  refreshToken?: string;
}

/**
 * A bare Axios client WITHOUT the app interceptors. The refresh call must never
 * pass through the 401 handler, otherwise a failed refresh would recurse.
 */
const client = axios.create({ baseURL, withCredentials: true });

const authHeader = async (): Promise<Record<string, string>> => {
  const token = await getAuthToken();
  return token?.accessToken
    ? { Authorization: `Bearer ${token.accessToken}` }
    : {};
};

/** Exchange a refresh token for a fresh 15-minute session. */
export const refreshSession = async (
  refreshToken: string,
): Promise<SessionTokens> => {
  const { data } = await client.post<SessionTokens>('/auth/refresh', {
    refreshToken,
  });
  return data;
};

/** PIN fallback: verify a PIN by phone and get a fresh session. */
export const verifyPinRequest = async (
  phone: string,
  pin: string,
): Promise<SessionTokens> => {
  const { data } = await client.post<SessionTokens>('/auth/pin/verify', {
    phone,
    pin,
  });
  return data;
};

/** Set or replace the current user's PIN (requires a valid access token). */
export const setPinRequest = async (pin: string): Promise<void> => {
  await client.post('/auth/pin', { pin }, { headers: await authHeader() });
};

/** Toggle biometric login server-side (requires a valid access token). */
export const setBiometricRequest = async (enabled: boolean): Promise<void> => {
  await client.post(
    '/auth/biometric',
    { enabled },
    { headers: await authHeader() },
  );
};
