import { useEffect, useRef, FC } from 'react';
import {
  Animated,
  Dimensions,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { colors, fonts } from '@/shared/theme';

type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
  visible: boolean;
  message?: string;
  type?: ToastType;
  duration?: number;
  onHide: () => void;
}

const TYPE_STYLES: Record<
  ToastType,
  { accent: string; iconColor: string; symbol: string }
> = {
  success: {
    accent: '#3DDC97',
    iconColor: '#0B1F1A',
    symbol: '✓',
  },
  error: {
    accent: '#FF6B6B',
    iconColor: '#1F0B0B',
    symbol: '!',
  },
  info: {
    accent: '#4DA3FF',
    iconColor: '#0B1622',
    symbol: 'i',
  },
};

export const Toast: FC<ToastProps> = ({
  visible,
  message,
  type = 'info',
  duration = 3000,
  onHide,
}) => {
  const translateY = useRef(new Animated.Value(-120)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(translateY, {
          toValue: 60,
          useNativeDriver: true,
          friction: 9,
          tension: 70,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 220,
          useNativeDriver: true,
        }),
      ]).start();

      timeoutRef.current = setTimeout(() => {
        Animated.parallel([
          Animated.timing(translateY, {
            toValue: -120,
            duration: 250,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }),
        ]).start(() => onHide());
      }, duration);
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [visible]);

  if (!visible) return null;

  const { accent, iconColor, symbol } = TYPE_STYLES[type];

  return (
    <Animated.View
      style={[styles.container, { transform: [{ translateY }], opacity }]}
      pointerEvents="none"
    >
      <View style={styles.toast}>
        <View style={[styles.accent, { backgroundColor: accent }]} />
        <View style={[styles.iconWrap, { backgroundColor: accent }]}>
          <Text style={[styles.icon, { color: iconColor }]}>{symbol}</Text>
        </View>
        <Text style={styles.text} numberOfLines={3}>
          {message}
        </Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 16,
    right: 16,
    width: Dimensions.get('window').width - 32,
    alignItems: 'center',
    zIndex: 9999,
  },
  toast: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1B2433',
    paddingVertical: 14,
    paddingRight: 18,
    paddingLeft: 18,
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    ...Platform.select({
      ios: {
        shadowColor: '#0B1F33',
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.28,
        shadowRadius: 24,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  accent: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
  },
  iconWrap: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  icon: {
    fontFamily: fonts.SFPro.Bold,
    fontSize: 15,
    lineHeight: 17,
  },
  text: {
    flex: 1,
    color: colors.white,
    fontFamily: fonts.SFPro.Medium,
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: 0.1,
  },
});
