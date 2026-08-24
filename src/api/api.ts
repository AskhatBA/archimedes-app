import { apiConfig } from './config';
import { App } from './generated/App';
import { Auth } from './generated/Auth';
import { Insurance } from './generated/Insurance';
import { Meetings } from './generated/Meetings';
import { Mis } from './generated/Mis';
import { Notifications } from './generated/Notifications';
import { Patient } from './generated/Patient';
import { User } from './generated/User';
import { PaymentApi } from './payment-api';
import { AuthUtils, UnauthorizedHandlers } from './utils';

const authApi = new Auth(apiConfig);
const misApi = new Mis(apiConfig);
const patientApi = new Patient(apiConfig);
const insuranceApi = new Insurance(apiConfig);
const meetingsApi = new Meetings(apiConfig);
const notificationsApi = new Notifications(apiConfig);
const userApi = new User(apiConfig);
const appApi = new App(apiConfig);
const paymentApi = new PaymentApi(apiConfig);

export {
  authApi,
  misApi,
  patientApi,
  insuranceApi,
  meetingsApi,
  notificationsApi,
  userApi,
  appApi,
  paymentApi,
};

const authUtils = new AuthUtils(authApi);
const misUtils = new AuthUtils(misApi);
const patientUtils = new AuthUtils(patientApi);
const insuranceUtils = new AuthUtils(insuranceApi);
const meetingsUtils = new AuthUtils(meetingsApi);
const notificationsUtils = new AuthUtils(notificationsApi);
const userUtils = new AuthUtils(userApi);
const appUtils = new AuthUtils(appApi);
const paymentUtils = new AuthUtils(paymentApi);

export const setApiErrorHandler = (handlers: UnauthorizedHandlers) => {
  authUtils.setUnauthorizedErrorHandler(handlers);
  misUtils.setUnauthorizedErrorHandler(handlers);
  patientUtils.setUnauthorizedErrorHandler(handlers);
  insuranceUtils.setUnauthorizedErrorHandler(handlers);
  meetingsUtils.setUnauthorizedErrorHandler(handlers);
  notificationsUtils.setUnauthorizedErrorHandler(handlers);
  userUtils.setUnauthorizedErrorHandler(handlers);
  appUtils.setUnauthorizedErrorHandler(handlers);
  paymentUtils.setUnauthorizedErrorHandler(handlers);
};

authUtils.initToken();
misUtils.initToken();
patientUtils.initToken();
insuranceUtils.initToken();
meetingsUtils.initToken();
notificationsUtils.initToken();
userUtils.initToken();
appUtils.initToken();
paymentUtils.initToken();
