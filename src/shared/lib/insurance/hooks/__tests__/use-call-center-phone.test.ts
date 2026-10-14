import { useCallCenterPhone } from '../use-call-center-phone';

let mockPrograms: {
  programs: unknown[];
  loadedPrograms: boolean;
  isNotAuthorized: boolean;
};

jest.mock('@/shared/constants', () =>
  jest.requireActual('@/shared/constants/support'),
);

jest.mock('../use-programs', () => ({
  usePrograms: () => mockPrograms,
}));

describe('useCallCenterPhone', () => {
  it('gives the no-programme line when the insurer returned none', () => {
    mockPrograms = {
      programs: [],
      loadedPrograms: true,
      isNotAuthorized: false,
    };
    expect(useCallCenterPhone()).toBe('9040');
  });

  it('gives the no-programme line when the insurer does not know the patient', () => {
    mockPrograms = {
      programs: [],
      loadedPrograms: false,
      isNotAuthorized: true,
    };
    expect(useCallCenterPhone()).toBe('9040');
  });

  it('gives the regular line to a patient with a programme', () => {
    mockPrograms = {
      programs: [{ id: '1', status: 'EXPIRED' }],
      loadedPrograms: true,
      isNotAuthorized: false,
    };
    expect(useCallCenterPhone()).toBe('2828');
  });

  it('gives the regular line while the list is loading or failed', () => {
    mockPrograms = {
      programs: [],
      loadedPrograms: false,
      isNotAuthorized: false,
    };
    expect(useCallCenterPhone()).toBe('2828');
  });
});
