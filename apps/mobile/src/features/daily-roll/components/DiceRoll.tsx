import React from 'react';
import { Animated, Easing, Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useReducedMotion } from '@/features/daily-roll/hooks/use-reduced-motion';

type DiceRollProps = {
  disabled?: boolean;
  isRolling?: boolean;
  onPress: () => void;
};

export function DiceRoll({ disabled = false, isRolling = false, onPress }: DiceRollProps) {
  const theme = useTheme();
  const reducedMotion = useReducedMotion();
  const rotation = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (!isRolling) {
      rotation.stopAnimation();
      rotation.setValue(0);
      return;
    }

    if (reducedMotion) {
      rotation.setValue(1);
      return;
    }

    Animated.timing(rotation, {
      toValue: 1,
      duration: 1200,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [isRolling, reducedMotion, rotation]);

  const rotate = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '720deg'],
  });

  return (
    <Pressable
      accessibilityHint="Reveals today's task"
      accessibilityLabel="Roll to get today's task"
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [styles.pressable, pressed && !disabled ? styles.pressed : null]}
      testID="roll-button">
      <Animated.View
        style={[
          styles.dice,
          {
            backgroundColor: theme.backgroundElement,
            borderColor: theme.backgroundSelected,
            transform: [{ rotate }],
          },
        ]}>
        <View style={styles.dotRow}>
          <View style={[styles.dot, { backgroundColor: theme.text }]} />
          <View style={[styles.dot, { backgroundColor: theme.text }]} />
        </View>
        <View style={styles.dotRowCenter}>
          <View style={[styles.dot, styles.dotLarge, { backgroundColor: theme.text }]} />
        </View>
        <View style={styles.dotRow}>
          <View style={[styles.dot, { backgroundColor: theme.text }]} />
          <View style={[styles.dot, { backgroundColor: theme.text }]} />
        </View>
      </Animated.View>
      <ThemedText type="default" style={styles.label}>
        {isRolling ? 'Rolling...' : 'Roll for Today'}
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressable: {
    alignItems: 'center',
    gap: Spacing.three,
  },
  pressed: {
    opacity: 0.9,
  },
  dice: {
    width: 116,
    height: 116,
    borderRadius: 28,
    borderWidth: 1,
    padding: Spacing.three,
    justifyContent: 'space-between',
    shadowColor: '#000000',
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
  dotRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dotRowCenter: {
    alignItems: 'center',
  },
  dot: {
    width: 14,
    height: 14,
    borderRadius: 999,
  },
  dotLarge: {
    width: 18,
    height: 18,
  },
  label: {
    fontWeight: '600',
  },
});

export default DiceRoll;