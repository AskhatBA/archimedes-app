import { useQuery } from '@tanstack/react-query';

import { insuranceApi } from '@/api';

export const useUserCompensationRequests = () => {
  const { data: compensationRequests, isLoading: loadingCompensationRequests } =
    useQuery({
      queryKey: ['user-compensation-requests'],
      queryFn: async () =>
        (await insuranceApi.refundRequestsList()).data?.refundRequests,
    });

  return {
    compensationRequests,
    loadingCompensationRequests,
  };
};
