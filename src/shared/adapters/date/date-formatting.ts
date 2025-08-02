import dayjs from 'dayjs';

import { DEFAULT_DATE_FORMAT } from './constants';

export const formatDate = (date: string, format = DEFAULT_DATE_FORMAT) => {
  return dayjs(date).format(format);
};
