import { MedicServiceItem, ServicePrice, TelemedicineOffer } from '@/api';
import { discountedPriceOf } from '@/modules/insurance/hooks/use-service-price';

import { VisitPrice } from '../types';

export interface VisitPriceInput {
  isTelemedicine: boolean;
  /** No programme selected — the visit is paid for per booking. */
  isPaidVisit: boolean;
  /** Booked under the `isMedAccount` programme. */
  isMedAccountVisit: boolean;
  /** `GET /appointments/telemedicine`; only read for a paid or med-account telemedicine visit. */
  telemedicineOffer: TelemedicineOffer | null;
  /** The doctor's own service; only read for an in-person visit. */
  medicService: Pick<MedicServiceItem, 'price' | 'service'> | null;
  /** The insurer's price for the doctor's service, with the med-account discount. */
  servicePrice: ServicePrice | null;
  loadingServicePrice: boolean;
}

/**
 * What the booking form's price card shows, and what a paid visit is charged —
 * `discountedPrice ?? price` — so the patient never pays other than what they were shown.
 * `null` means no price card, and for a paid visit also "not ready to check out yet".
 *
 * - Telemedicine is one service at one price of the backend's, whichever doctor holds it,
 *   with no med-account discount. A paid visit and a med-account one show it; under any
 *   other programme the insurer pays and the patient is shown nothing.
 * - A paid in-person visit costs the doctor's own price, less the med-account discount when
 *   the insurer gives one. It waits for that lookup to settle, and a failed one costs the
 *   patient the discount, never the booking.
 * - An in-person med-account visit shows the insurer's price for the service.
 * - Any other programme is paid by the insurer.
 */
export const visitPriceOf = ({
  isTelemedicine,
  isPaidVisit,
  isMedAccountVisit,
  telemedicineOffer,
  medicService,
  servicePrice,
  loadingServicePrice,
}: VisitPriceInput): VisitPrice | null => {
  if (isTelemedicine) {
    if (!(isPaidVisit || isMedAccountVisit) || !telemedicineOffer) return null;
    return {
      price: telemedicineOffer.price,
      discountedPrice: null,
      serviceName: telemedicineOffer.serviceName,
    };
  }

  if (!medicService) return null;

  if (isPaidVisit) {
    if (loadingServicePrice) return null;
    return {
      price: medicService.price,
      discountedPrice: discountedPriceOf(servicePrice),
      serviceName: medicService.service,
    };
  }

  if (isMedAccountVisit && servicePrice) {
    return {
      price: servicePrice.price,
      discountedPrice: discountedPriceOf(servicePrice),
      serviceName: medicService.service,
    };
  }

  return null;
};
