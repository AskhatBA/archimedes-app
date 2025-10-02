import * as Yup from 'yup';

export const validationSchema = Yup.object().shape({
  phone: Yup.string()
    .matches(
      /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/,
      'Некорректный формат телефона',
    )
    .required('Обязательное поле'),
  iin: Yup.string()
    .length(12, 'ИИН должен содержать 12 цифр')
    .required('Обязательное поле'),
});
