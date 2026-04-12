import React from 'react';
import { Pressable, SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { clearAllLocalStorage, clearSpecificStorage, logStorageState } from '@/db/clear-storage';

export default function DevDebugScreen() {
  const theme = useTheme();
  const [lastAction, setLastAction] = React.useState<string>('');

  const handleClearAll = async () => {
    await clearAllLocalStorage();
    setLastAction('Cleared all storage');
  };

  const handleClearOnboarding = async () => {
    await clearSpecificStorage('habit-dice.onboarding-profile');
    setLastAction('Cleared onboarding profile');
  };

  const handleClearPreferences = async () => {
    await clearSpecificStorage('habit-dice.user-preferences');
    setLastAction('Cleared user preferences');
  };

  const handleLogStorage = () => {
    logStorageState();
    setLastAction('Logged storage state to console');
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            <View style={styles.header}>
              <ThemedText type="subtitle">Dev Debug Tools</ThemedText>
              <ThemedText type="small" themeColor="textSecondary">
                Local Storage & Testing Utilities
              </ThemedText>
            </View>

            <View style={styles.section}>
              <ThemedText type="default" style={styles.sectionLabel}>
                Storage Actions
              </ThemedText>

              <DebugButton
                label="Clear All Storage"
                description="Reset all app state and data"
                onPress={handleClearAll}
                theme={theme}
              />

              <DebugButton
                label="Clear Onboarding Profile"
                description="Reset to first-run state"
                onPress={handleClearOnboarding}
                theme={theme}
              />

              <DebugButton
                label="Clear User Preferences"
                description="Reset appearance & settings"
                onPress={handleClearPreferences}
                theme={theme}
              />

              <DebugButton
                label="Log Storage State"
                description="View current data (see console)"
                onPress={handleLogStorage}
                theme={theme}
              />
            </View>

            {lastAction ? (
              <View style={styles.status}>
                <ThemedText type="small" style={styles.statusText}>
                  ✓ {lastAction}
                </ThemedText>
              </View>
            ) : null}

            <View style={styles.info}>
              <ThemedText type="small" themeColor="textSecondary" style={styles.infoText}>
                Use this screen to reset local storage between test builds. Helpful for testing
                different user flows (onboarding, permissions, etc).
              </ThemedText>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

function DebugButton({
  label,
  description,
  onPress,
  theme,
}: {
  label: string;
  description: string;
  onPress: () => void;
  theme: any;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        {
          borderColor: theme.text,
          backgroundColor: theme.background,
          opacity: pressed ? 0.92 : 1,
        },
      ]}>
      <ThemedText type="default" style={styles.buttonLabel}>
        {label}
      </ThemedText>
      <ThemedText type="small" themeColor="textSecondary" style={styles.buttonDescription}>
        {description}
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scroll: {
    paddingVertical: Spacing.four,
  },
  content: {
    paddingHorizontal: Spacing.three,
    gap: Spacing.four,
  },
  header: {
    gap: Spacing.one,
  },
  section: {
    gap: Spacing.two,
  },
  sectionLabel: {
    fontWeight: '600',
    marginBottom: Spacing.one,
  },
  button: {
    borderWidth: 1,
    borderRadius: Spacing.three,
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.three,
    gap: Spacing.one,
    marginBottom: Spacing.two,
  },
  buttonLabel: {
    fontWeight: '600',
  },
  buttonDescription: {
    lineHeight: 20,
  },
  status: {
    backgroundColor: '#E8F5E9',
    borderRadius: Spacing.two,
    padding: Spacing.three,
  },
  statusText: {
    color: '#2E7D32',
    fontWeight: '500',
  },
  info: {
    backgroundColor: '#F5F5F5',
    borderRadius: Spacing.two,
    padding: Spacing.three,
  },
  infoText: {
    lineHeight: 20,
  },
});
