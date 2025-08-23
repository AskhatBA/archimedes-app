import * as Yup from 'yup';

export const validationSchema = Yup.object().shape({
  phone: Yup.string()
    .matches(
      /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/,
      'Некорректный формат телефона',
    )
    .required('Обязательное поле'),
});
