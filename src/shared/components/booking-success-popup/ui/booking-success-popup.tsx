import { FC, useEffect, useRef } from 'react';
import {
  Animated,
  Modal,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import UserIcon from '@/assets/icons/user-outlined.svg';
import { SCREEN_HEIGHT } from '@/shared/constants';
import { useTheme } from '@/shared/theme';

interface BookingSuccessPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BookingSuccessPopup: FC<BookingSuccessPopupProps> = ({
  isOpen,
  onClose,
}) => {
  const sheetHeight = SCREEN_HEIGHT * 0.7;
  const translateY = useRef(new Animated.Value(sheetHeight - 20)).current;
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();

  const openSheet = () => {
    Animated.timing(translateY, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const closeSheet = () => {
    Animated.timing(translateY, {
      toValue: sheetHeight,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      onClose?.();
    });
  };

  useEffect(() => {
    if (isOpen) {
      openSheet();
    } else {
      closeSheet();
    }
  }, [isOpen]);

  return (
    <Modal
      visible={isOpen}
      animationType="fade"
      transparent
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={styles.backdrop}>
        <Animated.View
          style={[
            styles.sheet,
            {
              transform: [{ translateY }],
              paddingBottom: insets.bottom + 16,
            },
          ]}
        >
          <View style={{ marginHorizontal: 32 }}>
            <View style={styles.card}>
              <View
                style={[styles.avatar, { backgroundColor: colors.blue['100'] }]}
              >
                <UserIcon color={colors.primary} />
              </View>
              <Text style={styles.title}>
                Запись на прием к{' '}
                <Text style={styles.bold}>Тастанбекова Л.</Text>
              </Text>

              <Text style={styles.subtitle}>
                Успешная запись{'\n'}на 17 июня в 2025
              </Text>
            </View>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: colors.white }]}
              onPress={onClose}
            >
              <Text style={[styles.buttonText, { color: colors.primary }]}>
                Отлично!
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  sheet: {},
  handle: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 30,
    height: 30,
    borderRadius: 8,
    alignSelf: 'flex-end',
    marginBottom: 10,
    marginTop: 10,
  },
  card: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 16,
    alignItems: 'center',
    padding: 24,
  },
  title: {
    fontSize: 22,
    textAlign: 'center',
    marginTop: 12,
    marginBottom: 8,
    color: '#333',
  },
  bold: {
    fontWeight: '600',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
    marginTop: 8,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    borderRadius: 50,
    marginTop: 18,
  },
  buttonText: {
    fontWeight: '600',
    fontSize: 16,
  },
  avatar: {
    width: 86,
    height: 86,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 86,
  },
});
