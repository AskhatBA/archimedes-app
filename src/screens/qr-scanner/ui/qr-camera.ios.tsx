import { FC } from 'react';
import { StyleSheet } from 'react-native';
import {
  Camera,
  isScannedCode,
  useCameraDevice,
  useObjectOutput,
} from 'react-native-vision-camera';

interface Props {
  isActive: boolean;
  onScanned: (value: string) => void;
}

export const QrCamera: FC<Props> = ({ isActive, onScanned }) => {
  const device = useCameraDevice('back');

  const objectOutput = useObjectOutput({
    types: ['qr'],
    onObjectsScanned: objects => {
      const code = objects.find(o => isScannedCode(o) && !!o.value);
      if (code && isScannedCode(code) && code.value) {
        onScanned(code.value);
      }
    },
  });

  if (!device) return null;

  return (
    <Camera
      style={StyleSheet.absoluteFill}
      device={device}
      isActive={isActive}
      outputs={[objectOutput]}
    />
  );
};
