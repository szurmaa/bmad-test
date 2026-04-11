import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export function HomeRollShell() {
  const theme = useTheme();

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          <ThemedText type="small" themeColor="textSecondary" style={styles.eyebrow}>
            You are ready for today
          </ThemedText>
          <ThemedText type="subtitle" style={styles.title}>
            Roll once and get one small thing to do.
          </ThemedText>
          <ThemedText type="default" themeColor="textSecondary" style={styles.body}>
            No setup ceremony. No category picking. Just your daily roll when you are ready.
          </ThemedText>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Roll for Today"
            onPress={() => {}}
            testID="roll-button"
            style={({ pressed }) => [
              styles.rollButton,
              {
                backgroundColor: theme.text,
                opacity: pressed ? 0.92 : 1,
              },
            ]}>
            <ThemedText type="default" style={styles.rollButtonText}>
              Roll for Today
            </ThemedText>
          </Pressable>
        </View>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.four,
  },
  content: {
    width: '100%',
    maxWidth: MaxContentWidth,
    gap: Spacing.three,
  },
  eyebrow: {
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  title: {
    maxWidth: 560,
  },
  body: {
    maxWidth: 560,
  },
  rollButton: {
    minHeight: 56,
    borderRadius: Spacing.three,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.three,
    marginTop: Spacing.one,
  },
  rollButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});