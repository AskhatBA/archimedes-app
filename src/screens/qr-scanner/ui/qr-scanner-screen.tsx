import { FC, useCallback, useEffect, useRef, useState } from 'react';
import {
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Camera,
  isScannedCode,
  useCameraDevice,
  useCameraPermission,
  useObjectOutput,
} from 'react-native-vision-camera';

import { usePageHeader } from '@/shared/hooks';
import { CloseIcon, QrCodeIcon } from '@/shared/icons';
import { useTranslation } from '@/shared/lib/i18n';
import { routes, useNavigation } from '@/shared/navigation';
import { colors, fonts } from '@/shared/theme';

export const QrScannerScreen: FC = () => {
  const { t } = useTranslation();
  const { goBack, navigate } = useNavigation();
  const insets = useSafeAreaInsets();

  usePageHeader({ title: t('qrScanner:title') });

  const { hasPermission, requestPermission } = useCameraPermission();
  const device = useCameraDevice('back');

  const [scanError, setScanError] = useState(false);
  const isLocked = useRef(false);

  useEffect(() => {
    if (!hasPermission) {
      requestPermission();
    }
  }, [hasPermission, requestPermission]);

  const handleScanned = useCallback(
    (value: string) => {
      if (isLocked.current) return;
      isLocked.current = true;

      try {
        const parsed = JSON.parse(value) as unknown;
        const obj =
          parsed !== null && typeof parsed === 'object'
            ? (parsed as Record<string, unknown>)
            : null;

        const clinicId =
          obj && typeof obj.clinicId === 'string' ? obj.clinicId : null;
        const clinicName =
          obj && typeof obj.clinicName === 'string' ? obj.clinicName : '';

        if (clinicId) {
          navigate(routes.QrReferrals, { clinicId, clinicName });
          isLocked.current = false;
        } else {
          setScanError(true);
        }
      } catch {
        setScanError(true);
      }
    },
    [navigate],
  );

  const objectOutput = useObjectOutput({
    types: ['qr'],
    onObjectsScanned: objects => {
      const scannedCode = objects.find(
        object => isScannedCode(object) && !!object.value,
      );
      if (scannedCode && isScannedCode(scannedCode) && scannedCode.value) {
        handleScanned(scannedCode.value);
      }
    },
  });

  const handleRescan = () => {
    setScanError(false);
    isLocked.current = false;
  };

  const handleOpenSettings = () => {
    Linking.openSettings().catch(() => {});
  };

  if (!hasPermission) {
    return (
      <View style={styles.fallback}>
        <QrCodeIcon width={56} height={56} color={colors.blue['400']} />
        <Text style={styles.fallbackTitle}>
          {t('qrScanner:permissionTitle')}
        </Text>
        <Text style={styles.fallbackMessage}>
          {t('qrScanner:permissionMessage')}
        </Text>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={async () => {
            const granted = await requestPermission();
            if (!granted) handleOpenSettings();
          }}
        >
          <Text style={styles.primaryButtonText}>
            {t('qrScanner:grantPermission')}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!device) {
    return (
      <View style={styles.fallback}>
        <Text style={styles.fallbackTitle}>{t('qrScanner:noCamera')}</Text>
      </View>
    );
  }

  return (
    <View style={styles.wrapper}>
      <Camera
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={!scanError}
        outputs={[objectOutput]}
      />

      <View style={styles.overlay} pointerEvents="box-none">
        <View style={styles.dimRow} />
        <View style={styles.middleRow}>
          <View style={styles.dimSide} />
          <View style={styles.scanFrame}>
            <View style={[styles.corner, styles.cornerTopLeft]} />
            <View style={[styles.corner, styles.cornerTopRight]} />
            <View style={[styles.corner, styles.cornerBottomLeft]} />
            <View style={[styles.corner, styles.cornerBottomRight]} />
          </View>
          <View style={styles.dimSide} />
        </View>
        <View style={styles.dimRow}>
          <Text style={styles.instruction}>{t('qrScanner:instruction')}</Text>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.closeButton, { top: insets.top + 12 }]}
        onPress={goBack}
        hitSlop={12}
      >
        <CloseIcon width={20} height={20} color={colors.white} />
      </TouchableOpacity>

      {scanError && (
        <View style={[styles.resultCard, { bottom: insets.bottom + 24 }]}>
          <Text style={styles.resultTitle}>{t('qrScanner:invalidQr')}</Text>
          <Text style={styles.resultMessage}>
            {t('qrScanner:invalidQrMessage')}
          </Text>
          <TouchableOpacity
            style={styles.rescanButton}
            onPress={handleRescan}
            activeOpacity={0.85}
          >
            <Text style={styles.rescanButtonText}>{t('qrScanner:rescan')}</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: colors.gray['700'],
  },
  fallback: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    gap: 16,
    backgroundColor: colors.backgroundMain,
  },
  fallbackTitle: {
    fontSize: 18,
    fontFamily: fonts.SFPro.Bold,
    fontWeight: '700',
    color: colors.blue['500'],
    textAlign: 'center',
  },
  fallbackMessage: {
    fontSize: 14,
    color: colors.gray['500'],
    fontFamily: fonts.SFPro.Regular,
    textAlign: 'center',
  },
  primaryButton: {
    marginTop: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: colors.blue['400'],
  },
  primaryButtonText: {
    color: colors.white,
    fontSize: 15,
    fontFamily: fonts.SFPro.Semibold,
    fontWeight: '600',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  dimRow: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  middleRow: {
    flexDirection: 'row',
    height: 260,
  },
  dimSide: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  scanFrame: {
    width: 260,
    height: 260,
  },
  corner: {
    position: 'absolute',
    width: 28,
    height: 28,
    borderColor: colors.white,
  },
  cornerTopLeft: {
    top: 0,
    left: 0,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderTopLeftRadius: 6,
  },
  cornerTopRight: {
    top: 0,
    right: 0,
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderTopRightRadius: 6,
  },
  cornerBottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
    borderBottomLeftRadius: 6,
  },
  cornerBottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderBottomRightRadius: 6,
  },
  instruction: {
    color: colors.white,
    fontSize: 15,
    fontFamily: fonts.SFPro.Medium,
    fontWeight: '500',
    textAlign: 'center',
  },
  closeButton: {
    position: 'absolute',
    right: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  resultCard: {
    position: 'absolute',
    left: 16,
    right: 16,
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    gap: 8,
  },
  resultTitle: {
    fontSize: 16,
    fontFamily: fonts.SFPro.Bold,
    fontWeight: '700',
    color: colors.red['500'],
  },
  resultMessage: {
    fontSize: 14,
    color: colors.gray['600'],
    fontFamily: fonts.SFPro.Regular,
  },
  rescanButton: {
    marginTop: 8,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: colors.blue['400'],
    alignItems: 'center',
  },
  rescanButtonText: {
    color: colors.white,
    fontSize: 15,
    fontFamily: fonts.SFPro.Semibold,
    fontWeight: '600',
  },
});
