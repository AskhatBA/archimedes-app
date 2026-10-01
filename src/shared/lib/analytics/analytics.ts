import AppMetrica from '@appmetrica/react-native-analytics';
import {
  getAnalytics,
  logEvent,
  setAnalyticsCollectionEnabled,
  setUserId as setAnalyticsUserId,
} from '@react-native-firebase/analytics';
import { getApp } from '@react-native-firebase/app';
import {
  getCrashlytics,
  setUserId as setCrashlyticsUserId,
} from '@react-native-firebase/crashlytics';
import { initializePerformance } from '@react-native-firebase/perf';
import DeviceInfo from 'react-native-device-info';

import { APPMETRICA_API_KEY } from '@/shared/config';

import {
  AnalyticsEventName,
  AnalyticsEventParams,
  toEventParams,
} from './events';

// A debug build is a developer poking at the app, so it stays out of the reports.
// Crashlytics already skips debug builds by itself (`crashlytics_debug_enabled` in
// firebase.json). The Firebase switches below are persisted natively, so they also hold
// for what the SDKs collect on the next launch before JS is up.
const COLLECTION_ENABLED = !__DEV__;

const warn = (message: string, error: unknown) => {
  // eslint-disable-next-line no-console
  console.warn(`[analytics] ${message}`, error);
};

const activateAppMetrica = () => {
  AppMetrica.activate({
    apiKey: APPMETRICA_API_KEY,
    // Passed explicitly: on the New Architecture the bridge forwards absent keys as NSNull,
    // which the iOS SDK rejects with an error on every launch.
    appVersion: DeviceInfo.getVersion(),
    appBuildNumber: Number(DeviceInfo.getBuildNumber()),
    statisticsSending: COLLECTION_ENABLED,
    logs: __DEV__,
    // Crashes are Crashlytics' job; two SDKs catching the same signal only muddle both.
    crashReporting: false,
    nativeCrashReporting: false,
    locationTracking: false,
  });
};

// Called once, before the first render, so that nothing reports into an SDK that is not
// activated yet. Analytics must never be the reason the app fails to start, so every SDK
// is set up on its own and a failure is only logged.
export const initAnalytics = async (): Promise<void> => {
  try {
    activateAppMetrica();
  } catch (error) {
    warn('failed to activate AppMetrica', error);
  }

  try {
    await Promise.all([
      setAnalyticsCollectionEnabled(getAnalytics(), COLLECTION_ENABLED),
      initializePerformance(getApp(), {
        dataCollectionEnabled: COLLECTION_ENABLED,
      }),
    ]);
  } catch (error) {
    warn('failed to initialise Firebase', error);
  }
};

// The same id goes to every system, so a user can be followed across them and matched to
// our own database. It is `User.id` — a random UUID, never the phone, IIN or name.
export const setAnalyticsUser = async (
  userId: string | null,
): Promise<void> => {
  try {
    AppMetrica.setUserProfileID(userId ?? undefined);
    await Promise.all([
      setAnalyticsUserId(getAnalytics(), userId),
      setCrashlyticsUserId(getCrashlytics(), userId ?? ''),
    ]);
  } catch (error) {
    warn('failed to set the analytics user', error);
  }
};

export const logAnalyticsEvent = async <E extends AnalyticsEventName>(
  name: E,
  params: AnalyticsEventParams[E],
): Promise<void> => {
  const eventParams = toEventParams(params);

  try {
    AppMetrica.reportEvent(name, eventParams);
    await logEvent(getAnalytics(), name, eventParams);
  } catch (error) {
    warn(`failed to log "${name}"`, error);
  }
};

// Only the route name is sent — never its params, which can carry ids and personal data.
// It goes to Firebase alone: AppMetrica has no notion of a screen, and a screen_view
// event there would only drown the product events the Tracking Plan asks for.
export const logScreenView = async (screenName: string): Promise<void> => {
  try {
    await logEvent(getAnalytics(), 'screen_view', {
      screen_name: screenName,
      screen_class: screenName,
    });
  } catch (error) {
    warn('failed to log a screen view', error);
  }
};
