import { ElectronicReferralItem } from '@/api/generated/data-contracts';

export const electronicReferralsMock: ElectronicReferralItem[] = [
  {
    id: 1,
    date: '15.01.2026',
    name: 'Иванов Иван Иванович',
    medical_institution: 'Алматы, ТОО Архимедес',
    diagnosis: 'Остеохондроз',
    amount: 3850,
    currency: 'KZT',
    appointmentDetail: [
      {
        id: 1,
        service: 'Консультация невролога',
        amount: 1500,
      },
      {
        id: 2,
        service: 'МРТ позвоночника',
        amount: 2350,
      },
    ],
  },
  {
    id: 2,
    date: '20.01.2026',
    name: 'Петров Петр Петрович',
    medical_institution: 'Астана, МЦ Здоровье',
    diagnosis: 'ОРВИ',
    amount: 1200,
    currency: 'KZT',
    appointmentDetail: [
      {
        id: 3,
        service: 'Консультация терапевта',
        amount: 800,
      },
      {
        id: 4,
        service: 'Общий анализ крови',
        amount: 400,
      },
    ],
  },
  {
    id: 3,
    date: '28.01.2026',
    name: 'Сидорова Мария Александровна',
    medical_institution: 'Шымкент, Клиника Медикер',
    diagnosis: 'Гастрит',
    amount: 4500,
    currency: 'KZT',
    appointmentDetail: [
      {
        id: 5,
        service: 'Консультация гастроэнтеролога',
        amount: 2000,
      },
      {
        id: 6,
        service: 'Гастроскопия',
        amount: 2500,
      },
    ],
  },
  {
    id: 4,
    date: '05.02.2026',
    name: 'Ахметов Нурлан Серикович',
    medical_institution: 'Караганда, Поликлиника №5',
    diagnosis: 'Артрит',
    amount: 5200,
    currency: 'KZT',
    appointmentDetail: [
      {
        id: 7,
        service: 'Консультация ревматолога',
        amount: 1800,
      },
      {
        id: 8,
        service: 'Рентген суставов',
        amount: 1400,
      },
      {
        id: 9,
        service: 'Анализ на ревматоидный фактор',
        amount: 2000,
      },
    ],
  },
];
