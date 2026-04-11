import React from 'react';
import { Animated, Easing, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useReducedMotion } from '@/features/daily-roll/hooks/use-reduced-motion';

type CompletionMomentProps = {
  visible: boolean;
};

export function CompletionMoment({ visible }: CompletionMomentProps) {
  const reducedMotion = useReducedMotion();
  const opacity = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (!visible) {
      opacity.setValue(0);
      return;
    }

    if (reducedMotion) {
      opacity.setValue(1);
      return;
    }

    Animated.sequence([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 220,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.delay(900),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 220,
        easing: Easing.in(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start();
  }, [opacity, reducedMotion, visible]);

  if (!visible) {
    return null;
  }

  return (
    <Animated.View pointerEvents="none" style={[styles.overlay, { opacity }]} testID="completion-moment">
      <ThemedView style={styles.card}>
        <ThemedText type="subtitle">Done for today</ThemedText>
        <ThemedText themeColor="textSecondary">Nice work. One small action still counts.</ThemedText>
      </ThemedView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    alignItems: 'center',
    bottom: Spacing.five,
    left: Spacing.three,
    position: 'absolute',
    right: Spacing.three,
  },
  card: {
    alignItems: 'center',
    borderRadius: 24,
    gap: Spacing.two,
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.three,
  },
});

export default CompletionMoment;