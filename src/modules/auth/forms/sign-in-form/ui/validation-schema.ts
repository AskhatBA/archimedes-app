import { TFunction } from 'i18next';
import * as Yup from 'yup';

import { isValidIin } from '@/shared/lib/iin';

export const createValidationSchema = (t: TFunction) =>
  Yup.object().shape({
    phone: Yup.string()
      .matches(
        /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/,
        t('auth:invalidPhoneFormat'),
      )
      .required(t('errors:required')),
    iin: Yup.string()
      .length(12, t('auth:iinLength'))
      // Empty input is left to `required`/`length` so their messages win.
      .test(
        'iin-valid',
        t('auth:iinInvalid'),
        value => !value || isValidIin(value),
      )
      .required(t('errors:required')),
  });
