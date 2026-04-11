import React from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type TaskRevealCardProps = {
  category: string;
  description: string;
  effort: string;
  title: string;
};

const categoryAccent: Record<string, string> = {
  Mind: '#2F6BFF',
  Body: '#D9652B',
  Life: '#228B5A',
  Work: '#8359D4',
};

export function TaskRevealCard({ category, description, effort, title }: TaskRevealCardProps) {
  const theme = useTheme();

  return (
    <ThemedView style={[styles.card, { backgroundColor: theme.backgroundElement }]} testID="task-reveal-card">
      <View style={styles.header}>
        <View style={[styles.badge, { backgroundColor: categoryAccent[category] ?? theme.text }]}>
          <ThemedText type="smallBold" style={styles.badgeText}>
            {category}
          </ThemedText>
        </View>
        <View style={[styles.effortBadge, { borderColor: theme.backgroundSelected }]}>
          <ThemedText type="small" themeColor="textSecondary">
            {effort}
          </ThemedText>
        </View>
      </View>

      <ThemedText accessibilityRole="header" type="subtitle">
        {title}
      </ThemedText>
      <ThemedText themeColor="textSecondary" type="default">
        {description}
      </ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 28,
    gap: Spacing.three,
    padding: Spacing.four,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  badge: {
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  badgeText: {
    color: '#FFFFFF',
  },
  effortBadge: {
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
});

export default TaskRevealCard;