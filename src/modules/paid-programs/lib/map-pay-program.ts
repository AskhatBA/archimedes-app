import { PayProgramItem } from '@/api/generated/data-contracts';

import { PaidProgram } from '../types';

/**
 * The MIS ships the whole program as one `description` string: an optional intro
 * paragraph, then a `•`-prefixed list. Bullets wrap over hard line breaks mid-sentence,
 * so a line is not a bullet — only a `•` starts one.
 */
const splitDescription = (raw: string) => {
  const [intro, ...bullets] = (raw || '').split('•');

  const normalize = (chunk: string) =>
    chunk.replace(/\s+/g, ' ').trim().replace(/;$/, '');

  return {
    description: normalize(intro),
    services: bullets.map(normalize).filter(Boolean),
  };
};

/**
 * `coverage`, `duration` and `popular` have no counterpart in the MIS payload — the
 * card and the details drawer hide what is missing rather than inventing it.
 */
export const mapPayProgram = (item: PayProgramItem): PaidProgram => {
  const { description, services } = splitDescription(item.description);

  return {
    id: item.oid,
    code: item.code,
    category: 'MED_PLAN',
    title: item.name,
    price: item.price,
    description,
    services,
  };
};
