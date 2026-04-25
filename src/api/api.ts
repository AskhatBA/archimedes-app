import { apiConfig } from './config';
import { App } from './generated/App';
import { Auth } from './generated/Auth';
import { Insurance } from './generated/Insurance';
import { Meetings } from './generated/Meetings';
import { Mis } from './generated/Mis';
import { Notifications } from './generated/Notifications';
import { Patient } from './generated/Patient';
import { AuthUtils } from './utils';

const authApi = new Auth(apiConfig);
const misApi = new Mis(apiConfig);
const patientApi = new Patient(apiConfig);
const insuranceApi = new Insurance(apiConfig);
const meetingsApi = new Meetings(apiConfig);
const notificationsApi = new Notifications(apiConfig);
const appApi = new App(apiConfig);

export {
  authApi,
  misApi,
  patientApi,
  insuranceApi,
  meetingsApi,
  notificationsApi,
  appApi,
};

const authUtils = new AuthUtils(authApi);
const misUtils = new AuthUtils(misApi);
const patientUtils = new AuthUtils(patientApi);
const insuranceUtils = new AuthUtils(insuranceApi);
const meetingsUtils = new AuthUtils(meetingsApi);
const notificationsUtils = new AuthUtils(notificationsApi);
const appUtils = new AuthUtils(appApi);

export const setApiErrorHandler = (callback: () => void) => {
  authUtils.setUnauthorizedErrorHandler(callback);
  misUtils.setUnauthorizedErrorHandler(callback);
  patientUtils.setUnauthorizedErrorHandler(callback);
  insuranceUtils.setUnauthorizedErrorHandler(callback);
  meetingsUtils.setUnauthorizedErrorHandler(callback);
  notificationsUtils.setUnauthorizedErrorHandler(callback);
  appUtils.setUnauthorizedErrorHandler(callback);
};

authUtils.initToken();
misUtils.initToken();
patientUtils.initToken();
insuranceUtils.initToken();
meetingsUtils.initToken();
notificationsUtils.initToken();
appUtils.initToken();
