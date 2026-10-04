import * as Clarity from '@microsoft/react-native-clarity';

import { CLARITY_PROJECT_ID } from '@/shared/config';
// Straight from the file, not the navigation barrel: the navigation container imports
// this layer, and the barrel would close the loop.
import { routes } from '@/shared/navigation/routes';

/**
 * The only screens Clarity may record. They show catalogue data — clinics, prices,
 * programmes for sale, news, the insurer's contacts — and nothing about the patient.
 *
 * Everything else is left out on purpose, the home screen included (it greets the patient
 * by name and shows their balance and programmes): sign-in and registration take the phone
 * and IIN, and the rest is appointments, referrals, documents, payments, the medbot chat
 * and compensation requests. A screen added later is not recorded until someone puts it
 * here, after checking with masking on in the dashboard that nothing personal shows.
 */
const RECORDED_SCREENS: ReadonlySet<string> = new Set([
  routes.MedicalNetwork,
  routes.PriceList,
  routes.PaidPrograms,
  routes.Checkups,
  routes.NewsDetails,
  routes.ProgramSupport,
]);

let initialized = false;
let recording = false;
let pending: Promise<void> = Promise.resolve();

const applyScreen = async (screenName: string): Promise<void> => {
  if (!RECORDED_SCREENS.has(screenName)) {
    if (recording) {
      recording = false;
      await Clarity.pause();
    }
    return;
  }

  if (!initialized) {
    initialized = true;
    Clarity.initialize(CLARITY_PROJECT_ID, { logLevel: Clarity.LogLevel.None });
  } else if (!recording) {
    await Clarity.resume();
  }

  recording = true;
  await Clarity.setCurrentScreenName(screenName);
};

/**
 * Called on every screen change. Clarity is only initialised on the first recordable
 * screen, so nothing before it — sign-in above all — is ever captured, and from then on
 * it is paused whenever the screen is not on the list.
 *
 * Calls run one after another: a quick hop from a recorded screen to one that is not must
 * not see the stale "not recording yet" state and skip the pause.
 */
export const recordScreen = (screenName: string): Promise<void> => {
  // A debug build is a developer's, so it stays out of the recordings.
  if (__DEV__) return Promise.resolve();

  pending = pending.catch(() => undefined).then(() => applyScreen(screenName));
  return pending;
};
