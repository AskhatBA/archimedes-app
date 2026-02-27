import { useQuery } from '@tanstack/react-query';

import { insuranceApi } from '@/api';
import { GET_COMPENSATION_REQUESTS_QUERY } from '@/shared/constants';

export const useUserCompensationRequests = () => {
  const { data: compensationRequests, isLoading: loadingCompensationRequests } =
    useQuery({
      queryKey: [GET_COMPENSATION_REQUESTS_QUERY],
      queryFn: async () =>
        (await insuranceApi.refundRequestsList()).data?.refundRequests,
    });

  return {
    compensationRequests,
    loadingCompensationRequests,
  };
};
