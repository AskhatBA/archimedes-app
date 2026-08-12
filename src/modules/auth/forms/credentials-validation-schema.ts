import { TFunction } from 'i18next';
import * as Yup from 'yup';

/**
 * Phone + IIN — the credentials pair entered both when signing in and on the
 * first step of registration.
 */
export const createCredentialsValidationSchema = (t: TFunction) =>
  Yup.object().shape({
    phone: Yup.string()
      .matches(
        /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/,
        t('auth:invalidPhoneFormat'),
      )
      .required(t('errors:required')),
    iin: Yup.string()
      .length(12, t('auth:iinLength'))
      .required(t('errors:required')),
  });
