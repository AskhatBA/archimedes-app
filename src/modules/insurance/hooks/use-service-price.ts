import { useQuery } from '@tanstack/react-query';

import { insuranceApi, ServicePrice } from '@/api';

/**
 * The discount to show next to the struck-out full price: the med-account price when the
 * insurer gives one for the service, `null` when the full price applies. The backend
 * already folds an empty or zero one into `null`; the check stays so the rule lives in one
 * place for both the price card and the amount a paid visit is charged.
 */
export const discountedPriceOf = (
  servicePrice: ServicePrice | null | undefined,
): number | null => {
  const discounted = servicePrice?.priceMedAccount;
  return discounted != null && discounted > 0 ? discounted : null;
};

/**
 * Price of a service at a clinic from the insurer: the full `price` and, when it has one,
 * the lower `priceMedAccount`.
 *
 * Read for a visit under the `isMedAccount` programme and for a paid visit — both show the
 * discount — so the caller switches it on with `enabled`; any other programme is paid by
 * the insurer and needs no price.
 */
export const useServicePrice = (
  clinicId?: string | null,
  serviceId?: string | null,
  enabled = true,
) => {
  const { data, isLoading } = useQuery({
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

  return { servicePrice: data ?? null, isLoading };
};
