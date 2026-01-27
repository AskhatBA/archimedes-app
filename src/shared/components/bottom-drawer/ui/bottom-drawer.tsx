import { FC, useRef, useEffect, ReactNode } from 'react';
import {
  Animated,
  StyleSheet,
  View,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { SCREEN_HEIGHT } from '@/shared/constants';
import { CloseIcon } from '@/shared/icons';
import { useTheme } from '@/shared/theme';

interface BottomDrawerProps {
  visible: boolean;
  onClose: () => void;
  children: ReactNode;
  backdropPressEnabled?: boolean;
}

export const BottomDrawer: FC<BottomDrawerProps> = ({
  visible,
  onClose,
  children,
  backdropPressEnabled = true,
}) => {
  const { colors } = useTheme();
  const sheetHeight = SCREEN_HEIGHT * 0.8;
  const translateY = useRef(new Animated.Value(sheetHeight)).current;
  const insets = useSafeAreaInsets();

  const openSheet = () => {
    Animated.timing(translateY, {
      toValue: 0,
      duration: 250,
      useNativeDriver: true,
    }).start();
  };

  const closeSheet = () => {
    Animated.timing(translateY, {
      toValue: sheetHeight,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      onClose?.();
    });
  };

  useEffect(() => {
    if (visible) {
      openSheet();
    } else {
      closeSheet();
    }
  }, [visible]);

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <TouchableWithoutFeedback
        disabled={!backdropPressEnabled}
        onPress={closeSheet}
      >
        <View style={styles.backdrop}>
          <Animated.View
            style={[
              styles.sheet,
              {
                transform: [{ translateY }],
                paddingBottom: insets.bottom + 16,
                maxHeight: sheetHeight,
              },
            ]}
          >
            <TouchableWithoutFeedback onPress={e => e.stopPropagation()}>
              <View>
                <TouchableOpacity
                  onPress={closeSheet}
                  style={[
                    styles.handle,
                    { backgroundColor: colors.gray['200'] },
                  ]}
                >
                  <CloseIcon
                    width={22}
                    height={22}
                    color={colors.gray['600']}
                  />
                </TouchableOpacity>
                {children}
              </View>
            </TouchableWithoutFeedback>
          </Animated.View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  handle: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 30,
    height: 30,
    borderRadius: 8,
    alignSelf: 'flex-end',
    marginBottom: 10,
    marginTop: 10,
    marginRight: 8,
  },
});
