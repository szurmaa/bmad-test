import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { LocalOnboardingProfile } from '@/db/local-profile-storage';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import {
  createNotificationPermissionService,
  type NotificationPermissionService,
} from '@/features/notifications/services/NotificationPermissionService';
import { NotificationPermissionGate } from '@/features/onboarding/components/NotificationPermissionGate';
import { HomeRollShell } from '@/features/onboarding/components/HomeRollShell';
import {
  createOnboardingProfileRepository,
  type OnboardingProfileRepository,
} from '@/features/onboarding/repository/OnboardingProfileRepository';

type OnboardingFlowGateProps = {
  profileRepository?: OnboardingProfileRepository;
  permissionService?: NotificationPermissionService;
  profileLoadTimeoutMs?: number;
};

const PROFILE_LOAD_TIMEOUT_MS = 4000;

const emptyProfile: LocalOnboardingProfile = {
  notificationChoice: null,
  notificationPermissionStatus: 'undetermined',
  notificationPromptedAt: null,
  onboardingCompletedAt: null,
};

export function OnboardingFlowGate({
  profileRepository = createOnboardingProfileRepository(),
  permissionService = createNotificationPermissionService(),
  profileLoadTimeoutMs = PROFILE_LOAD_TIMEOUT_MS,
}: OnboardingFlowGateProps) {
  const theme = useTheme();
  const [isLoading, setIsLoading] = React.useState(true);
  const [profile, setProfile] = React.useState<LocalOnboardingProfile>(emptyProfile);

  React.useEffect(() => {
    let isMounted = true;

    async function loadProfile() {
      let timeoutId: ReturnType<typeof setTimeout> | null = null;
      try {
        const timeoutFallback = new Promise<LocalOnboardingProfile>((resolve) => {
          timeoutId = setTimeout(() => {
            resolve(emptyProfile);
          }, profileLoadTimeoutMs);
        });

        const nextProfile = await Promise.race([profileRepository.readProfile(), timeoutFallback]);

        if (isMounted) {
          setProfile(nextProfile);
        }
      } catch {
        if (isMounted) {
          setProfile(emptyProfile);
        }
      } finally {
        if (timeoutId) {
          clearTimeout(timeoutId);
        }

        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadProfile();

    return () => {
      isMounted = false;
    };
  }, [profileLoadTimeoutMs, profileRepository]);

  if (isLoading) {
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

  if (profile.onboardingCompletedAt) {
    return <HomeRollShell />;
  }

  return (
    <NotificationPermissionGate
      profileRepository={profileRepository}
      permissionService={permissionService}
      profileLoadTimeoutMs={profileLoadTimeoutMs}
      onComplete={(nextProfile) => {
        setProfile(nextProfile);
      }}
    />
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
  loadingState: {
    alignItems: 'center',
    gap: Spacing.two,
  },
});