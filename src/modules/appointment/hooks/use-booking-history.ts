import { useQuery } from '@tanstack/react-query';

import { appointmentApi, AppointmentHistoryItem } from '@/api';
import { GET_BOOKING_HISTORY_QUERY } from '@/shared/constants';
import { useRefetchOnScreenFocus } from '@/shared/hooks';

/**
 * Every visit the patient booked through the app, newest first — read from our own
 * backend table rather than the MIS proxy, so cancelled visits and their refunds are there
 * too.
 *
 * Re-read on screen focus: the status is moved by the backend's MIS sweep and a refund by
 * FreedomPay, both while the patient is elsewhere.
 */
export const useBookingHistory = () => {
  const { data, isLoading, isFetching, isError, refetch } = useQuery({
    queryKey: [GET_BOOKING_HISTORY_QUERY],
    queryFn: async (): Promise<AppointmentHistoryItem[]> =>
      (await appointmentApi.historyList()).data?.appointments || [],
  });

  useRefetchOnScreenFocus(refetch);

  return {
    bookings: data || [],
    loadingBookings: isLoading,
    fetchingBookings: isFetching,
    bookingsError: isError,
    refetchBookings: refetch,
  };
};
