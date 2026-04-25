import { FC } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { BottomDrawer } from '@/shared/components/bottom-drawer';
import { Button } from '@/shared/components/button';
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
        <Text style={[styles.title, { color: colors.gray['700'] }]}>
          Доступно обновление
        </Text>
        {latestVersion ? (
          <Text style={[styles.version, { color: colors.gray['500'] }]}>
            Версия {latestVersion}
          </Text>
        ) : null}
        <Text style={[styles.description, { color: colors.gray['600'] }]}>
          Установите последнюю версию приложения, чтобы получить новые
          возможности и улучшения.
        </Text>
        <Button onPress={onUpdate}>Обновить</Button>
        <Button variant="secondary" onPress={onClose} style={styles.later}>
          Позже
        </Button>
      </View>
    </BottomDrawer>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingBottom: 16,
    paddingTop: 48,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    fontFamily: fonts.SFPro.Semibold,
    marginBottom: 4,
  },
  version: {
    fontSize: 14,
    fontFamily: fonts.SFPro.Regular,
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    lineHeight: 22,
    fontFamily: fonts.SFPro.Regular,
    marginBottom: 20,
  },
  later: {
    marginTop: 12,
  },
});
