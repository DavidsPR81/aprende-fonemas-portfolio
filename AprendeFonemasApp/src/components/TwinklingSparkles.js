import React, { useEffect, useRef } from 'react';
import { StyleSheet, Animated } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { fonts, motionLayout } from '../theme';
import { useReduceMotion } from '../hooks/useReduceMotion';

/** Brillos en cards de nivel. Off si no hay foco o hay reduce motion. */
export default function TwinklingSparkles({ items = [] }) {
  const reduceMotion = useReduceMotion();
  const isFocused = useIsFocused();
  const anims = useRef(items.map(() => new Animated.Value(1))).current;
  const shouldAnimate = !reduceMotion && isFocused && items.length > 0;

  useEffect(() => {
    if (!shouldAnimate) {
      anims.forEach((v) => v.setValue(1));
      return undefined;
    }
    const loops = anims.map((anim, i) => {
      const delay = (i * motionLayout.sparkleTwinkleMs) / Math.max(items.length, 1);
      const half = Math.round(motionLayout.sparkleTwinkleMs / 2);
      anim.setValue(1);
      const loop = Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(anim, {
            toValue: 0,
            duration: half,
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 1,
            duration: half,
            useNativeDriver: true,
          }),
        ])
      );
      loop.start();
      return loop;
    });
    return () => loops.forEach((l) => l.stop());
  }, [items.length, anims, shouldAnimate]);

  return items.map((s, i) => {
    const anim = anims[i];
    const opacity = anim
      ? anim.interpolate({
          inputRange: [0, 1],
          outputRange: [motionLayout.sparkleMinOpacity, motionLayout.sparkleMaxOpacity],
        })
      : 1;
    const scale = anim
      ? anim.interpolate({
          inputRange: [0, 1],
          outputRange: [motionLayout.sparkleScaleMin, motionLayout.sparkleScaleMax],
        })
      : 1;

    return (
      <Animated.Text
        key={i}
        style={[
          styles.sparkle,
          {
            top: s.top,
            left: s.left,
            right: s.right,
            bottom: s.bottom,
            fontSize: s.size,
            color: s.color,
            opacity,
            transform: [{ scale }],
          },
        ]}
      >
        ✦
      </Animated.Text>
    );
  });
}

const styles = StyleSheet.create({
  sparkle: {
    position: 'absolute',
    zIndex: 1,
    fontFamily: fonts.kids,
  },
});
