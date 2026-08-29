import {
  NavigationAction,
  RouteProp,
  useNavigation as useReactNavigation,
  usePreventRemove,
  useRoute,
} from '@react-navigation/native';
import { FC, useCallback, useEffect, useRef, useState } from 'react';

import {
  CancelPaymentDrawer,
  PaymentWebView,
  ProviderPaymentWebView,
  useCancelPayment,
} from '@/modules/payment';
import { usePageHeader } from '@/shared/hooks';
import { useTranslation } from '@/shared/lib/i18n';
import { useToast } from '@/shared/lib/toast';
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
    /**
     * The payment behind `paymentUrl`. Given when leaving this screen would otherwise
     * strand the payer: there is no way back to a provider URL once it is off the stack,
     * so the exit has to offer to give the payment up instead.
     */
    paymentId?: string;
  };
};

export const PaymentScreen: FC = () => {
  usePageHeader({ title: 'Оплата' });

  const { params } = useRoute<RouteProp<PaymentRouteParams, 'Payment'>>();
  const { goBack } = useNavigation();
  const navigation = useReactNavigation();
  const { showToast } = useToast();
  const { t } = useTranslation();
  const { cancelPayment, isCancelling } = useCancelPayment();

  const paymentId = params?.paymentId;

  const [isExitPromptVisible, setIsExitPromptVisible] = useState(false);
  /** Set once leaving is settled, which is also what lets the guard step aside. */
  const [isLeaving, setIsLeaving] = useState(false);
  /** The navigation the guard held back, replayed once the payer has decided. */
  const [heldAction, setHeldAction] = useState<NavigationAction | null>(null);

  /**
   * Guards every way off this screen — the header's back button, the Android hardware
   * back and the iOS swipe gesture all go through the same navigation action.
   */
  usePreventRemove(
    !!paymentId && !isLeaving,
    useCallback(({ data }) => {
      setHeldAction(data.action);
      setIsExitPromptVisible(true);
    }, []),
  );

  /** Leaving happens exactly once, however many times this effect is re-run. */
  const hasLeftRef = useRef(false);

  // Deferred to an effect so the guard has re-rendered as inactive before the held
  // navigation is replayed — dispatching in the same tick would just be blocked again.
  useEffect(() => {
    if (!isLeaving || hasLeftRef.current) return;
    hasLeftRef.current = true;

    if (heldAction) navigation.dispatch(heldAction);
    else goBack();
  }, [isLeaving, heldAction, navigation, goBack]);

  const leave = () => {
    setIsExitPromptVisible(false);
    setIsLeaving(true);
  };

  const confirmCancel = async () => {
    if (!paymentId) {
      leave();
      return;
    }

    try {
      const payment = await cancelPayment(paymentId);

      // Cancelling is a request, not a guarantee: the card may have been charged while
      // the sheet was open, in which case the backend booked what was paid for and the
      // payer must be told that instead of "cancelled".
      if (payment.status === 'SUCCESS') {
        showToast({
          message: t('payment:cancel.alreadyPaid'),
          type: 'success',
        });
      } else {
        showToast({ message: t('payment:cancel.done'), type: 'info' });
      }
    } catch {
      // Leaving anyway. A failed cancel means the payment is still pending, but keeping
      // the payer on a page they asked twice to leave — offline, or with an expired
      // session — is the worse trap of the two, and the "waiting for payment" card they
      // land on carries the same cancel action to try again.
      showToast({ message: t('payment:cancel.error'), type: 'error' });
    }

    leave();
  };

  const exitPrompt = paymentId ? (
    <CancelPaymentDrawer
      visible={isExitPromptVisible}
      onClose={() => setIsExitPromptVisible(false)}
      onConfirm={confirmCancel}
      isCancelling={isCancelling}
      title={t('payment:cancel.title')}
      description={t('payment:cancel.description')}
      confirmLabel={t('payment:cancel.confirm')}
    />
  ) : null;

  // The payment already exists: just host the provider page and step aside once the payer
  // is done. Whoever created the payment is watching its status and acts on the outcome.
  if (params?.paymentUrl) {
    return (
      <>
        <ProviderPaymentWebView
          paymentUrl={params.paymentUrl}
          // The payer reached a return URL, so there is nothing left to give up on —
          // leave without the prompt and let the watcher report the outcome.
          onReturn={leave}
        />
        {exitPrompt}
      </>
    );
  }

  // Without an amount the WebView falls back to its own form, which is the browser flow.
  return (
    <>
      <PaymentWebView
        amount={params?.amount}
        description={params?.description}
      />
      {exitPrompt}
    </>
  );
};
