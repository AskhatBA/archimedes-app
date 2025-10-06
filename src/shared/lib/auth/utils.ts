import { VerifyOTPResponse } from '@/api';
import {
  saveToLocalStorage,
  getFromLocalStorage,
  removeFromLocalStorage,
} from '@/shared/utils/local-storage';

import { AUTH_TOKEN_KEY } from './constants';

export const setAuthToken = async (token: VerifyOTPResponse) => {
  await saveToLocalStorage(AUTH_TOKEN_KEY, token);
};

export const getAuthToken = async () => {
  const tokens: VerifyOTPResponse = await getFromLocalStorage(AUTH_TOKEN_KEY, {
    convertToJSON: true,
  });

  if (!tokens) return null;

  return tokens;
};

export const removeAuthToken = async () => {
  await removeFromLocalStorage(AUTH_TOKEN_KEY);
};
