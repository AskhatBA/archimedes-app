import * as Yup from 'yup';

export const validationSchema = Yup.object().shape({
  date: Yup.string().required('Обязательное поле'),
  amount: Yup.string().required('Обязательное поле'),
  person: Yup.string().required('Обязательное поле'),
  program: Yup.string().required('Обязательное поле'),
  category: Yup.string().required('Обязательное поле'),
});
