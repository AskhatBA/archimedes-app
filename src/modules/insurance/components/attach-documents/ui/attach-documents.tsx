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
import {
  FileIcon,
  UploadFileIcon,
  CloseIcon,
  SuccessCheckIcon,
} from '@/shared/icons';
import { useTranslation } from '@/shared/lib/i18n';
import { useTheme } from '@/shared/theme';

import { documentTypes, getDocumentTypeLabelKey } from '../constants';

interface AttachDocumentsProps {
  files: MediaFile[];
  onRemove: (file: MediaFile) => void;
  documentType: string;
  setDocumentType: (docType: string) => void;
  showError?: boolean;
  requiredDocumentTypes: string[];
  showRequirements?: boolean;
}

export const AttachDocuments: FC<AttachDocumentsProps> = ({
  files,
  onRemove,
  documentType,
  setDocumentType,
  showError,
  requiredDocumentTypes,
  showRequirements,
}) => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const [showDocumentType, setShowDocumentType] = useState(false);
  const { openTypePicker, removeFile } = useMediaPicker();

  const translateDocumentType = (value: string) => {
    const key = getDocumentTypeLabelKey(value);
    return key ? t(key) : value;
  };

  const drawerOptions = documentTypes.map(item => ({
    value: item.value,
    label: t(item.labelKey),
  }));

  const onCloseDrawer = () => {
    setShowDocumentType(false);
  };

  const remove = (file: MediaFile) => {
    Platform.select({
      ios: () =>
        ActionSheetIOS.showActionSheetWithOptions(
          {
            title: t('compensation:request.deleteFileTitle'),
            message: t('compensation:request.deleteFileMessage'),
            options: [t('common:cancel'), t('common:delete')],
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
          t('compensation:request.deleteFileTitle'),
          t('compensation:request.deleteFileMessage'),
          [
            {
              text: t('common:cancel'),
              style: 'cancel',
            },
            {
              text: t('common:delete'),
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
  const hasError = !!showError && missingRequiredTypes.length > 0;

  return (
    <View>
      <Text style={[styles.label, { color: colors.blue['370'] }]}>
        {t('compensation:request.attachDocuments')}
      </Text>
      {(showRequirements || hasError) && (
        <View
          style={[
            styles.requirements,
            {
              backgroundColor: hasError
                ? colors.red['100']
                : colors.blue['100'],
              borderColor: hasError ? colors.error : colors.blue['100'],
            },
          ]}
        >
          <Text
            style={[
              styles.requirementsTitle,
              { color: hasError ? colors.error : colors.blue['400'] },
            ]}
          >
            {hasError
              ? t('compensation:request.missingDocuments')
              : t('compensation:request.requiredDocuments')}
          </Text>
          {requiredDocumentTypes.map(type => {
            const isAttached = attachedTypes.includes(type);

            const markerBorderColor = (() => {
              if (isAttached) return colors.primary;
              if (hasError) return colors.error;
              return colors.blue['200'];
            })();

            const textColor = (() => {
              if (isAttached) return colors.gray['500'];
              if (hasError) return colors.error;
              return colors.blue['400'];
            })();

            return (
              <View key={type} style={styles.requirementItem}>
                <View
                  style={[
                    styles.requirementMarker,
                    {
                      backgroundColor: isAttached
                        ? colors.primary
                        : 'transparent',
                      borderColor: markerBorderColor,
                    },
                  ]}
                >
                  {isAttached && (
                    <SuccessCheckIcon
                      color={colors.white}
                      width={9}
                      height={9}
                    />
                  )}
                </View>
                <Text style={[styles.requirementText, { color: textColor }]}>
                  {translateDocumentType(type)}
                </Text>
              </View>
            );
          })}
        </View>
      )}
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
              <FileIcon color={colors.primary} width={18} height={18} />
              <View>
                <Text
                  numberOfLines={1}
                  style={[
                    styles.attachedFileName,
                    { color: colors.blue['400'] },
                  ]}
                >
                  {translateDocumentType(file.localFileType)}
                </Text>
                <Text
                  numberOfLines={1}
                  style={[
                    styles.attachedFileType,
                    { color: colors.gray['500'] },
                  ]}
                >
                  {file.name}
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
            {t('compensation:request.addFile')}
          </Text>
        </TouchableOpacity>
      </View>
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
        options={drawerOptions}
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
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    gap: 24,
    backgroundColor: '#fff',
  },
  fileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 8,
  },
  attachedFileName: {
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },
  attachedFileType: {
    fontSize: 12,
    fontWeight: '400',
  },
  requirements: {
    marginTop: 8,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
  },
  requirementsTitle: {
    fontSize: 13,
    fontWeight: '600',
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  requirementMarker: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  requirementText: {
    fontSize: 13,
    fontWeight: '400',
    flex: 1,
  },
});
