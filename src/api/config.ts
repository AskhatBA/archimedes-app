import { config } from '@/shared/config';

const URL = config.env.API_URL;

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
