import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { act, create } from 'react-test-renderer';

import { useSpecializations } from '../use-specializations';

const mockSpecializationsList = jest.fn();

jest.mock('@/api', () => ({
  appointmentApi: {
    specializationsList: (...args: unknown[]) =>
      mockSpecializationsList(...args),
  },
}));

const names = [
  'Терапевт',
  'Нейрохирург',
  'Физиотерапевт',
  'Врач УЗИ',
  'Выездная служба',
  'Массажист',
  'Стоматолог',
];

const flush = () =>
  new Promise<void>(resolve => {
    setTimeout(resolve, 5);
  });

const render = async (isTelemedicine?: boolean) => {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  let result: ReturnType<typeof useSpecializations> | undefined;
  const Probe = () => {
    result = useSpecializations('branch-1', isTelemedicine);
    return null;
  };
  let renderer: ReturnType<typeof create> | undefined;
  await act(async () => {
    renderer = create(
      <QueryClientProvider client={client}>
        <Probe />
      </QueryClientProvider>,
    );
  });
  // Let the query resolve and the component re-render with its data (react-query
  // notifies on a timer, so poll rather than count ticks).
  for (let i = 0; i < 50 && !result?.specializations.length; i += 1) {
    // eslint-disable-next-line no-await-in-loop
    await act(async () => {
      await flush();
    });
  }
  const snapshot = result!;
  await act(async () => {
    renderer?.unmount();
  });
  client.clear();
  return () => snapshot;
};

describe('useSpecializations', () => {
  beforeEach(() => {
    mockSpecializationsList.mockReset();
    mockSpecializationsList.mockResolvedValue({
      data: {
        specializations: names.map(name => ({ id: name, name })),
      },
    });
  });

  it('in person: asks without the flag and keeps the old client-side exclusions', async () => {
    const get = await render(false);

    expect(mockSpecializationsList).toHaveBeenCalledWith({
      branchId: 'branch-1',
    });
    expect(get().specializations.map(s => s.name)).toEqual([
      'Терапевт',
      'Нейрохирург',
      'Физиотерапевт',
      'Стоматолог',
    ]);
  });

  it('telemedicine: sends isTelemedicine=true and no longer whitelists "Терапевт"', async () => {
    const get = await render(true);

    expect(mockSpecializationsList).toHaveBeenCalledWith({
      branchId: 'branch-1',
      isTelemedicine: true,
    });
    // The backend drops the six categories; the app only keeps its general exclusions.
    expect(get().specializations.map(s => s.name)).toEqual([
      'Терапевт',
      'Нейрохирург',
      'Физиотерапевт',
      'Стоматолог',
    ]);
  });
});
