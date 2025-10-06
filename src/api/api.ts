import { apiConfig } from './config';
import { Auth } from './generated/Auth';
import { Insurance } from './generated/Insurance';
import { Mis } from './generated/Mis';
import { Patient } from './generated/Patient';
import { AuthUtils } from './utils';

const authApi = new Auth(apiConfig);
const misApi = new Mis(apiConfig);
const patientApi = new Patient(apiConfig);
const insuranceApi = new Insurance(apiConfig);

export { authApi, misApi, patientApi, insuranceApi };

const authUtils = new AuthUtils(authApi);
const misUtils = new AuthUtils(misApi);
const patientUtils = new AuthUtils(patientApi);
const insuranceUtils = new AuthUtils(insuranceApi);

export const setApiErrorHandler = (callback: () => void) => {
  authUtils.setUnauthorizedErrorHandler(callback);
  misUtils.setUnauthorizedErrorHandler(callback);
  patientUtils.setUnauthorizedErrorHandler(callback);
  insuranceUtils.setUnauthorizedErrorHandler(callback);
};

authUtils.initToken();
misUtils.initToken();
patientUtils.initToken();
insuranceUtils.initToken();
