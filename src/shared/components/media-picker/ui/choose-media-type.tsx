import {
  pick,
  types as RNDocumentsTypes,
} from '@react-native-documents/picker';
import { FC } from 'react';
import { StyleSheet, View, TouchableOpacity, Image } from 'react-native';
import {
  launchCamera,
  launchImageLibrary,
  ImagePickerResponse,
} from 'react-native-image-picker';

import { BottomDrawer } from '@/shared/components/bottom-drawer';

import { useMediaPicker } from '../media-picker-context';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const cameraImage = require('@/assets/images/camera-ios.png');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const fileImage = require('@/assets/images/files-ios.png');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const galleryImage = require('@/assets/images/photos-ios.png');

export const ChooseMediaType: FC = () => {
  const { isTypePickerOpen, closeTypePicker, changeFiles } = useMediaPicker();

  const pickFile = async () => {
    try {
      const result = await pick({
        type: [RNDocumentsTypes.allFiles],
        mode: 'import',
      });

      if (!result?.length) return;

      const [file] = result;
      changeFiles([
        {
          name: file.name,
          size: file.size,
          type: file.type,
          uri: file.uri,
        },
      ]);
    } catch (error) {
      console.log('Document picker error: ', error);
    }
  };

  const putPhotoToFiles = (photoResponse?: ImagePickerResponse) => {
    if (!photoResponse?.assets.length) return;

    changeFiles(
      photoResponse.assets.map(file => ({
        uri: file.uri,
        type: file.type,
        size: file.fileSize,
        name: file.fileName,
      })),
    );
  };

  const pickPhotoFromGallery = async () => {
    const result = await launchImageLibrary({ mediaType: 'photo' });
    putPhotoToFiles(result);
  };

  return (
    <BottomDrawer visible={isTypePickerOpen} onClose={closeTypePicker}>
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.mediaTypeItem}
          onPress={() =>
            launchCamera(
              { cameraType: 'back', mediaType: 'photo' },
              photoResponse => {
                putPhotoToFiles(photoResponse);
              },
            )
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
