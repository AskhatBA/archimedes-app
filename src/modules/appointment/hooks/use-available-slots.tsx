import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';

import { misApi } from '@/api';
import { GET_DOCTOR_AVAILABLE_SLOTS_QUERY } from '@/shared/constants';

export const useAvailableSlots = (doctorId?: string) => {
  const today = dayjs();

  const { data: availableSlots, isLoading: loadingAvailableSlots } = useQuery({
    queryKey: [GET_DOCTOR_AVAILABLE_SLOTS_QUERY, doctorId],
    queryFn: async () =>
      (
        await misApi.doctorAvailableSlotsDetail(doctorId, {
          startDate: today.format('YYYY-MM-DD'),
          endDate: today.add(14, 'day').format('YYYY-MM-DD'),
        })
      ).data.availableSlots,
    enabled: !!doctorId,
  });

  return {
    availableSlots,
    loadingAvailableSlots,
  };
};
