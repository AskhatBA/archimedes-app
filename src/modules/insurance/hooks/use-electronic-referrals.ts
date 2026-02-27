import { useQuery } from '@tanstack/react-query';

import { insuranceApi } from '@/api';
import { GET_INSURANCE_ELECTRONIC_REFERRALS } from '@/shared/constants';

import { electronicReferralsMock } from './mocks/electronic-referrals-mock';

export const useElectronicReferrals = (programId: string) => {
  const { data: electronicReferrals, isLoading: loadingElectronicReferrals } =
    useQuery({
      queryKey: [GET_INSURANCE_ELECTRONIC_REFERRALS, programId],
      queryFn: async () =>
        (await insuranceApi.electronicReferralsList({ programId })).data,
      enabled: !!programId,
    });

  return {
    electronicReferrals: { electronicReferrals: electronicReferralsMock },
    loadingElectronicReferrals,
  };
};
