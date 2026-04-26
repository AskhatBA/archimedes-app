import { FC } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { BottomDrawer } from '@/shared/components/bottom-drawer';
import { Button } from '@/shared/components/button';
import { UploadFileIcon } from '@/shared/icons';
import { fonts, useTheme } from '@/shared/theme';

interface NewVersionDrawerProps {
  visible: boolean;
  onClose: () => void;
  onUpdate: () => void;
  latestVersion?: string;
}

export const NewVersionDrawer: FC<NewVersionDrawerProps> = ({
  visible,
  onClose,
  onUpdate,
  latestVersion,
}) => {
  const { colors } = useTheme();

  return (
    <BottomDrawer visible={visible} onClose={onClose}>
      <View style={styles.container}>
        <View
          style={[styles.iconOuter, { backgroundColor: colors.blue['100'] }]}
        >
          <View
            style={[styles.iconInner, { backgroundColor: colors.blue['150'] }]}
          >
            <UploadFileIcon width={32} height={32} color={colors.blue['400']} />
          </View>
        </View>

        <Text style={[styles.title, { color: colors.gray['700'] }]}>
          Доступно обновление
        </Text>

        {latestVersion ? (
          <View
            style={[
              styles.versionPill,
              { backgroundColor: colors.blue['100'] },
            ]}
          >
            <Text style={[styles.versionText, { color: colors.blue['400'] }]}>
              Версия {latestVersion}
            </Text>
          </View>
        ) : null}

        <Text style={[styles.description, { color: colors.gray['500'] }]}>
          Установите последнюю версию приложения, чтобы получить новые
          возможности и улучшения.
        </Text>

        <Button onPress={onUpdate} style={styles.primaryButton}>
          Обновить сейчас
        </Button>

        <TouchableOpacity
          onPress={onClose}
          style={styles.laterButton}
          activeOpacity={0.6}
        >
          <Text style={[styles.laterText, { color: colors.gray['500'] }]}>
            Позже
          </Text>
        </TouchableOpacity>
      </View>
    </BottomDrawer>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingBottom: 16,
    paddingTop: 32,
    alignItems: 'center',
  },
  iconOuter: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  iconInner: {
    width: 68,
    height: 68,
    borderRadius: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    fontFamily: fonts.SFPro.Semibold,
    textAlign: 'center',
    marginBottom: 10,
  },
  versionPill: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 100,
    marginBottom: 16,
  },
  versionText: {
    fontSize: 13,
    fontWeight: '600',
    fontFamily: fonts.SFPro.Semibold,
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    fontFamily: fonts.SFPro.Regular,
    textAlign: 'center',
    marginBottom: 28,
    paddingHorizontal: 8,
  },
  primaryButton: {
    width: '100%',
  },
  laterButton: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    marginTop: 8,
  },
  laterText: {
    fontSize: 15,
    fontFamily: fonts.SFPro.Medium,
    fontWeight: '600',
    textAlign: 'center',
  },
});
