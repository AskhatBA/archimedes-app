import dayjs from 'dayjs';

type DayOfWeekDisplayTypes = 'full' | 'short';

export type TimeOfDay = 'morning' | 'day' | 'evening' | 'night';

export const getTimeOfDay = (date: string): TimeOfDay => {
  const hour = dayjs(date).hour();

  if (hour >= 5 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 17) return 'day';
  if (hour >= 17 && hour < 21) return 'evening';
  return 'night';
};

export const getDayOfWeek = (
  date: string,
  displayType: DayOfWeekDisplayTypes = 'full',
) => {
  return dayjs(date).format(displayType === 'short' ? 'dd' : 'dddd');
};
