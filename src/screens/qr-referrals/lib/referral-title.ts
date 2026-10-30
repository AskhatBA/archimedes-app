import { QrAppointmentItem } from '@/api/generated/data-contracts';

/**
 * What a referral card is headed with. The diagnosis when the insurer gives one — but a
 * referral to a consultation often comes without it (the doctor sets it at the visit), and
 * a card with an empty heading reads as broken. Then the service it is for, with "+N" for
 * the rest, and the referral number as the last resort.
 */
export const referralTitleOf = (item: QrAppointmentItem): string => {
  const diagnosis = item.diagnosis?.trim();
  if (diagnosis) return diagnosis;

  const services = (item.appointmentDetail ?? [])
    .map(detail => detail.service?.trim())
    .filter((service): service is string => !!service);
  if (services.length > 1) return `${services[0]} +${services.length - 1}`;
  if (services.length === 1) return services[0];

  return item.id != null ? `Направление №${item.id}` : 'Направление';
};
