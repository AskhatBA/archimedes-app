import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { act, create } from 'react-test-renderer';

import { QrReferralsPatient, useQrAppointments } from '../use-qr-appointments';

const mockAppointmentsList = jest.fn();

jest.mock('@/api', () => ({
  insuranceQrApi: {
    appointmentsList: (...args: unknown[]) => mockAppointmentsList(...args),
  },
}));

const flush = () =>
  new Promise<void>(resolve => {
    setTimeout(resolve, 5);
  });

const render = async (patient?: QrReferralsPatient) => {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  let result: ReturnType<typeof useQrAppointments> | undefined;
  const Probe = () => {
    result = useQrAppointments('clinic-1', patient);
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
  for (let i = 0; i < 50 && !result?.appointments.length; i += 1) {
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

describe('useQrAppointments', () => {
  beforeEach(() => {
    mockAppointmentsList.mockReset();
    mockAppointmentsList.mockResolvedValue({
      data: { data: [{ id: 2115523, name: 'Сидоров Пётр Иванович' }] },
    });
  });

  it('asks for the patient’s own referrals when no relative is picked', async () => {
    const { appointments } = await render({ programId: 'p1' });

    expect(mockAppointmentsList).toHaveBeenCalledWith({
      clinicId: 'clinic-1',
    });
    expect(appointments.map(a => a.id)).toEqual([2115523]);
  });

  it('sends the relative and their programme to read the relative’s referrals', async () => {
    await render({ familyMemberId: 'ben-7', programId: 'p1' });

    expect(mockAppointmentsList).toHaveBeenCalledWith({
      clinicId: 'clinic-1',
      familyMemberId: 'ben-7',
      programId: 'p1',
    });
  });
});
