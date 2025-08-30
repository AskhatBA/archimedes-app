import { useQuery } from '@tanstack/react-query';

import { misApi } from '@/api';

export const useAvailableSlots = (
  doctorId?: string,
  startDate?: string,
  endDate?: string,
) => {
  const { data: availableSlots, isLoading: loadingAvailableSlots } = useQuery({
    queryKey: ['available-slots', doctorId, startDate, endDate],
    queryFn: async () =>
      (
        await misApi.doctorAvailableSlotsDetail(doctorId, {
          startDate,
          endDate,
        })
      ).data.availableSlots,

    enabled: !!doctorId && !!startDate && !!endDate,
  });

  return {
    availableSlots,
    loadingAvailableSlots,
  };
};
