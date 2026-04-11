import React from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Constants from 'expo-constants';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { exportUserDataToJsonFile, requestAccountDeletion } from '@/features/settings/DataPrivacyService';
import { useUserPreferences } from '@/hooks/useUserPreferences';
import { ReminderSettingsCard } from '@/features/notifications/components/ReminderSettingsCard';
import { useTheme } from '@/hooks/use-theme';

export default function SettingsScreen() {
  const theme = useTheme();
  const { appearance, setAppearance, isLoading } = useUserPreferences();
  const [isExporting, setIsExporting] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [statusMessage, setStatusMessage] = React.useState<string | null>(null);

  const appVersion = Constants.expoConfig?.version ?? 'unknown';

  const handleExport = async () => {
    setIsExporting(true);
    setStatusMessage(null);
    try {
      const result = await exportUserDataToJsonFile();
      setStatusMessage(`Data export generated: ${result.fileName}`);
    } catch {
      setStatusMessage('Unable to export data right now. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    setStatusMessage(null);
    try {
      await requestAccountDeletion();
      setStatusMessage('Account deletion requested. Local data has been removed.');
    } catch {
      setStatusMessage('Unable to request account deletion right now.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            <View style={styles.header}>
              <ThemedText type="subtitle">Settings</ThemedText>
            </View>

            <View style={styles.section}>
              <ThemedText themeColor="textSecondary" type="small" style={styles.sectionLabel}>
                NOTIFICATIONS
              </ThemedText>
              <ReminderSettingsCard />
            </View>

            <View style={styles.section}>
              <ThemedText themeColor="textSecondary" type="small" style={styles.sectionLabel}>
                APPEARANCE
              </ThemedText>
              <ThemedView style={[styles.card, { backgroundColor: theme.backgroundElement }]}>
                {isLoading ? (
                  <ActivityIndicator color={theme.text} />
                ) : (
                  <View style={styles.inlineButtons}>
                    {(['system', 'light', 'dark'] as const).map((value) => {
                      const selected = appearance === value;
                      return (
                        <Pressable
                          key={value}
                          accessibilityRole="button"
                          accessibilityLabel={`Set appearance ${value}`}
                          onPress={() => {
                            void setAppearance(value);
                          }}
                          style={({ pressed }) => [
                            styles.preferenceButton,
                            {
                              backgroundColor: selected ? theme.text : theme.background,
                              borderColor: theme.backgroundSelected,
                              opacity: pressed ? 0.9 : 1,
                            },
                          ]}
                          testID={`appearance-${value}`}>
                          <ThemedText type="small" style={selected ? styles.selectedText : undefined}>
                            {value[0].toUpperCase() + value.slice(1)}
                          </ThemedText>
                        </Pressable>
                      );
                    })}
                  </View>
                )}
              </ThemedView>
            </View>

            <View style={styles.section}>
              <ThemedText themeColor="textSecondary" type="small" style={styles.sectionLabel}>
                DATA & PRIVACY
              </ThemedText>
              <ThemedView style={[styles.card, { backgroundColor: theme.backgroundElement }]}> 
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Export data as JSON"
                  disabled={isExporting}
                  onPress={() => {
                    void handleExport();
                  }}
                  style={({ pressed }) => [
                    styles.actionButton,
                    {
                      backgroundColor: theme.background,
                      borderColor: theme.backgroundSelected,
                      opacity: pressed ? 0.9 : 1,
                    },
                  ]}
                  testID="export-data-button">
                  <ThemedText type="small">{isExporting ? 'Exporting…' : 'Export Data'}</ThemedText>
                </Pressable>

                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Delete account and local data"
                  disabled={isDeleting}
                  onPress={() => {
                    void handleDelete();
                  }}
                  style={({ pressed }) => [
                    styles.actionButton,
                    {
                      backgroundColor: '#FEE2E2',
                      borderColor: '#FCA5A5',
                      opacity: pressed ? 0.9 : 1,
                    },
                  ]}
                  testID="delete-account-button">
                  <ThemedText type="small">{isDeleting ? 'Deleting…' : 'Delete Account'}</ThemedText>
                </Pressable>

                {statusMessage ? (
                  <ThemedText type="small" themeColor="textSecondary" testID="privacy-status-message">
                    {statusMessage}
                  </ThemedText>
                ) : null}
              </ThemedView>
            </View>

            <View style={styles.section}>
              <ThemedText themeColor="textSecondary" type="small" style={styles.sectionLabel}>
                ABOUT
              </ThemedText>
              <ThemedView style={[styles.card, { backgroundColor: theme.backgroundElement }]}> 
                <ThemedText type="small">Habit Dice v{appVersion}</ThemedText>
              </ThemedView>
            </View>
          </View>
        </ScrollView>
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
    alignItems: 'center',
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.four,
    width: '100%',
    maxWidth: MaxContentWidth,
  },
  content: {
    gap: Spacing.four,
  },
  header: {
    gap: Spacing.one,
  },
  section: {
    gap: Spacing.two,
  },
  card: {
    borderRadius: Spacing.three,
    padding: Spacing.three,
    gap: Spacing.two,
  },
  inlineButtons: {
    flexDirection: 'row',
    gap: Spacing.one,
  },
  preferenceButton: {
    minHeight: 36,
    borderRadius: Spacing.two,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.two,
  },
  selectedText: {
    color: '#FFFFFF',
  },
  actionButton: {
    minHeight: 44,
    borderRadius: Spacing.two,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.two,
  },
  sectionLabel: {
    textTransform: 'uppercase',
    letterSpacing: 1,
    paddingHorizontal: Spacing.one,
  },
});
