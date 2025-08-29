export type UserGender = 'M' | 'F';

export interface CreateUserPayload {
  lastName: string;
  firstName: string;
  patronymic: string;
  iin: string;
  birthDate: string;
  gender: UserGender;
}
