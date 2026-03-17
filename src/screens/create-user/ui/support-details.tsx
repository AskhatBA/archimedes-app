import { FC } from 'react';
import {
  View,
  Image,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from 'react-native';

import { CALL_CENTER_PHONE } from '@/shared/constants';
import { PhoneIcon } from '@/shared/icons';
import { useTheme } from '@/shared/theme';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const image = require('@/assets/images/support.png');

export const SupportDetails: FC = () => {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <Image source={image} style={{ width: 279, height: 334 }} />
      <Text style={[styles.informationText, { color: colors.gray['500'] }]}>
        Извините, данные пациента не найдены. Пожалуйста, обратитесь в службу
        поддержки.
      </Text>
      <Text
        style={[
          styles.informationText,
          { color: colors.gray['500'], marginTop: 16 },
        ]}
      >
        Служба поддержки работает круглосуточно.
      </Text>
      <TouchableOpacity
        onPress={() => Linking.openURL(`tel:${CALL_CENTER_PHONE}`)}
        style={styles.phoneContainer}
      >
        <PhoneIcon width={20} height={20} color={colors.primary} />
        <Text
          style={[
            styles.informationText,
            styles.phoneLink,
            { color: colors.primary },
          ]}
        >
          {CALL_CENTER_PHONE}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  informationText: {
    fontSize: 16,
    fontWeight: 500,
    textAlign: 'center',
  },
  phoneContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 16,
  },
  phoneLink: {
    fontSize: 24,
    fontWeight: 700,
  },
});
