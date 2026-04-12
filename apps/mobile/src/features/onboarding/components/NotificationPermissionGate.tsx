import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type {
  LocalOnboardingProfile,
  NotificationChoice,
  NotificationPermissionStatus,
} from '@/db/local-profile-storage';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors, MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import {
  createNotificationPermissionService,
  type NotificationPermissionService,
} from '@/features/notifications/services/NotificationPermissionService';
import {
  createOnboardingProfileRepository,
  type OnboardingProfileRepository,
} from '@/features/onboarding/repository/OnboardingProfileRepository';

type NotificationPermissionGateProps = {
  profileRepository?: OnboardingProfileRepository;
  permissionService?: NotificationPermissionService;
  onComplete?: (profile: LocalOnboardingProfile) => void;
};

function statusCopy(status: NotificationPermissionStatus): string {
  switch (status) {
    case 'granted':
      return 'Reminders are allowed. You can change that later.';
    case 'denied':
      return 'Reminders stay off for now. You are still in.';
    case 'unsupported':
      return 'This device does not support the permission prompt here, so we kept going.';
    default:
      return 'You can decide about reminders later without losing your place.';
  }
}

function choiceLabel(choice: NotificationChoice | null): string {
  if (choice === 'allow') {
    return 'Allow reminders';
  }

  if (choice === 'not-now') {
    return 'Not now';
  }

  return 'No choice saved yet';
}

function ButtonCard({
  label,
  caption,
  onPress,
  testID,
  style,
}: {
  label: string;
  caption: string;
  onPress: () => void;
  testID: string;
  style?: StyleProp<ViewStyle>;
}) {
  const theme = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      testID={testID}
      style={({ pressed }) => [
        styles.actionButton,
        {
          borderColor: theme.text,
          backgroundColor: theme.background,
          opacity: pressed ? 0.92 : 1,
        },
        style,
      ]}>
      <ThemedText type="default" style={styles.actionLabel}>
        {label}
      </ThemedText>
      <ThemedText type="small" themeColor="textSecondary" style={styles.actionCaption}>
        {caption}
      </ThemedText>
    </Pressable>
  );
}

