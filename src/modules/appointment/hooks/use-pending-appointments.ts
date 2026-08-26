import { useMemo } from 'react';

import { PendingPayment } from '@/api';
import { usePendingPayments } from '@/modules/payment';

/** An appointment the patient has paid for but whose payment has not settled yet. */
export interface PendingAppointment {
  paymentId: string;
  amount: number;
  startTime?: string;
  doctorName?: string;
  branchName?: string;
  branchAddress?: string;
  serviceName?: string;
  isTelemedicine: boolean;
  createdAt: string;
}

const readString = (
  metadata: PendingPayment['metadata'],
  key: string,
): string | undefined => {
  const value = metadata?.[key];
  return typeof value === 'string' && value !== '' ? value : undefined;
};

/**
 * Appointments that exist only as an unsettled payment.
 *
 * A paid patient's visit is booked server-side when the payment succeeds, so between
 * paying and the provider confirming there is nothing in MIS to list. These stand in for
 * that gap and vanish on their own once the payment settles — either the booking shows up
 * in the real list, or the payment failed and there was never an appointment.
 */
export const usePendingAppointments = () => {
  const { pendingPayments, isLoading } = usePendingPayments('APPOINTMENT');

  const pendingAppointments = useMemo(
    (): PendingAppointment[] =>
      pendingPayments.map(payment => ({
        paymentId: payment.id,
        amount: payment.amount,
        startTime: readString(payment.metadata, 'startTime'),
        doctorName: readString(payment.metadata, 'doctorName'),
        branchName: readString(payment.metadata, 'branchName'),
        branchAddress: readString(payment.metadata, 'branchAddress'),
        serviceName:
          readString(payment.metadata, 'serviceName') || payment.description,
        isTelemedicine: payment.metadata?.isTelemedicine === true,
        createdAt: payment.createdAt,
      })),
    [pendingPayments],
  );

  return { pendingAppointments, isLoading };
};
