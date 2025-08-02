import dayjs from 'dayjs';
import 'dayjs/locale/ru';

dayjs.locale('ru');

type DayOfWeekDisplayTypes = 'full' | 'short';

export const getTimeOfDay = (date: string) => {
  const hour = dayjs(date).hour();

  if (hour >= 5 && hour < 12) return 'Утро';
  if (hour >= 12 && hour < 17) return 'День';
  if (hour >= 17 && hour < 21) return 'Вечер';
  return 'Ночь';
};

export const getDayOfWeek = (
  date: string,
  displayType: DayOfWeekDisplayTypes = 'full',
) => {
  return dayjs(date).format(displayType === 'short' ? 'dd' : 'dddd');
};
