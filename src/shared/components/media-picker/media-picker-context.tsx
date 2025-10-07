import {
  createContext,
  FC,
  ReactElement,
  ReactNode,
  useContext,
  useMemo,
  useState,
} from 'react';

import { MediaFile } from './types';

interface MediaPickerContextProps {
  isTypePickerOpen: boolean;
  closeTypePicker: () => void;
  openTypePicker: () => void;
  files: MediaFile[];
  changeFiles: (files: MediaFile[]) => void;
  removeFile: (file: MediaFile) => void;
}

const initialValues: MediaPickerContextProps = {
  isTypePickerOpen: false,
  closeTypePicker: () => {},
  openTypePicker: () => {},
  files: [],
  changeFiles: () => {},
  removeFile: () => {},
};

const MediaPickerContext =
  createContext<MediaPickerContextProps>(initialValues);

export const MediaPickerContextProvider: FC<{
  children: ReactNode;
  onChange?: (files: MediaFile[]) => void;
}> = ({ children, onChange }): ReactElement | null => {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [isTypePickerOpen, setIsTypePickerOpen] = useState(false);

  const closeTypePicker = () => {
    setIsTypePickerOpen(false);
  };

  const openTypePicker = () => {
    setIsTypePickerOpen(true);
  };

  const changeFiles = (newFiles: MediaFile[]) => {
    setFiles(prevState => [...prevState, ...newFiles]);
    if (onChange) onChange([...files, ...newFiles]);
    setIsTypePickerOpen(false);
  };

  const removeFile = (file: MediaFile) => {
    setFiles(prevState => prevState.filter(f => f.uri !== file.uri));
    if (onChange) onChange(files.filter(f => f.uri !== file.uri));
  };

  const value = useMemo(
    (): MediaPickerContextProps => ({
      files,
      changeFiles,
      isTypePickerOpen,
      closeTypePicker,
      openTypePicker,
      removeFile,
    }),
    [files, isTypePickerOpen],
  );

  return (
    <MediaPickerContext.Provider value={value}>
      {children}
    </MediaPickerContext.Provider>
  );
};

export const useMediaPicker = (): MediaPickerContextProps => {
  const ctx = useContext(MediaPickerContext);
  if (!ctx)
    throw new Error(
      'Attempt to use MediaPickerContext context outside its scope',
    );
  return ctx;
};
