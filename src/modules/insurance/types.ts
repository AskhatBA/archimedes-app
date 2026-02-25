import { MediaFile } from '@/shared/components/media-picker';

export interface CompensationRequestFormValues {
  date: string;
  amount: number;
  files: MediaFile[];
  programId: string;
  personId: string;
  category: number;
}

export enum CompensationCategoryEnum {
  OutpatientCare = 0,
  Dentistry = 4,
  Medications = 5,
  InpatientTreatment = 2,
}
