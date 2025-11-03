import React, { FC, useEffect, useMemo, useRef } from 'react';
import { Animated, StyleProp, StyleSheet, ViewStyle } from 'react-native';

import { useTheme } from '@/shared/theme';

export type SkeletonElementProps = {
  width?: number | string;
  height?: number | string;
  borderRadius?: number;
  style?: StyleProp<ViewStyle>;
  animated?: boolean;
  duration?: number;
};

export const SkeletonElement: FC<SkeletonElementProps> = ({
  width = '100%',
  height = 16,
  borderRadius = 8,
  style,
  animated = true,
  duration = 1200,
}) => {
  const { colors } = useTheme();
  const opacity = useRef(new Animated.Value(0.6)).current;

  const backgroundColor = useMemo(() => {
    return (colors.gray && colors.gray['250']) || '#E6E8EB';
  }, [colors]);

  useEffect(() => {
    if (!animated) return;

    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: duration / 2,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.6,
          duration: duration / 2,
          useNativeDriver: true,
        }),
      ]),
    );

    animation.start();

    // eslint-disable-next-line consistent-return
    return () => {
      animation.stop();
    };
  }, [animated, duration, opacity]);

  return (
    <Animated.View
      accessible={false}
      style={[
        styles.base,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        { width, height, borderRadius, backgroundColor, opacity },
        style,
      ]}
    />
  );
};

const styles = StyleSheet.create({
  base: {
    overflow: 'hidden',
  },
});

export default SkeletonElement;
