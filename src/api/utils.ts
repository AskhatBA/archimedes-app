/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-underscore-dangle */
import { AxiosError } from 'axios';

import { getAuthToken } from '@/shared/lib/auth';

import { errorMap } from './constants';
import { HttpClient } from './generated/http-client';

type Api = HttpClient;

let isRefreshing = false;
let failedQueue: any = [];

const preserveProcessQueue = (error: any, token: any = null) => {
  failedQueue.forEach((requestPromise: any) => {
    if (error) {
      requestPromise.reject(error);
    } else {
      requestPromise.resolve(token);
    }
  });

  failedQueue = [];
};

export class AuthUtils {
  api = {} as Api;

  constructor(appApi: Api) {
    this.api = appApi;
  }

  async initToken(): Promise<void> {
    this.api.instance.interceptors.request.use(
      async request => {
        const token = await getAuthToken();

        if (token) {
          request.headers.Authorization = `Bearer ${token.accessToken}`;
        }

        return request;
      },
      error => {
        return Promise.reject(error);
      },
    );
  }

  setUnauthorizedErrorHandler(deleteSessionCallback: () => void): void {
    this.api.instance.interceptors.response.use(
      response => response,
      async (error: any) => {
        const isUnauthorized = error.response?.status === 401;

        if (isUnauthorized && !error.response.config._retry) {
          if (isRefreshing) {
            return new Promise((resolve, reject) => {
              failedQueue.push({ resolve, reject });
            })
              .then(token => {
                error.response.headers.Authorization = `Bearer ${token}`;
                return this.api.instance(error.response);
              })
              .catch(err => Promise.reject(err));
          }

          error.response.config._retry = true;
          isRefreshing = true;

          try {
            deleteSessionCallback();
          } catch (err) {
            preserveProcessQueue(err, null);
            deleteSessionCallback();
          } finally {
            isRefreshing = false;
          }

          return this.api.instance(error.response.config);
        }
        throw error;
      },
    );
  }
}

type ErrorCode = keyof typeof errorMap;

type FormValidationError = {
  ctx?: { error: ErrorCode };
  loc: string[];
  msg: string;
};

type RegularError = {
  code: number;
  description: ErrorCode;
  name: string;
};

const isRegularError = (error: unknown): error is RegularError => {
  if (typeof error !== 'object' || error === null) return false;
  return 'code' in error && 'description' in error && 'name' in error;
};

export const resolveErrorMessage = (error: unknown): string => {
  const axiosError = error as AxiosError;
  if (!axiosError.isAxiosError) return errorMap.UNKNOWN;
  if (axiosError.code === 'ERR_NETWORK') return errorMap.NETWORK_ERROR;
  if (!axiosError.response) return errorMap.UNKNOWN;

  const errorData = axiosError.response?.data;
  const isFormValidationError = (errorData as [])?.length;
  if (isFormValidationError) {
    const formValidationError = (errorData as FormValidationError[])[0];
    const message =
      formValidationError.ctx && errorMap[formValidationError.ctx.error];
    return message || formValidationError.msg || errorMap.UNKNOWN;
  }

  if (isRegularError(errorData)) {
    return (
      errorMap[errorData.description] ||
      errorData.description ||
      errorMap.UNKNOWN
    );
  }

  return errorMap.UNKNOWN;
};
