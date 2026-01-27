import dayjs from 'dayjs';

export const mockTimeSlots = [
  {
    date: dayjs().format('YYYY-MM-DD'),
    slots: [
      { time: '09:00', available: true },
      { time: '10:00', available: false },
      { time: '11:00', available: true },
      { time: '12:00', available: true },
      { time: '13:00', available: false },
      { time: '14:00', available: true },
    ],
  },
  {
    date: dayjs().add(1, 'day').format('YYYY-MM-DD'),
    slots: [
      { time: '09:00', available: false },
      { time: '10:00', available: true },
      { time: '11:00', available: true },
      { time: '12:00', available: false },
      { time: '13:00', available: true },
      { time: '14:00', available: true },
    ],
  },
  {
    date: dayjs().add(2, 'day').format('YYYY-MM-DD'),
    slots: [
      { time: '09:00', available: true },
      { time: '10:00', available: true },
      { time: '11:00', available: false },
      { time: '12:00', available: true },
      { time: '13:00', available: true },
      { time: '14:00', available: false },
    ],
  },
  {
    date: dayjs().add(3, 'day').format('YYYY-MM-DD'),
    slots: [
      { time: '09:00', available: true },
      { time: '10:00', available: false },
      { time: '11:00', available: true },
      { time: '12:00', available: true },
      { time: '13:00', available: false },
      { time: '14:00', available: true },
    ],
  },
  {
    date: dayjs().add(4, 'day').format('YYYY-MM-DD'),
    slots: [
      { time: '09:00', available: true },
      { time: '10:00', available: true },
      { time: '11:00', available: true },
    ],
  },
  {
    date: dayjs().add(5, 'day').format('YYYY-MM-DD'),
    slots: [
      { time: '09:00', available: true },
      { time: '10:00', available: true },
      { time: '11:00', available: true },
    ],
  },
  {
    date: dayjs().add(6, 'day').format('YYYY-MM-DD'),
    slots: [
      { time: '09:00', available: true },
      { time: '10:00', available: true },
      { time: '11:00', available: true },
    ],
  },
  {
    date: dayjs().add(7, 'day').format('YYYY-MM-DD'),
    slots: [
      { time: '09:00', available: true },
      { time: '10:00', available: true },
      { time: '11:00', available: true },
    ],
  },
];
