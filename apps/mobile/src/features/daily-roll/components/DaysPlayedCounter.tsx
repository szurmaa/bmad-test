import React from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useReducedMotion } from '@/features/daily-roll/hooks/use-reduced-motion';
import { useTheme } from '@/hooks/use-theme';

type DaysPlayedCounterProps = {
  count: number;
};

export function DaysPlayedCounter({ count }: DaysPlayedCounterProps) {
  const theme = useTheme();
  const reducedMotion = useReducedMotion();
  const scale = React.useRef(new Animated.Value(1)).current;
  const previousCount = React.useRef(count);

  React.useEffect(() => {
    if (reducedMotion || count <= previousCount.current) {
      previousCount.current = count;
      return;
    }

    Animated.sequence([
      Animated.timing(scale, {
        toValue: 1.05,
        duration: 120,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 1,
        duration: 160,
        easing: Easing.inOut(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start();

    previousCount.current = count;
  }, [count, reducedMotion, scale]);

  return (
    <ThemedView
      accessibilityLabel={`${count} days played`}
      style={[styles.card, { backgroundColor: theme.backgroundElement }]}
      testID="days-played-counter">
      <Animated.View style={{ transform: [{ scale }] }}>
        <ThemedText style={styles.count} type="title">
          {count}
        </ThemedText>
      </Animated.View>
      <View style={styles.copyBlock}>
        <ThemedText type="smallBold">days played</ThemedText>
        <ThemedText themeColor="textSecondary" type="small">
          {count === 0 ? 'Your first roll starts the count.' : `You've shown up ${count} time${count === 1 ? '' : 's'}.`}
        </ThemedText>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    borderRadius: 28,
    flexDirection: 'row',
    gap: Spacing.three,
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.three,
  },
  count: {
    fontSize: 40,
    lineHeight: 44,
  },
  copyBlock: {
    flex: 1,
    gap: 2,
  },
});

export default DaysPlayedCounter;