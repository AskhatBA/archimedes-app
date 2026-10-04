// The analytics SDKs are native: AppMetrica looks its module up as soon as it is imported,
// and Firebase ships untranspiled ESM. Anything that reaches the analytics layer — and the
// navigation container does, for screen views — would otherwise fail to load under Jest.
jest.mock('@appmetrica/react-native-analytics', () => ({
  __esModule: true,
  default: {
    activate: jest.fn(),
    reportEvent: jest.fn(),
    setUserProfileID: jest.fn(),
  },
}));

jest.mock('@microsoft/react-native-clarity', () => ({
  LogLevel: { None: 'None' },
  initialize: jest.fn(),
  pause: jest.fn(() => Promise.resolve(true)),
  resume: jest.fn(() => Promise.resolve(true)),
  setCurrentScreenName: jest.fn(() => Promise.resolve(true)),
}));

jest.mock('@react-native-firebase/app', () => ({
  getApp: jest.fn(),
}));

jest.mock('@react-native-firebase/analytics', () => ({
  getAnalytics: jest.fn(),
  logEvent: jest.fn(() => Promise.resolve()),
  setAnalyticsCollectionEnabled: jest.fn(() => Promise.resolve()),
  setUserId: jest.fn(() => Promise.resolve()),
}));

jest.mock('@react-native-firebase/crashlytics', () => ({
  getCrashlytics: jest.fn(),
  setUserId: jest.fn(() => Promise.resolve()),
}));

jest.mock('@react-native-firebase/perf', () => ({
  initializePerformance: jest.fn(() => Promise.resolve()),
}));

jest.mock('@react-native-firebase/messaging', () => ({
  AuthorizationStatus: { AUTHORIZED: 1, PROVISIONAL: 2 },
  deleteToken: jest.fn(() => Promise.resolve()),
  getMessaging: jest.fn(),
  getToken: jest.fn(() => Promise.resolve('fcm-token')),
  onMessage: jest.fn(() => jest.fn()),
  onTokenRefresh: jest.fn(() => jest.fn()),
  requestPermission: jest.fn(() => Promise.resolve(1)),
}));

// Read by the analytics layer for the app version it reports to AppMetrica.
jest.mock('react-native-device-info', () =>
  // eslint-disable-next-line global-require
  require('react-native-device-info/jest/react-native-device-info-mock'),
);
