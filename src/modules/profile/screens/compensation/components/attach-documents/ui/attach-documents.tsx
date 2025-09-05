import { pick } from '@react-native-documents/picker';
import { FC } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

import CameraImage from '@/assets/images/camera.svg';
import { useToast } from '@/shared/lib/toast';
import { useTheme } from '@/shared/theme';

export const AttachDocuments: FC = () => {
  const { colors } = useTheme();
  const { showToast } = useToast();

  const pickFile = async () => {
    try {
      const [result] = await pick({
        mode: 'open',
      });
      console.log(result);
    } catch (error) {
      showToast({
        type: 'error',
        message: error,
      });
    }
  };

  return (
    <View>
      <Text style={[styles.label, { color: colors.blue['370'] }]}>
        Прикрепить документы
      </Text>
      <TouchableOpacity
        onPress={pickFile}
        style={[styles.uploadButton, { backgroundColor: colors.blue['100'] }]}
      >
        <CameraImage />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: 16,
    fontWeight: 600,
    marginBottom: 8,
  },
  uploadButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 64,
    height: 59,
    borderRadius: 10,
    marginTop: 8,
  },
});
