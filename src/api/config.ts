// import { config } from '@/shared/config';

const URL = 'https://mis.archimedes.kz/mobile-app/v1/api';
// const URL = 'http://192.168.10.3:4000/v1/api';

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
  baseURL: URL,
  securityWorker,
  withCredentials: true,
};
