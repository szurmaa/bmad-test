import React from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type RerollStateIndicatorProps = {
  rerollUsed: boolean;
};

export function RerollStateIndicator({ rerollUsed }: RerollStateIndicatorProps) {
  const theme = useTheme();

  return (
    <ThemedView
      accessibilityLabel={rerollUsed ? 'Reroll used today. Ready again tomorrow.' : 'Reroll available. One left today.'}
      style={[styles.container, { backgroundColor: theme.backgroundElement, borderColor: theme.backgroundSelected }]}
      testID="reroll-state-indicator">
      <View style={[styles.dot, { backgroundColor: rerollUsed ? theme.textSecondary : theme.text }]} />
      <View style={styles.copyBlock}>
        <ThemedText type="smallBold">
          {rerollUsed ? 'Reroll used today' : 'Reroll available'}
        </ThemedText>
        <ThemedText themeColor="textSecondary" type="small">
          {rerollUsed ? 'Ready again tomorrow.' : 'You can swap this task once today.'}
        </ThemedText>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    borderRadius: 20,
    borderWidth: 1,
    flexDirection: 'row',
    gap: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingVertical: 12,
  },
  copyBlock: {
    flex: 1,
    gap: 2,
  },
  dot: {
    borderRadius: 999,
    height: 10,
    width: 10,
  },
});

export default RerollStateIndicator;