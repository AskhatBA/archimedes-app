import { QrAppointmentItem } from './generated/data-contracts';
import { HttpClient } from './generated/http-client';

/**
 * Whose referrals to read: the account owner's by default, or a relative's with
 * `familyMemberId` + `programId` — the backend accepts the pair only when the insurer
 * lists the relative in that programme's family.
 */
interface QrPatientQuery {
  familyMemberId?: string;
  programId?: string;
}

/**
 * The clinic-QR referral endpoints, with the relative the generated
 * `insuranceApi.qrAppointmentsList` / `qrSubmitAppointmentList` predate. Running
 * `npm run generate-api` against the updated backend makes this redundant.
 */
export class InsuranceQrApi extends HttpClient {
  /** Referrals to the clinic whose QR was scanned. */
  appointmentsList = (query: { clinicId: string } & QrPatientQuery) =>
    this.request<{ success?: boolean; data?: QrAppointmentItem[] }, void>({
      path: '/insurance/qr/appointments',
      method: 'GET',
      query,
      secure: true,
      format: 'json',
    });

  /** Confirms a referral — for the same person it was listed for. */
  submitAppointment = (
    query: { clinicId: string; appCode: number } & QrPatientQuery,
  ) =>
    this.request<{ success?: boolean; data?: object }, void>({
      path: '/insurance/qr/submit-appointment',
      method: 'GET',
      query,
      secure: true,
      format: 'json',
    });
}
