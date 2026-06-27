import { FC, Suspense } from 'react';
import { StyleSheet } from 'react-native';
import { Camera, CameraType } from 'react-native-camera-kit';

interface Props {
  isActive: boolean;
  onScanned: (value: string) => void;
}

export const QrCamera: FC<Props> = ({ isActive, onScanned }) => (
  <Suspense fallback={null}>
    <Camera
      style={StyleSheet.absoluteFill}
      cameraType={CameraType.Back}
      scanBarcode={isActive}
      showFrame={false}
      onReadCode={e => onScanned(e.nativeEvent.codeStringValue)}
    />
  </Suspense>
);