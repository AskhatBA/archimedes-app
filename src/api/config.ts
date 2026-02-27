import { Platform } from 'react-native';

import {
  BASE_API_URL,
  DEV_ANDROID_API_URL,
  DEV_IOS_API_URL,
} from '@/shared/config';

export const baseURL = Platform.select({
  ios: __DEV__ ? DEV_IOS_API_URL : BASE_API_URL,
  android: __DEV__ ? DEV_ANDROID_API_URL : BASE_API_URL,
});

const securityWorker = (token: string | null | undefined): Promise<any> => {
  const securityConfig = {
    headers: {
      Authorization: '',
    },
  };

  if (token && token !== '' && typeof window !== 'undefined') {
    Object.assign(securityConfig.headers, {
      Authorization: `Bearer ${token}`,
    });
  }

  return Promise.resolve(securityConfig);
};

export const apiConfig = {
  baseURL,
  securityWorker,
  withCredentials: true,
};
