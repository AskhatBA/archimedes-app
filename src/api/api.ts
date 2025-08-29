import { apiConfig } from './config';
import { Auth } from './generated/Auth';
import { Mis } from './generated/Mis';
import { Patient } from './generated/Patient';
import { AuthUtils } from './utils';

const authApi = new Auth(apiConfig);
const misApi = new Mis(apiConfig);
const patientApi = new Patient(apiConfig);

export { authApi, misApi, patientApi };

const authUtils = new AuthUtils(authApi);
const misUtils = new AuthUtils(misApi);
const patientUtils = new AuthUtils(patientApi);

export const setApiErrorHandler = (callback: () => void) => {
  authUtils.setUnauthorizedErrorHandler(callback);
  misUtils.setUnauthorizedErrorHandler(callback);
  patientUtils.setUnauthorizedErrorHandler(callback);
};

authUtils.initToken();
misUtils.initToken();
patientUtils.initToken();
