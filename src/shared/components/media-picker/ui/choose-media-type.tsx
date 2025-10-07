import { pick } from '@react-native-documents/picker';
import { FC } from 'react';
import { StyleSheet, View, TouchableOpacity, Image } from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

import { BottomDrawer } from '@/shared/components/bottom-drawer';
import { useToast } from '@/shared/lib/toast';

import { useMediaPicker } from '../media-picker-context';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const cameraImage = require('@/assets/images/camera-ios.png');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const fileImage = require('@/assets/images/files-ios.png');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const galleryImage = require('@/assets/images/photos-ios.png');

export const ChooseMediaType: FC = () => {
  const { isTypePickerOpen, closeTypePicker, changeFiles } = useMediaPicker();
  const { showToast } = useToast();

  const pickFile = async () => {
    try {
      const [result] = await pick({
        mode: 'import',
      });

      if (!result) return;

      changeFiles([
        {
          name: result.name,
          size: result.size,
          type: result.type,
          uri: result.uri,
        },
      ]);
    } catch (error) {
      showToast({
        type: 'error',
        message: error,
      });
    }
  };

  const pickPhotoFromGallery = async () => {
    const result = await launchImageLibrary({ mediaType: 'photo' });

    if (!result?.assets.length) return;

    changeFiles(
      result.assets.map(file => ({
        uri: file.uri,
        type: file.type,
        size: file.fileSize,
        name: file.fileName,
      })),
    );
  };

  return (
    <BottomDrawer visible={isTypePickerOpen} onClose={closeTypePicker}>
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.mediaTypeItem}
          onPress={() =>
            launchCamera({ cameraType: 'back', mediaType: 'photo' })
          }
        >
          <Image source={cameraImage} style={styles.mediaTypeItemImage} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.mediaTypeItem}
          onPress={() => pickFile()}
        >
          <Image source={fileImage} style={styles.mediaTypeItemImage} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.mediaTypeItem}
          onPress={pickPhotoFromGallery}
        >
          <Image source={galleryImage} style={styles.mediaTypeItemImage} />
        </TouchableOpacity>
      </View>
    </BottomDrawer>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 32,
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  mediaTypeItem: {},
  mediaTypeItemImage: { width: 55, height: 55 },
});
