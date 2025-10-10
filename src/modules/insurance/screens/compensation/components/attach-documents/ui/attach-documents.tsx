import { DocumentPickerResponse } from '@react-native-documents/picker';
import { FC, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
  ActionSheetIOS,
} from 'react-native';

import {
  MediaPicker,
  useMediaPicker,
  MediaFile,
} from '@/shared/components/media-picker';
import { SelectDrawer } from '@/shared/components/select-field';
import { FileIcon, UploadFileIcon } from '@/shared/icons';
import { useTheme } from '@/shared/theme';

import { documentTypes } from '../constants';

interface AttachDocumentsProps {
  files: MediaFile[];
  onRemove: (file: MediaFile) => void;
}

export const AttachDocuments: FC<AttachDocumentsProps> = ({
  files,
  onRemove,
}) => {
  const { colors } = useTheme();
  const [showDocumentType, setShowDocumentType] = useState(false);
  const [documentType, setDocumentType] = useState('');
  const { openTypePicker } = useMediaPicker();

  const onCloseDrawer = () => {
    setShowDocumentType(false);
  };

  return (
    <>
      <View>
        <Text style={[styles.label, { color: colors.blue['370'] }]}>
          Прикрепить документы
        </Text>
        <View style={styles.attachedFiles}>
          {files.map(file => (
            <TouchableOpacity
              key={file.name}
              style={[
                styles.uploadButton,
                styles.attachedFileBox,
                { borderColor: colors.primary },
              ]}
              onLongPress={() => {
                Platform.select({
                  ios: () =>
                    ActionSheetIOS.showActionSheetWithOptions(
                      {
                        title: 'Удаление файла',
                        message: 'Вы действительно хотите удалить этот файл?',
                        options: ['Отмена', 'Удалить'],
                        cancelButtonIndex: 0,
                        destructiveButtonIndex: 1,
                      },
                      buttonIndex => {
                        if (buttonIndex === 1) {
                          onRemove(file);
                        }
                      },
                    ),
                  android: () =>
                    Alert.alert(
                      'Удаление файла',
                      'Вы действительно хотите удалить этот файл?',
                      [
                        {
                          text: 'Отмена',
                          style: 'cancel',
                        },
                        {
                          text: 'Удалить',
                          onPress: () => onRemove(file),
                          style: 'destructive',
                        },
                      ],
                    ),
                })();
              }}
            >
              <FileIcon color={colors.blue['400']} width={24} height={24} />
              <Text numberOfLines={1} style={styles.attachedFileName}>
                {file.name}
              </Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            onPress={() => setShowDocumentType(true)}
            style={[
              styles.uploadButton,
              { backgroundColor: colors.blue['100'] },
            ]}
          >
            <UploadFileIcon width={36} height={36} color={colors.primary} />
          </TouchableOpacity>
        </View>
        {files.length === 0 && (
          <Text style={[styles.error, { color: colors.error }]}>
            Обязательное поле
          </Text>
        )}
        <SelectDrawer
          isOpen={showDocumentType}
          onChange={selectedDocumentType => {
            onCloseDrawer();
            setDocumentType(selectedDocumentType);
            openTypePicker();
          }}
          buttonText="Выбрать"
          selected={documentType}
          setSelected={value => {
            setDocumentType(value);
          }}
          onClose={onCloseDrawer}
          options={documentTypes}
        />
      </View>
      <MediaPicker />
    </>
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
  },
  attachedFiles: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 8,
  },
  attachedFileBox: {
    borderWidth: 2,
    gap: 4,
  },
  attachedFileName: {
    fontSize: 10,
  },
  error: {
    fontSize: 12,
    fontWeight: 500,
    marginTop: 8,
  },
});
