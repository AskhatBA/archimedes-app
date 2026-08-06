import * as Yup from 'yup';

import { isValidIin } from '@/shared/lib/iin';

export const validationSchema = Yup.object().shape({
  lastName: Yup.string().required('Обязательное поле'),
  firstName: Yup.string().required('Обязательное поле'),
  iin: Yup.string()
    .matches(/^\d{12}$/, 'Должно содержать ровно 12 цифр')
    // Empty input is left to `required`/`matches` so their messages win.
    .test(
      'iin-valid',
      'Неверный формат ИИН. Проверьте введённые цифры',
      value => !value || isValidIin(value),
    )
    .required('Обязательное поле'),
  birthDate: Yup.string().required('Обязательное поле'),
  gender: Yup.string().required('Обязательное поле'),
});
