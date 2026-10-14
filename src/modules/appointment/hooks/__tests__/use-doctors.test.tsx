import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { act, create } from 'react-test-renderer';

import { AppointmentsPatient } from '../../types';
import { useDoctors } from '../use-doctors';

const mockDoctorsList = jest.fn();

jest.mock('@/api', () => ({
  appointmentApi: {
    doctorsList: (...args: unknown[]) => mockDoctorsList(...args),
  },
}));

const flush = () =>
  new Promise<void>(resolve => {
    setTimeout(resolve, 5);
  });

const render = async (patient?: AppointmentsPatient) => {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  let result: ReturnType<typeof useDoctors> | undefined;
  const Probe = () => {
    result = useDoctors('branch-1', 'spec-1', patient);
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
  for (let i = 0; i < 50 && !result?.doctors.length; i += 1) {
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
  return snapshot;
};

describe('useDoctors', () => {
  beforeEach(() => {
    mockDoctorsList.mockReset();
    mockDoctorsList.mockResolvedValue({
      data: { doctors: [{ id: 'd1', name: 'Педиатр', isPediatric: true }] },
    });
  });

  it('asks for the patient’s own list when no relative is picked', async () => {
    const { doctors } = await render({ programId: 'p1' });

    expect(mockDoctorsList).toHaveBeenCalledWith({
      branchId: 'branch-1',
      specializationId: 'spec-1',
    });
    expect(doctors.map(d => d.id)).toEqual(['d1']);
  });

  it('sends the relative and their programme, so the backend filters by their age', async () => {
    await render({ familyMemberId: 'ben-7', programId: 'p1' });

    expect(mockDoctorsList).toHaveBeenCalledWith({
      branchId: 'branch-1',
      specializationId: 'spec-1',
      familyMemberId: 'ben-7',
      programId: 'p1',
    });
  });
});
