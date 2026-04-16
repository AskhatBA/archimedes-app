import { FC } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/shared/components/button';
import { SuccessCheckIcon } from '@/shared/icons';
import { useNavigation } from '@/shared/navigation';
import { useTheme } from '@/shared/theme';

export const SubmitRequestSuccess: FC = () => {
  const { colors } = useTheme();
  const { goBack } = useNavigation();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { backgroundColor: colors.backgroundMain }]}>
      <View style={styles.content}>
        <View style={[styles.iconRing, { backgroundColor: colors.blue['100'] }]}>
          <View style={[styles.iconCircle, { backgroundColor: colors.blue['150'] }]}>
            <SuccessCheckIcon width={56} height={56} color={colors.primary} />
          </View>
        </View>

        <Text style={[styles.title, { color: colors.textMain }]}>
          Заявка отправлена
        </Text>
        <Text style={[styles.subtitle, { color: colors.gray['500'] }]}>
          Ваша заявка на возмещение успешно принята. Мы рассмотрим её в ближайшее время.
        </Text>
      </View>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
        <Button style={styles.button} onPress={() => goBack()}>
          Вернуться
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    gap: 20,
  },
  iconRing: {
    width: 148,
    height: 148,
    borderRadius: 74,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  iconCircle: {
    width: 112,
    height: 112,
    borderRadius: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    fontWeight: '400',
    lineHeight: 22,
    textAlign: 'center',
  },
  footer: {
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  button: {
    width: '100%',
  },
});
