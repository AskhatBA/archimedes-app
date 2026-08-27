import { RouteProp, useRoute } from '@react-navigation/native';
import { FC } from 'react';

import { PaymentWebView, ProviderPaymentWebView } from '@/modules/payment';
import { usePageHeader } from '@/shared/hooks';
import { useNavigation } from '@/shared/navigation';

type PaymentRouteParams = {
  Payment: {
    amount?: number;
    description?: string;
    /**
     * Provider URL from `/payment/init`, for flows that create the payment themselves
     * (they need to attach a purpose and metadata the web page knows nothing about).
     */
    paymentUrl?: string;
  };
};

export const PaymentScreen: FC = () => {
  usePageHeader({ title: 'Оплата' });

  const { params } = useRoute<RouteProp<PaymentRouteParams, 'Payment'>>();
  const { goBack } = useNavigation();

  // The payment already exists: just host the provider page and step aside once the payer
  // is done. Whoever created the payment is watching its status and acts on the outcome.
  if (params?.paymentUrl) {
    return (
      <ProviderPaymentWebView
        paymentUrl={params.paymentUrl}
        onReturn={() => goBack()}
      />
    );
  }

  // Without an amount the WebView falls back to its own form, which is the browser flow.
  return (
    <PaymentWebView amount={params?.amount} description={params?.description} />
  );
};
