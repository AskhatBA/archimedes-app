import { useMutation, useQueryClient } from '@tanstack/react-query';

import { notificationsApi, resolveErrorMessage } from '@/api';
import { useToast } from '@/shared/lib/toast';

export const useMarkAllNotificationsRead = () => {
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  const markAllNotificationsReadMutation = useMutation({
    mutationFn: async () => await notificationsApi.readAllPartialUpdate(),
    onError: error => {
      showToast({
        message: resolveErrorMessage(error),
        type: 'error',
      });
    },
    onSuccess: () => {
      showToast({
        message: 'Все уведомления отмечены как прочитанные',
        type: 'success',
      });
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['unread-count'] });
    },
  });

  return {
    markAllAsRead: markAllNotificationsReadMutation.mutateAsync,
    isLoading: markAllNotificationsReadMutation.isPending,
  };
};
