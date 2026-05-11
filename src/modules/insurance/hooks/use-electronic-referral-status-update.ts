import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
  ElectronicReferralServiceStatus,
  insuranceApi,
  resolveErrorMessage,
} from '@/api';
import { GET_INSURANCE_ELECTRONIC_REFERRALS } from '@/shared/constants';
import { useToast } from '@/shared/lib/toast';

import { ElectronicReferralStatus } from '../types';

interface UseElectronicReferralStatusUpdateInput {
  electronicReferralId: string;
  status: ElectronicReferralStatus;
  satisfactionLevel?: number | null;
}

export const useElectronicReferralStatusUpdate = () => {
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  const electronicReferralStatusUpdateMutation = useMutation({
    mutationFn: async (payload: UseElectronicReferralStatusUpdateInput) =>
      (
        await insuranceApi.electronicReferralsServiceStatusPartialUpdate(
          payload.electronicReferralId,
          {
            serviceStatus:
              payload.status as unknown as ElectronicReferralServiceStatus,
            ...(payload.satisfactionLevel != null && {
              satisfactionLevel: payload.satisfactionLevel?.toString(),
            }),
          } as Parameters<
            typeof insuranceApi.electronicReferralsServiceStatusPartialUpdate
          >[1],
        )
      ).data,
    onError: error => {
      showToast({
        message: resolveErrorMessage(error),
        type: 'error',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [GET_INSURANCE_ELECTRONIC_REFERRALS],
      });
      showToast({
        message: 'Статус успешно обновлен',
        type: 'success',
      });
    },
  });

  return {
    updateElectronicReferralStatus:
      electronicReferralStatusUpdateMutation.mutateAsync,
    isLoading: electronicReferralStatusUpdateMutation.isPending,
  };
};
