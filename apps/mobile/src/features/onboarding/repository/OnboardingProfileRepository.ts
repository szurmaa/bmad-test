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
      const profile: LocalOnboardingProfile = {
        notificationChoice: choice,
        notificationPermissionStatus: permissionStatus,
        notificationPromptedAt: new Date().toISOString(),
      };

      await writeLocalOnboardingProfile(profile);
      return profile;
    },
  };
}
