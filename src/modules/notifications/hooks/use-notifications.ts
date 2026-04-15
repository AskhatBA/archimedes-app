import { useQuery } from '@tanstack/react-query';

import { notificationsApi } from '@/api';

interface UseNotificationsInput {
  limit?: number;
  offset?: number;
}

export const useNotifications = (props?: UseNotificationsInput) => {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['notifications', props?.limit, props?.offset],
    queryFn: async () => {
      const response = await notificationsApi.notificationsList({
        limit: props?.limit || 50,
        offset: props?.offset || 0,
      });
      return response.data?.data || [];
    },
  });

  return {
    notifications: data,
    isLoading,
    refetch,
  };
};
