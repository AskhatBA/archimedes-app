const KZ_PHONE_REGEX = /^(\d)(\d{3})(\d{3})(\d{2})(\d{2})$/;

/** Strips the mask: "+7 (777) 140-09-62" -> "77771400962". */
export const toRawPhone = (phone?: string): string =>
  (phone || '').replace(/\D/g, '');

/**
 * The inverse, for pre-filling the phone field from a number the app already
 * holds in API form.
 */
export const toMaskedPhone = (phone?: string): string => {
  const match = toRawPhone(phone).match(KZ_PHONE_REGEX);

  if (!match) return '';

  const [, , areaCode, first, second, third] = match;
  return `+7 (${areaCode}) ${first}-${second}-${third}`;
};
