import { pick, DocumentPickerResponse } from '@react-native-documents/picker';
import { FC, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';

import { SelectDrawer } from '@/shared/components/select-field';
import { FileIcon, UploadFileIcon } from '@/shared/icons';
import { useToast } from '@/shared/lib/toast';
import { useTheme } from '@/shared/theme';

import { documentTypes } from '../constants';

interface AttachedDocument {
  file: DocumentPickerResponse;
  fileType: string;
}

interface AttachDocumentsProps {
  files: AttachedDocument[];
  onLoadFile: (data: AttachedDocument) => void;
  onRemove: (file: DocumentPickerResponse) => void;
}

export const AttachDocuments: FC<AttachDocumentsProps> = ({
  files,
  onLoadFile,
  onRemove,
}) => {
  const { colors } = useTheme();
  const { showToast } = useToast();
  const [showDocumentType, setShowDocumentType] = useState(false);
  const [loadedFile, setLoadedFile] = useState<DocumentPickerResponse>();
  const [documentType, setDocumentType] = useState('');

  const pickFile = async () => {
    try {
      const [result] = await pick({
        mode: 'open',
      });
      setLoadedFile(result);
      setShowDocumentType(true);
    } catch (error) {
      showToast({
        type: 'error',
        message: error,
      });
    }
  };

  const onCloseDrawer = () => {
    setShowDocumentType(false);
    setLoadedFile(undefined);
  };

  const load = (fileType: string) => {
    if (!loadedFile) return;

    onLoadFile({ file: loadedFile, fileType });
    setShowDocumentType(false);
  };

  return (
    <View>
      <Text style={[styles.label, { color: colors.blue['370'] }]}>
        Прикрепить документы
      </Text>
      <View style={styles.attachedFiles}>
        {files.map(({ file }) => (
          <TouchableOpacity
            key={file.name}
            style={[
              styles.uploadButton,
              styles.attachedFileBox,
              { borderColor: colors.primary },
            ]}
            onLongPress={() => {
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
              );
            }}
          >
            <FileIcon width={24} height={24} />
            <Text numberOfLines={1} style={styles.attachedFileName}>
              {file.name}
            </Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity
          onPress={() => setShowDocumentType(true)}
          style={[styles.uploadButton, { backgroundColor: colors.blue['100'] }]}
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
        onChange={load}
        buttonText="Выбрать"
        selected={documentType}
        setSelected={value => {
          pickFile();
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
    borderWidth: 1,
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
