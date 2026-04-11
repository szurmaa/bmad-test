import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

const MOOD_OPTIONS: { value: number; emoji: string; label: string }[] = [
  { value: 1, emoji: '😔', label: 'Low' },
  { value: 2, emoji: '😕', label: 'Meh' },
  { value: 3, emoji: '😐', label: 'Okay' },
  { value: 4, emoji: '🙂', label: 'Good' },
  { value: 5, emoji: '😊', label: 'Great' },
];

type MoodPromptProps = {
  onSubmit: (value: number) => void;
  onSkip: () => void;
  isSubmitting?: boolean;
};

export function MoodPrompt({ onSubmit, onSkip, isSubmitting = false }: MoodPromptProps) {
  const theme = useTheme();

  return (
    <ThemedView
      accessibilityLabel="How are you feeling?"
      style={[styles.container, { backgroundColor: theme.backgroundElement }]}
      testID="mood-prompt">
      <ThemedText type="smallBold" style={styles.heading}>
        How are you feeling?
      </ThemedText>

      <View style={styles.scaleRow} accessibilityRole="radiogroup" accessibilityLabel="Mood scale from 1 to 5">
        {MOOD_OPTIONS.map((option) => (
          <Pressable
            key={option.value}
            accessibilityRole="radio"
            accessibilityLabel={`${option.label}, mood ${option.value} of 5`}
            disabled={isSubmitting}
            onPress={() => onSubmit(option.value)}
            style={({ pressed }) => [
              styles.moodButton,
              {
                backgroundColor: pressed ? theme.backgroundSelected : 'transparent',
              },
            ]}
            testID={`mood-option-${option.value}`}>
            <ThemedText style={styles.emoji}>{option.emoji}</ThemedText>
            <ThemedText themeColor="textSecondary" type="small">
              {option.label}
            </ThemedText>
          </Pressable>
        ))}
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Skip mood check for today"
        disabled={isSubmitting}
        onPress={onSkip}
        style={({ pressed }) => [
          styles.skipButton,
          {
            backgroundColor: pressed ? theme.backgroundSelected : 'transparent',
            borderColor: theme.backgroundSelected,
          },
        ]}
        testID="mood-skip-button">
        <ThemedText themeColor="textSecondary" type="small">
          Skip for today
        </ThemedText>
      </Pressable>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    gap: Spacing.three,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.three,
  },
  heading: {
    textAlign: 'center',
  },
  scaleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.one,
  },
  moodButton: {
    alignItems: 'center',
    borderRadius: 12,
    flex: 1,
    gap: Spacing.one,
    paddingVertical: Spacing.two,
  },
  emoji: {
    fontSize: 28,
    lineHeight: 34,
  },
  skipButton: {
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    paddingVertical: Spacing.two,
  },
});

export default MoodPrompt;
