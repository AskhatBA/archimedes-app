import { useEffect, useRef, FC } from 'react';
import { Animated, StyleSheet, Text, View, Dimensions } from 'react-native';

interface ToastProps {
  visible: boolean;
  message?: string;
  type?: 'success' | 'error' | 'info';
  duration?: number;
  onHide: () => void;
}

export const Toast: FC<ToastProps> = ({
  visible,
  message,
  type = 'info',
  duration = 3000,
  onHide,
}) => {
  const translateY = useRef(new Animated.Value(-100)).current;
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (visible) {
      Animated.timing(translateY, {
        toValue: 50,
        duration: 200,
        useNativeDriver: true,
      }).start();

      timeoutRef.current = setTimeout(() => {
        Animated.timing(translateY, {
          toValue: -100,
          duration: 200,
          useNativeDriver: true,
        }).start(() => onHide());
      }, duration);
    }

    return () => clearTimeout(timeoutRef.current);
  }, [visible]);

  if (!visible) return null;

  const backgroundColor = {
    success: '#58D4A0',
    error: '#F44336',
    info: '#2196F3',
  }[type];

  return (
    <Animated.View style={[styles.container, { transform: [{ translateY }] }]}>
      <View style={[styles.toast, { backgroundColor }]}>
        <Text style={styles.text}>{message}</Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    width: Dimensions.get('window').width,
    alignItems: 'center',
    zIndex: 9999,
  },
  toast: {
    marginTop: 20,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 24,
    minWidth: '90%',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  text: {
    color: '#ffffff',
    fontSize: 16,
    textAlign: 'center',
  },
});
