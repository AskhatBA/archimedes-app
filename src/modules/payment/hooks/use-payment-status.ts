import { useQuery } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';

import { paymentApi, PaymentRecord } from '@/api';

import { PaymentStatus } from '../types';

const POLL_INTERVAL_MS = 3000;

const isSettled = (status?: PaymentStatus) =>
  status === 'SUCCESS' || status === 'FAILED';

interface UsePaymentStatusOptions {
  /** Fires once, when the payment settles as SUCCESS. */
  onSuccess?: (payment: PaymentRecord) => void;
  /** Fires once, when the payment settles as FAILED. */
  onFailure?: (payment: PaymentRecord) => void;
  /** Poll every this many ms while the payment is still PENDING. */
  intervalMs?: number;
}

/**
 * Watches one payment until it reaches a terminal state.
 *
 * Deliberately generic: it only knows PENDING → SUCCESS/FAILED, never what the payment
 * was for. Whatever should happen afterwards is passed in by the caller, which mirrors
 * the backend's purpose handlers — the booking itself is done server-side when the
 * payment settles, and this is how the screen that started it finds out.
 *
 * `/payment/status/:id` is not a dumb read: for payments pending longer than a minute the
 * backend re-checks the provider, so polling here also rescues a lost result callback.
 * The callbacks fire at most once per payment id, so a refocus or refetch cannot book or
 * report the same thing twice.
 */
export const usePaymentStatus = (
  paymentId?: string | null,
  {
    onSuccess,
    onFailure,
    intervalMs = POLL_INTERVAL_MS,
  }: UsePaymentStatusOptions = {},
) => {
  const notifiedFor = useRef<string | null>(null);

  const { data: payment, isLoading } = useQuery({
    queryKey: ['payment', 'status', paymentId],
    queryFn: async () => (await paymentApi.statusDetail(paymentId!)).data,
    enabled: !!paymentId,
    // Stops polling as soon as the payment is settled; a settled one never changes again.
    refetchInterval: query =>
      isSettled(query.state.data?.status) ? false : intervalMs,
    refetchOnWindowFocus: true,
    staleTime: 0,
  });

  useEffect(() => {
    if (!payment || !paymentId) return;
    if (!isSettled(payment.status)) return;
    if (notifiedFor.current === paymentId) return;

    notifiedFor.current = paymentId;

    if (payment.status === 'SUCCESS') onSuccess?.(payment);
    else onFailure?.(payment);
  }, [payment, paymentId, onSuccess, onFailure]);

  return {
    payment,
    status: payment?.status,
    isSettled: isSettled(payment?.status),
    isLoading,
  };
};
