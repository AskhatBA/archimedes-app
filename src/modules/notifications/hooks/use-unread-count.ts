import { useQuery } from '@tanstack/react-query';

import { notificationsApi } from '@/api';

export const useUnreadCount = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['unread-count'],
    queryFn: async () => {
      const response = await notificationsApi.unreadCountList();
      return response.data?.data?.count || 0;
    },
  });

  return {
    unreadCount: data,
    isLoading,
  };
};
