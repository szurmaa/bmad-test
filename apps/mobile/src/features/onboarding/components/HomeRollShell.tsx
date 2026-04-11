import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { CompletionMoment } from '@/features/daily-roll/components/CompletionMoment';
import { DiceRoll } from '@/features/daily-roll/components/DiceRoll';
import { RerollStateIndicator } from '@/features/daily-roll/components/RerollStateIndicator';
import { TaskRevealCard } from '@/features/daily-roll/components/TaskRevealCard';
import { useDailyRollInit } from '@/hooks/useDailyRollInit';
import { useTheme } from '@/hooks/use-theme';

export function HomeRollShell() {
  const theme = useTheme();
  const {
    completeToday,
    currentRoll,
    daysPlayed,
    error,
    isInitializing,
    isRerolling,
    isRolling,
    rerollCurrentTask,
    rollToday,
  } = useDailyRollInit();
  const [showCompletionMoment, setShowCompletionMoment] = React.useState(false);

  React.useEffect(() => {
    if (!currentRoll?.completed) {
      return;
    }

    setShowCompletionMoment(true);
    const timeout = setTimeout(() => {
      setShowCompletionMoment(false);
    }, 1400);

    return () => {
      clearTimeout(timeout);
    };
  }, [currentRoll?.completed]);

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          <View style={styles.header}>
            <ThemedText type="small" themeColor="textSecondary" style={styles.eyebrow}>
              {daysPlayed} days played
            </ThemedText>
            <ThemedText type="subtitle" style={styles.title}>
              {currentRoll ? 'Today is already ready.' : 'Roll once and get one small thing to do.'}
            </ThemedText>
            <ThemedText type="default" themeColor="textSecondary" style={styles.body}>
              {currentRoll
                ? 'Your task stays here all day, even if you leave and come back later.'
                : 'No setup ceremony. No category picking. Just your daily roll when you are ready.'}
            </ThemedText>
          </View>

          {isInitializing ? (
            <View style={styles.loadingState}>
              <ActivityIndicator color={theme.text} />
              <ThemedText themeColor="textSecondary" type="small">
                Getting today ready...
              </ThemedText>
            </View>
          ) : null}

          {!isInitializing && !currentRoll ? (
            <DiceRoll disabled={isRolling} isRolling={isRolling} onPress={() => void rollToday()} />
          ) : null}

          {currentRoll ? (
            <View style={styles.taskSection}>
              <RerollStateIndicator rerollUsed={currentRoll.rerollUsed} />

              <TaskRevealCard
                category={currentRoll.taskCategory}
                description={currentRoll.taskDescription}
                effort="Quick"
                title={currentRoll.taskTitle}
              />

              <Pressable
                accessibilityRole="button"
                accessibilityLabel={currentRoll.rerollUsed ? 'Reroll used today' : 'Reroll task once today'}
                disabled={currentRoll.rerollUsed || currentRoll.completed || isRerolling}
                onPress={() => void rerollCurrentTask()}
                style={({ pressed }) => [
                  styles.secondaryButton,
                  {
                    backgroundColor: theme.backgroundElement,
                    borderColor: theme.backgroundSelected,
                    opacity: pressed && !currentRoll.rerollUsed && !currentRoll.completed ? 0.92 : 1,
                  },
                ]}
                testID="reroll-button">
                <ThemedText type="default" themeColor={currentRoll.rerollUsed ? 'textSecondary' : 'text'}>
                  {currentRoll.rerollUsed ? 'Reroll used today' : isRerolling ? 'Rerolling...' : 'Reroll (1 left)'}
                </ThemedText>
              </Pressable>

              <Pressable
                accessibilityRole="button"
                accessibilityLabel={currentRoll.completed ? 'Task completed' : 'Mark task complete'}
                disabled={currentRoll.completed}
                onPress={() => void completeToday()}
                style={({ pressed }) => [
                  styles.rollButton,
                  {
                    backgroundColor: currentRoll.completed ? theme.backgroundSelected : theme.text,
                    opacity: pressed && !currentRoll.completed ? 0.92 : 1,
                  },
                ]}
                testID="complete-button">
                <ThemedText type="default" style={styles.rollButtonText}>
                  {currentRoll.completed ? 'Completed today' : 'Mark Complete'}
                </ThemedText>
              </Pressable>
            </View>
          ) : null}

          {error ? (
            <ThemedText style={styles.errorText} themeColor="textSecondary" type="small">
              {error}
            </ThemedText>
          ) : null}
        </View>
        <CompletionMoment visible={showCompletionMoment} />
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
  header: {
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
  loadingState: {
    alignItems: 'center',
    gap: Spacing.two,
    paddingVertical: Spacing.four,
  },
  taskSection: {
    gap: Spacing.three,
  },
  rollButton: {
    minHeight: 56,
    borderRadius: Spacing.three,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.three,
    marginTop: Spacing.one,
  },
  secondaryButton: {
    minHeight: 56,
    borderRadius: Spacing.three,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.three,
  },
  rollButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  errorText: {
    marginTop: Spacing.one,
  },
});