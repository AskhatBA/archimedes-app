import * as Yup from 'yup';

import { i18n } from '@/shared/lib/i18n';

const required = () => i18n.t('errors:required');

export const validationSchema = Yup.object().shape({
  date: Yup.string().required(required),
  amount: Yup.string().required(required),
  person: Yup.string().required(required),
  program: Yup.string().required(required),
  category: Yup.string().required(required),
});
