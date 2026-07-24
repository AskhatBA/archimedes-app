import { useQuery } from '@tanstack/react-query';

import { insuranceApi } from '@/api';

export const usePriceList = (clinicId: string | null) => {
  const { data, isLoading } = useQuery({
    queryKey: ['insurance', 'price-list', clinicId],
    queryFn: async () =>
      (await insuranceApi.priceListList({ clinicId: clinicId! })).data?.priceList || [],
    enabled: !!clinicId,
    staleTime: 1000 * 60 * 5,
  });

  return { priceList: data || [], isLoading };
};
