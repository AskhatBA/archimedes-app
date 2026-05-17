import analytics from '@react-native-firebase/analytics';

type AnalyticsParams = Record<string, string | number | boolean | undefined>;

export const logAnalyticsEvent = async (
  name: string,
  params?: AnalyticsParams,
): Promise<void> => {
  try {
    await analytics().logEvent(name, params);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn(`[analytics] failed to log "${name}"`, error);
  }
};

export const AnalyticsEvents = {
  AppointmentCreated: 'appointment_created',
  CompensationRequestCreated: 'compensation_request_created',
} as const;
