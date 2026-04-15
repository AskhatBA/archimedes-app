import { useMutation, useQueryClient } from '@tanstack/react-query';

import { notificationsApi, resolveErrorMessage } from '@/api';
import { useToast } from '@/shared/lib/toast';

interface UseMarkNotificationReadInput {
  notificationId: string;
}

export const useMarkNotificationRead = () => {
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  const markNotificationReadMutation = useMutation({
    mutationFn: async (payload: UseMarkNotificationReadInput) =>
      await notificationsApi.readPartialUpdate(payload.notificationId),
    onError: error => {
      showToast({
        message: resolveErrorMessage(error),
        type: 'error',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['unread-count'] });
    },
  });

  return {
    markAsRead: markNotificationReadMutation.mutateAsync,
    isLoading: markNotificationReadMutation.isPending,
  };
};
