import { DocumentPickerResponse } from '@react-native-documents/picker';

export interface AttachedDocument {
  file: DocumentPickerResponse;
  fileType: string;
}
