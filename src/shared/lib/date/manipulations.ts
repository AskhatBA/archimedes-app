import dayjs from 'dayjs';

export const addDays = (
  date: string | Date,
  days: number,
  format = 'YYYY-MM-DD HH:mm',
) => {
  return dayjs(date).add(days, 'day').format(format);
};

export const addMonths = (
  date: string | Date,
  months: number,
  format = 'YYYY-MM-DD',
) => {
  return dayjs(date).add(months, 'month').format(format);
};

export const subtractMonths = (
  date: string | Date,
  months: number,
  format = 'YYYY-MM-DD',
) => {
  return dayjs(date).subtract(months, 'month').format(format);
};
