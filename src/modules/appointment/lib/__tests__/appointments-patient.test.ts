import { appointmentsPatientQuery } from '../appointments-patient';

describe('appointmentsPatientQuery', () => {
  it('asks for the owner own appointments when no relative is picked', () => {
    expect(appointmentsPatientQuery()).toBeUndefined();
    expect(appointmentsPatientQuery({})).toBeUndefined();
    // A programme on its own only vouches for a relative, it names nobody.
    expect(appointmentsPatientQuery({ programId: 'gold' })).toBeUndefined();
  });

  it('sends the relative together with the programme that vouches for them', () => {
    expect(
      appointmentsPatientQuery({ programId: 'gold', familyMemberId: 'son' }),
    ).toEqual({ familyMemberId: 'son', programId: 'gold' });
  });
});
