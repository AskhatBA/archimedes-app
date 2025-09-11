import { useMutation } from '@tanstack/react-query';

import { insuranceApi, RefundRequestBody } from '@/api';

export const useCompensationRequest = () => {
  const refundRequestMutation = useMutation({
    mutationFn: async (data: RefundRequestBody) =>
      (await insuranceApi.refundRequestCreate(data)).data,
  });

  return {
    sendCompensationRequest: refundRequestMutation.mutate,
    isLoading: refundRequestMutation.isPending,
  };
};
