import { useQuery } from '@tanstack/react-query';

import { insuranceApi } from '@/api';

export const useElectronicReferrals = (programId: string) => {
  const { data: electronicReferrals, isLoading: loadingElectronicReferrals } =
    useQuery({
      queryKey: ['electronic-referrals', programId],
      queryFn: async () =>
        (await insuranceApi.electronicReferralsList({ programId })).data,
      enabled: !!programId,
    });

  return {
    electronicReferrals,
    loadingElectronicReferrals,
  };
};
