import { ElectronicReferralServiceStatus } from '@/api';
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

export enum ElectronicReferralStatus {
  NOT_RECEIVED = ElectronicReferralServiceStatus.Value0,
  RECEIVED = ElectronicReferralServiceStatus.Value1,
  DECLINED = ElectronicReferralServiceStatus.Value2,
}
