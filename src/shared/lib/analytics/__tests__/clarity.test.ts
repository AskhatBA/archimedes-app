/* eslint-disable no-underscore-dangle -- `__DEV__` is React Native's own global. */
import * as Clarity from '@microsoft/react-native-clarity';

import { routes } from '@/shared/navigation/routes';

const globals = global as unknown as { __DEV__: boolean };

const loadRecordScreen = (): typeof import('../clarity').recordScreen => {
  let recordScreen!: typeof import('../clarity').recordScreen;
  // Each test starts from an app that has not shown a recordable screen yet.
  jest.isolateModules(() => {
    // eslint-disable-next-line global-require
    ({ recordScreen } = require('../clarity'));
  });
  return recordScreen;
};

describe('recordScreen', () => {
  const dev = globals.__DEV__;

  beforeEach(() => {
    jest.clearAllMocks();
    globals.__DEV__ = false;
  });

  afterAll(() => {
    globals.__DEV__ = dev;
  });

  it('never starts Clarity on a screen that is not on the list', async () => {
    const recordScreen = loadRecordScreen();

    await recordScreen(routes.SignIn);
    await recordScreen(routes.Home);

    expect(Clarity.initialize).not.toHaveBeenCalled();
  });

  it('starts on the first recordable screen and names it', async () => {
    const recordScreen = loadRecordScreen();

    await recordScreen(routes.SignIn);
    await recordScreen(routes.MedicalNetwork);

    expect(Clarity.initialize).toHaveBeenCalledTimes(1);
    expect(Clarity.setCurrentScreenName).toHaveBeenCalledWith(
      routes.MedicalNetwork,
    );
  });

  it('pauses on a screen off the list and resumes on the next one on it', async () => {
    const recordScreen = loadRecordScreen();

    await recordScreen(routes.MedicalNetwork);
    await recordScreen(routes.Profile);
    expect(Clarity.pause).toHaveBeenCalledTimes(1);

    await recordScreen(routes.PriceList);
    expect(Clarity.resume).toHaveBeenCalledTimes(1);
    expect(Clarity.initialize).toHaveBeenCalledTimes(1);
  });

  it('still pauses when the screens change faster than the native calls return', async () => {
    const recordScreen = loadRecordScreen();

    await recordScreen(routes.MedicalNetwork);
    await recordScreen(routes.Profile);

    // Not awaited one by one: both are in flight at once.
    await Promise.all([
      recordScreen(routes.PriceList),
      recordScreen(routes.MedbotChat),
    ]);

    expect(Clarity.pause).toHaveBeenCalledTimes(2);
  });

  it('records nothing in a debug build', async () => {
    globals.__DEV__ = true;
    const recordScreen = loadRecordScreen();

    await recordScreen(routes.MedicalNetwork);

    expect(Clarity.initialize).not.toHaveBeenCalled();
  });
});
