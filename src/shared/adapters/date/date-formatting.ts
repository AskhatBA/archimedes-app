import dayjs from 'dayjs';

import { DEFAULT_DATE_FORMAT } from './constants';

export const formatDate = (
  date: string | number | Date,
  format = DEFAULT_DATE_FORMAT,
) => {
  return dayjs(date).format(format);
};

export const formatToDateObject = (date: string | number) => {
  return dayjs(date).toDate();
};
