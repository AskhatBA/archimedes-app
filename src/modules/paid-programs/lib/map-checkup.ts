import { CheckupItem } from '@/api/generated/data-contracts';

import { PaidProgram, PaidProgramCoverage } from '../types';

/**
 * Check-ups are ours rather than the MIS's, so the payload already arrives split into
 * a title, a price and a service list — no description parsing needed, unlike
 * `mapPayProgram`. Every field is optional in the generated contract; what the
 * backend leaves null (description, duration) the card and drawer simply hide.
 */
export const mapCheckup = (item: CheckupItem): PaidProgram => ({
  id: item.id || '',
  code: item.code,
  category: 'CHECKUP',
  coverage: (item.coverage as PaidProgramCoverage | undefined) || 'PERSONAL',
  title: item.title || '',
  price: item.price || 0,
  description: item.description || '',
  duration: item.duration || undefined,
  services: item.services || [],
  popular: item.popular,
});
