import * as Yup from 'yup';

export const validationSchema = Yup.object().shape({
  lastName: Yup.string().required('Обязательное поле'),
  firstName: Yup.string().required('Обязательное поле'),
  iin: Yup.string()
    .matches(/^\d{12}$/, 'Должно содержать ровно 12 цифр')
    .required('Обязательное поле'),
  birthDate: Yup.string().required('Обязательное поле'),
  gender: Yup.string().required('Обязательное поле'),
});
