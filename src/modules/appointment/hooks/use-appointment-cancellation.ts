import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  appointmentApi,
  AppointmentCancellationPreview,
  AppointmentCancellationResult,
} from '@/api';
import {
  GET_APPOINTMENT_DETAILS_QUERY,
  GET_BOOKING_HISTORY_QUERY,
} from '@/shared/constants';

/** Backend error code carried in `response.data.message`, if this was an API refusal. */
export const cancellationErrorCode = (error: unknown): string | undefined =>
  (error as { response?: { data?: { message?: string } } } | undefined)
    ?.response?.data?.message;

/**
 * What cancelling this visit would cost, asked before the patient commits.
 *
 * Kept separate from the cancel itself because the answer moves with the clock: the
 * refund is 100% up to twelve hours before the visit and 70% after, so the number shown
 * has to be the backend's own, read at the moment the sheet opens rather than computed
 * on the device. Only fetched while `enabled` — normally while the confirm sheet is up.
 *
 * A visit that can no longer be cancelled fails here too, with the same codes as the
 * cancel, so the sheet can say why instead of offering a button that will not work.
 */
export const useCancellationPreview = (
  appointmentId: string,
  enabled: boolean,
) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['appointment-cancellation', appointmentId],
    queryFn: async (): Promise<AppointmentCancellationPreview> =>
      (await appointmentApi.cancellationDetail(appointmentId)).data,
    enabled: enabled && Boolean(appointmentId),
    // The split depends on how far the visit is away, so a cached answer from an hour
    // ago can be the wrong one.
    staleTime: 0,
    gcTime: 0,
    retry: false,
  });

  return { preview: data, isPreviewLoading: isLoading, previewError: error };
};

/**
 * Cancels the visit.
 *
 * The backend removes it in MIS first and only then records what it owes, so a rejection
 * here means nothing was changed — the visit is still booked and no money moved. On
 * success the refund comes back `PENDING`: the reversal is queued for FreedomPay, not
 * completed, and the wording on screen has to match that.
 */
export const useCancelAppointment = () => {
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (
      appointmentId: string,
    ): Promise<AppointmentCancellationResult> =>
      (await appointmentApi.cancelPartialUpdate(appointmentId)).data,
    onSettled: (_data, _error, appointmentId) => {
      // Every list on screen is proxied live from MIS, and the visit has just left it.
      // Invalidated even on failure: a cancellation that timed out may well have landed.
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      queryClient.invalidateQueries({ queryKey: ['appointments-history'] });
      queryClient.invalidateQueries({ queryKey: ['appointment-requests'] });
      // The booking history is ours, and the row has just moved to CANCELLED with a refund.
      queryClient.invalidateQueries({ queryKey: [GET_BOOKING_HISTORY_QUERY] });
      queryClient.invalidateQueries({
        queryKey: [GET_APPOINTMENT_DETAILS_QUERY, appointmentId],
      });
      queryClient.invalidateQueries({
        queryKey: ['appointment-cancellation', appointmentId],
      });
    },
  });

  return { cancelAppointment: mutateAsync, isCancelling: isPending };
};
