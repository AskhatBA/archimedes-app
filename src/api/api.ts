import { apiConfig } from './config';
import { Auth } from './generated/Auth';
import { AuthUtils } from './utils';

const authApi = new Auth(apiConfig);

export const api = authApi;

export const authUtils = new AuthUtils(api as Auth);
authUtils.initToken();
