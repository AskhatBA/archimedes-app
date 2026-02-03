import { Platform } from 'react-native';

const PROD_URL = 'https://mis.archimedes.kz/mobile-app/v1/api';
const DEV_IOS_URL = 'http://localhost:4000/v1/api';
const DEV_ANDROID_URL = 'http://10.0.2.2:4000/v1/api';

export const baseURL = Platform.select({
  ios: __DEV__ ? DEV_IOS_URL : PROD_URL,
  android: __DEV__ ? DEV_ANDROID_URL : PROD_URL,
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
