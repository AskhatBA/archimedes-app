import { FC, ReactNode } from 'react';

import { MediaPickerContextProvider } from '../media-picker-context';
import { MediaFile } from '../types';

import { MediaPickerContent } from './media-picker-content';

interface MediaPickerProps {
  children?: ReactNode;
  onChange?: (files: MediaFile[]) => void;
}

export const MediaPicker: FC<MediaPickerProps> = ({ children, onChange }) => {
  return (
    <MediaPickerContextProvider onChange={onChange}>
      {children}
      <MediaPickerContent />
    </MediaPickerContextProvider>
  );
};