export function NotificationPermissionGate({
  profileRepository = createOnboardingProfileRepository(),
  permissionService = createNotificationPermissionService(),
  onComplete,
}: NotificationPermissionGateProps) {
  const theme = useTheme();
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [profile, setProfile] = React.useState<LocalOnboardingProfile | null>(null);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  React.useEffect(() => {
    let isMounted = true;

    async function loadProfile() {
      try {
        const nextProfile = await profileRepository.readProfile();
        if (isMounted) {
          setProfile(nextProfile);
        }
      } catch {
        if (isMounted) {
          setErrorMessage('We could not read your reminder preference yet.');
          setProfile({
            notificationChoice: null,
            notificationPermissionStatus: 'undetermined',
            notificationPromptedAt: null,
            onboardingCompletedAt: null,
          });
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadProfile();

    return () => {
      isMounted = false;
    };
  }, [profileRepository]);

  const saveChoice = React.useCallback(
    async (choice: NotificationChoice) => {
      setIsSubmitting(true);
      setErrorMessage(null);

      try {
        let permissionStatus: NotificationPermissionStatus = 'undetermined';

        try {
          permissionStatus =
            choice === 'allow'
              ? await permissionService.requestPermission()
              : await permissionService.getCurrentStatus();
        } catch {
          // Keep onboarding non-blocking if platform permission APIs fail.
          permissionStatus = 'undetermined';
        }

        const nextProfile = await profileRepository.saveNotificationDecision(choice, permissionStatus);
        setProfile(nextProfile);
        onComplete?.(nextProfile);
      } catch {
        // Keep onboarding non-blocking even if local persistence fails.
        const fallbackProfile: LocalOnboardingProfile = {
          notificationChoice: choice,
          notificationPermissionStatus: profile?.notificationPermissionStatus ?? 'undetermined',
          notificationPromptedAt: profile?.notificationPromptedAt ?? new Date().toISOString(),
          onboardingCompletedAt: new Date().toISOString(),
        };
        setProfile((currentProfile) => ({
          ...fallbackProfile,
          notificationPermissionStatus:
            currentProfile?.notificationPermissionStatus ?? fallbackProfile.notificationPermissionStatus,
        }));
        onComplete?.(fallbackProfile);
        setErrorMessage('We could not save that choice. We still moved you forward.');
      } finally {
        setIsSubmitting(false);
      }
    },
    [onComplete, permissionService, profileRepository]
  );

  if (isLoading || !profile) {
    return (
      <ThemedView style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.loadingState}>
            <ActivityIndicator color={theme.text} />
            <ThemedText type="small" themeColor="textSecondary">
              Loading your first step...
            </ThemedText>
          </View>
        </SafeAreaView>
      </ThemedView>
    );
  }

  const hasCompletedChoice = profile.notificationChoice !== null;

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.cardColumn}>
          {!hasCompletedChoice ? (
            <ThemedView type="backgroundElement" style={styles.promptCard} testID="notification-step">
              <ThemedText type="small" themeColor="textSecondary" style={styles.eyebrow}>
                A gentle choice
              </ThemedText>
              <ThemedText type="subtitle" style={styles.title}>
                Want a quiet reminder when your dice are ready?
              </ThemedText>
              <ThemedText type="default" themeColor="textSecondary" style={styles.body}>
                You can allow reminders now or skip them. Either way, you keep moving.
              </ThemedText>

              <ThemedView type="background" style={styles.previewBox}>
                <ThemedText type="small" themeColor="textSecondary">
                  Preview
                </ThemedText>
                <ThemedText type="default" style={styles.previewTitle}>
                  Your dice are ready 🎲
                </ThemedText>
                <ThemedText type="small" themeColor="textSecondary">
                  Calm copy only. No streak pressure.
                </ThemedText>
              </ThemedView>

              <View style={styles.actionsRow}>
                <ButtonCard
                  label="Allow reminders"
                  caption="Ask the device for permission and keep going."
                  onPress={() => {
                    void saveChoice('allow');
                  }}
                  testID="allow-button"
                  style={styles.flexButton}
                />
                <ButtonCard
                  label="Not now"
                  caption="Skip reminders for now and keep going."
                  onPress={() => {
                    void saveChoice('not-now');
                  }}
                  testID="not-now-button"
                  style={styles.flexButton}
                />
              </View>

              {isSubmitting ? (
                <View style={styles.inlineStatus}>
                  <ActivityIndicator color={theme.text} />
                  <ThemedText type="small" themeColor="textSecondary">
                    Saving your choice...
                  </ThemedText>
                </View>
              ) : null}

              {errorMessage ? (
                <ThemedText type="small" themeColor="error">
                  {errorMessage}
                </ThemedText>
              ) : null}
            </ThemedView>
          ) : (
            <ThemedView type="backgroundElement" style={styles.promptCard} testID="app-entry-card">
              <ThemedText type="small" themeColor="textSecondary" style={styles.eyebrow}>
                You are in
              </ThemedText>
              <ThemedText type="subtitle" style={styles.title}>
                Your reminder choice is saved.
              </ThemedText>
              <ThemedText type="default" themeColor="textSecondary" style={styles.body}>
                {statusCopy(profile.notificationPermissionStatus)}
              </ThemedText>

              <ThemedView type="background" style={styles.summaryBox}>
                <ThemedText type="small" themeColor="textSecondary">
                  Saved choice
                </ThemedText>
                <ThemedText type="default">{choiceLabel(profile.notificationChoice)}</ThemedText>
                <ThemedText type="small" themeColor="textSecondary">
                  Story 1.3 will complete the broader onboarding journey from here.
                </ThemedText>
              </ThemedView>
            </ThemedView>
          )}
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
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.four,
  },
  cardColumn: {
    width: '100%',
    maxWidth: MaxContentWidth,
  },
  promptCard: {
    borderRadius: Spacing.four,
    padding: Spacing.four,
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
  previewBox: {
    borderRadius: Spacing.three,
    padding: Spacing.three,
    gap: Spacing.one,
  },
  previewTitle: {
    fontSize: 20,
    lineHeight: 28,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: Spacing.two,
    flexWrap: 'wrap',
  },
  flexButton: {
    flexGrow: 1,
    flexBasis: 260,
  },
  actionButton: {
    borderWidth: 1,
    borderRadius: Spacing.three,
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.three,
    minHeight: 88,
    justifyContent: 'space-between',
  },
  actionLabel: {
    fontWeight: '600',
  },
  actionCaption: {
    lineHeight: 20,
  },
  inlineStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  summaryBox: {
    borderRadius: Spacing.three,
    padding: Spacing.three,
    gap: Spacing.one,
  },
  loadingState: {
    alignItems: 'center',
    gap: Spacing.two,
  },
});
