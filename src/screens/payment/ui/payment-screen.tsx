import { RouteProp, useRoute } from '@react-navigation/native';
import { FC } from 'react';

import { usePurchases } from '@/modules/paid-programs';
import { PaymentWebView } from '@/modules/payment';
import { usePageHeader } from '@/shared/hooks';

type PaymentRouteParams = {
  Payment: {
    amount?: number;
    description?: string;
    /** Set when the payment settles a paid-programs purchase held on the device. */
    purchaseId?: string;
  };
};

export const PaymentScreen: FC = () => {
  usePageHeader({ title: 'Оплата' });

  const { params } = useRoute<RouteProp<PaymentRouteParams, 'Payment'>>();
  const { settlePurchase } = usePurchases();

  const purchaseId = params?.purchaseId;

  // Without an amount the WebView falls back to its own form, which is the browser flow.
  return (
    <PaymentWebView
      amount={params?.amount}
      description={params?.description}
      onResult={({ status, paymentId }) => {
        if (!purchaseId) return;
        settlePurchase(purchaseId, { paymentId, status });
      }}
    />
  );
};
