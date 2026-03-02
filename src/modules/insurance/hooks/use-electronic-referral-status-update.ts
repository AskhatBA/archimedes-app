import { useMutation } from '@tanstack/react-query';

import {
  ElectronicReferralServiceStatus,
  insuranceApi,
  resolveErrorMessage,
} from '@/api';
import { useToast } from '@/shared/lib/toast';

import { ElectronicReferralStatus } from '../types';

interface UseElectronicReferralStatusUpdateInput {
  electronicReferralId: string;
  status: ElectronicReferralStatus;
}

export const useElectronicReferralStatusUpdate = () => {
  const { showToast } = useToast();

  const electronicReferralStatusUpdateMutation = useMutation({
    mutationFn: async (payload: UseElectronicReferralStatusUpdateInput) =>
      (
        await insuranceApi.electronicReferralsServiceStatusPartialUpdate(
          payload.electronicReferralId,
          {
            serviceStatus:
              payload.status as unknown as ElectronicReferralServiceStatus,
          },
        )
      ).data,
    onError: error => {
      showToast({
        message: resolveErrorMessage(error),
        type: 'error',
      });
    },
    onSuccess: () => {
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
