export const ClinicTypes = {
  Clinic: 3,
  Pharmacy: 4,
  Dentistry: 2,
  Med: 1,
} as const;

// TODO: Просто скопировал его из апишки страховой (/v3/clinicTypes)
// В будущем нужно заменить на сам забпрос и кэшировать его на бэке
export const clinicTypes = [
  {
    id: 1,
    title: 'стационарная помощь',
  },
  {
    id: 2,
    title: 'стоматологическая помощь',
  },
  {
    id: 7,
    title: 'скорая помощь',
  },
  {
    id: 6,
    title: 'Возмещение',
  },
  {
    id: 3,
    title: 'амбулаторно-поликлиническая помощь',
  },
  {
    id: 8,
    title: 'лаборатория',
  },
  {
    id: 5,
    title: 'ассистанс',
  },
  {
    id: 4,
    title: 'аптека',
  },
  {
    id: 9,
    title: 'Санаторно-курортное лечение',
  },
];
