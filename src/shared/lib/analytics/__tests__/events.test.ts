import { toEventParams } from '../events';

describe('toEventParams', () => {
  it('drops the parameters left unset', () => {
    expect(
      toEventParams({ program_id: undefined, category: 4, files_count: 2 }),
    ).toEqual({ category: 4, files_count: 2 });
  });

  it('keeps falsy values that were actually set', () => {
    expect(
      toEventParams({ is_telemedicine: false, category: 0, branch_id: '' }),
    ).toEqual({ is_telemedicine: false, category: 0, branch_id: '' });
  });
});
