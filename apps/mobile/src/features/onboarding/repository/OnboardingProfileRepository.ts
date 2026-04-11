import {
  type LocalOnboardingProfile,
  type NotificationChoice,
  type NotificationPermissionStatus,
  readLocalOnboardingProfile,
  writeLocalOnboardingProfile,
} from '@/db/local-profile-storage';

export type OnboardingProfileRepository = {
  readProfile: () => Promise<LocalOnboardingProfile>;
  saveNotificationDecision: (
    choice: NotificationChoice,
    permissionStatus: NotificationPermissionStatus
  ) => Promise<LocalOnboardingProfile>;
};

export function createOnboardingProfileRepository(): OnboardingProfileRepository {
  return {
    readProfile: readLocalOnboardingProfile,
    async saveNotificationDecision(choice, permissionStatus) {
      const completedAt = new Date().toISOString();
      const profile: LocalOnboardingProfile = {
        notificationChoice: choice,
        notificationPermissionStatus: permissionStatus,
        notificationPromptedAt: completedAt,
        onboardingCompletedAt: completedAt,
      };

      await writeLocalOnboardingProfile(profile);
      return profile;
    },
  };
}
