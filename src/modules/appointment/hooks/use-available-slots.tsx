import { useQuery } from '@tanstack/react-query';

import { misApi } from '@/api';
import { GET_DOCTOR_AVAILABLE_SLOTS_QUERY } from '@/shared/constants';

export const useAvailableSlots = (
  doctorId?: string,
  startDate?: string,
  endDate?: string,
) => {
  const { data: availableSlots, isLoading: loadingAvailableSlots } = useQuery({
    queryKey: [GET_DOCTOR_AVAILABLE_SLOTS_QUERY, doctorId, startDate, endDate],
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
