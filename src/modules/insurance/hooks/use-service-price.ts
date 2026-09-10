import { useQuery } from '@tanstack/react-query';

import { insuranceApi } from '@/api';

/**
 * Price of a service at a clinic for a visit paid from the medical account ("медсчёт"):
 * the full `price` and, when the insurer has one, the lower `priceMedAccount`.
 *
 * Only a visit booked under the `isMedAccount` programme shows it, so the caller switches
 * it on with `enabled` — a paid visit is charged `useMedicService`'s price instead. An
 * empty or zero med-account price already comes back from the backend as `null`.
 */
export const useServicePrice = (
  clinicId?: string | null,
  serviceId?: string | null,
  enabled = true,
) => {
  const { data } = useQuery({
    queryKey: ['insurance', 'service-price', clinicId, serviceId],
    queryFn: async () =>
      (
        await insuranceApi.servicePriceList({
          clinicId: clinicId!,
          serviceId: serviceId!,
        })
      ).data?.servicePrice ?? null,
    enabled: enabled && !!clinicId && !!serviceId,
    staleTime: 1000 * 60 * 5,
  });

  return { servicePrice: data ?? null };
};
