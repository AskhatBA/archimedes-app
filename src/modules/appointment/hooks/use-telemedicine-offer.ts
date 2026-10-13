import { useQuery } from '@tanstack/react-query';

import { appointmentApi } from '@/api';

export const TELEMEDICINE_OFFER_QUERY = ['appointments', 'telemedicine'];

/**
 * Price and name of an online consultation, from our backend.
 *
 * Only a paid or med-account telemedicine visit needs it — under any other programme the
 * patient is shown no price — so the caller switches it on with `enabled`. `staleTime: 0`: the backend
 * refuses checkout at any sum but its current price, so the figure is re-read whenever the
 * form mounts rather than trusted from an old cache.
 */
export const useTelemedicineOffer = (enabled: boolean) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: TELEMEDICINE_OFFER_QUERY,
    queryFn: async () =>
      (await appointmentApi.telemedicineDetail()).data?.telemedicine ?? null,
    enabled,
    staleTime: 0,
  });

  return { telemedicineOffer: data ?? null, isLoading, isError };
};
