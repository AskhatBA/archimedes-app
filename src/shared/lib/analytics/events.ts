/**
 * Every event the app reports, with the parameters it may carry. This is the code side of
 * the Tracking Plan: an event that is not listed here cannot be logged, so adding one
 * starts with agreeing it in the plan and then adding it here — the same name goes to
 * Firebase and AppMetrica on both platforms.
 *
 * Parameters are ids of catalogue entities (clinic, doctor, programme), coarse
 * categories, counts and flags. Never a name, phone, IIN, email, policy number, amount
 * of money, diagnosis or free text: the user is already known by the anonymous id set in
 * `setAnalyticsUser`, and nothing else about them belongs in analytics.
 */
export interface AnalyticsEventParams {
  appointment_created: {
    branch_id?: string;
    specialization_id?: string;
    doctor_id?: string;
    program_id?: string;
    is_telemedicine: boolean;
    paid?: boolean;
  };
  compensation_request_created: {
    program_id?: string;
    /** The kind of care (0 outpatient, 2 inpatient, 4 dentistry, 5 medicines). */
    category?: number;
    files_count: number;
  };
}

export type AnalyticsEventName = keyof AnalyticsEventParams;

export const AnalyticsEvents = {
  AppointmentCreated: 'appointment_created',
  CompensationRequestCreated: 'compensation_request_created',
} as const satisfies Record<string, AnalyticsEventName>;

type EventParamValue = string | number | boolean;

/** Drops the parameters left unset, which neither SDK has a use for. */
export const toEventParams = (
  params: Record<string, EventParamValue | undefined>,
): Record<string, EventParamValue> => {
  const defined: Record<string, EventParamValue> = {};

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) defined[key] = value;
  });

  return defined;
};
