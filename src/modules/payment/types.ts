export type PaymentStatus = 'PENDING' | 'SUCCESS' | 'FAILED';

export interface PaymentResultPayload {
  status: PaymentStatus;
  paymentId?: string;
  amount?: number;
}

export interface ToastPayload {
  message: string;
  type?: 'success' | 'error' | 'info';
}
