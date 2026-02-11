import { useMutation } from '@tanstack/react-query';

import { CreatePatientBody, patientApi, resolveErrorMessage } from '@/api';
import { useToast } from '@/shared/lib/toast';

export const useUpdateUserProfile = () => {
  const { showToast } = useToast();

  const userProfileMutation = useMutation({
    mutationFn: async (userData: CreatePatientBody) =>
      (await patientApi.profileCreate(userData)).data,
    onSuccess: () => {
      showToast({
        type: 'success',
        message: 'profile.successSaveMessage',
        duration: 5000,
      });
    },
    onError: error => {
      showToast({
        type: 'error',
        message: resolveErrorMessage(error),
        duration: 5000,
      });
    },
  });

  return {
    updateUserProfile: userProfileMutation.mutate,
  };
};
