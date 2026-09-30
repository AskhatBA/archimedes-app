import {
  getAnalytics,
  logEvent,
  setAnalyticsCollectionEnabled,
} from '@react-native-firebase/analytics';
import { getApp } from '@react-native-firebase/app';
import { initializePerformance } from '@react-native-firebase/perf';

type AnalyticsParams = Record<string, string | number | boolean | undefined>;

// A debug build is a developer poking at the app, so it stays out of the reports.
// Crashlytics already skips debug builds by itself (`crashlytics_debug_enabled` in
// firebase.json). Both switches below are persisted natively, so they also hold for
// what the SDKs collect on the next launch before JS is up.
const COLLECTION_ENABLED = !__DEV__;

export const initAnalytics = async (): Promise<void> => {
  try {
    await Promise.all([
      setAnalyticsCollectionEnabled(getAnalytics(), COLLECTION_ENABLED),
      initializePerformance(getApp(), {
        dataCollectionEnabled: COLLECTION_ENABLED,
      }),
    ]);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn('[analytics] failed to initialise', error);
  }
};

export const logAnalyticsEvent = async (
  name: string,
  params?: AnalyticsParams,
): Promise<void> => {
  try {
    await logEvent(getAnalytics(), name, params);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn(`[analytics] failed to log "${name}"`, error);
  }
};

// Only the route name is sent — never its params, which can carry ids and personal data.
export const logScreenView = (screenName: string): Promise<void> =>
  logAnalyticsEvent('screen_view', {
    screen_name: screenName,
    screen_class: screenName,
  });

export const AnalyticsEvents = {
  AppointmentCreated: 'appointment_created',
  CompensationRequestCreated: 'compensation_request_created',
} as const;
