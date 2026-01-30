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

import { useMediaPicker, MediaFile } from '@/shared/components/media-picker';
import { SelectDrawer } from '@/shared/components/select-field';
import { FileIcon, UploadFileIcon, CloseIcon } from '@/shared/icons';
import { useTheme } from '@/shared/theme';

import { documentTypes } from '../constants';

interface AttachDocumentsProps {
  files: MediaFile[];
  onRemove: (file: MediaFile) => void;
  documentType: string;
  setDocumentType: (docType: string) => void;
  showError?: boolean;
  requiredDocumentTypes: string[];
}

export const AttachDocuments: FC<AttachDocumentsProps> = ({
  files,
  onRemove,
  documentType,
  setDocumentType,
  showError,
  requiredDocumentTypes,
}) => {
  const { colors } = useTheme();
  const [showDocumentType, setShowDocumentType] = useState(false);
  const { openTypePicker, removeFile } = useMediaPicker();

  const onCloseDrawer = () => {
    setShowDocumentType(false);
  };

  const remove = (file: MediaFile) => {
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
              removeFile(file);
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
  };

  const attachedTypes = files.map(file => file.localFileType);
  const missingRequiredTypes = requiredDocumentTypes.filter(
    type => !attachedTypes.includes(type),
  );

  return (
    <View>
      <Text style={[styles.label, { color: colors.blue['370'] }]}>
        Прикрепить документы
      </Text>
      <View style={styles.attachedFiles}>
        {files.map(file => (
          <View
            key={file.name}
            style={[
              styles.attachedFileItem,
              { borderColor: colors.blue['100'] },
            ]}
          >
            <View style={styles.fileInfo}>
              <FileIcon color={colors.primary} width={24} height={24} />
              <View>
                <Text
                  numberOfLines={1}
                  style={[
                    styles.attachedFileName,
                    { color: colors.blue['400'] },
                  ]}
                >
                  {file.name}
                </Text>
                <Text
                  numberOfLines={1}
                  style={[
                    styles.attachedFileType,
                    { color: colors.gray['500'] },
                  ]}
                >
                  {file.localFileType}
                </Text>
              </View>
            </View>
            <TouchableOpacity onPress={() => remove(file)} hitSlop={10}>
              <CloseIcon color={colors.error} width={20} height={20} />
            </TouchableOpacity>
          </View>
        ))}
        <TouchableOpacity
          onPress={() => setShowDocumentType(true)}
          style={[
            styles.uploadButton,
            {
              backgroundColor: colors.blue['100'],
              borderColor: colors.primary,
            },
          ]}
        >
          <UploadFileIcon width={24} height={24} color={colors.primary} />
          <Text style={[styles.uploadButtonText, { color: colors.primary }]}>
            Добавить файл
          </Text>
        </TouchableOpacity>
      </View>
      {showError && missingRequiredTypes.length > 0 && (
        <View style={styles.errorContainer}>
          <Text style={[styles.error, { color: colors.error }]}>
            Необходимо прикрепить следующие документы:
          </Text>
          {missingRequiredTypes.map(type => (
            <Text key={type} style={[styles.error, { color: colors.error }]}>
              • {type}
            </Text>
          ))}
        </View>
      )}
      <SelectDrawer
        isOpen={showDocumentType}
        onChange={selectedDocumentType => {
          onCloseDrawer();
          setDocumentType(selectedDocumentType);
          openTypePicker();
        }}
        selected={documentType}
        setSelected={value => {
          setDocumentType(value);
        }}
        onClose={onCloseDrawer}
        options={documentTypes}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderStyle: 'dashed',
    marginTop: 8,
    gap: 8,
  },
  uploadButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  attachedFiles: {
    flexDirection: 'column',
    marginTop: 8,
    gap: 12,
  },
  attachedFileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    backgroundColor: '#fff',
  },
  fileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 10,
  },
  attachedFileName: {
    fontSize: 14,
    fontWeight: '400',
    flex: 1,
  },
  attachedFileType: {
    fontSize: 12,
    fontWeight: '400',
  },
  error: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 4,
  },
  errorContainer: {
    marginTop: 8,
  },
});
