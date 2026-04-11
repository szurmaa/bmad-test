import 'expo-sqlite/localStorage/install';

export type NotificationChoice = 'allow' | 'not-now';
export type NotificationPermissionStatus =
  | 'undetermined'
  | 'granted'
  | 'denied'
  | 'unsupported';

export type LocalOnboardingProfile = {
  notificationChoice: NotificationChoice | null;
  notificationPermissionStatus: NotificationPermissionStatus;
  notificationPromptedAt: string | null;
  onboardingCompletedAt: string | null;
};

const STORAGE_KEY = 'habit-dice.onboarding-profile';

const defaultProfile = (): LocalOnboardingProfile => ({
  notificationChoice: null,
  notificationPermissionStatus: 'undetermined',
  notificationPromptedAt: null,
  onboardingCompletedAt: null,
});

export async function readLocalOnboardingProfile(): Promise<LocalOnboardingProfile> {
  const raw = globalThis.localStorage.getItem(STORAGE_KEY);

  if (!raw) {
    return defaultProfile();
  }

  try {
    const parsed = JSON.parse(raw) as Partial<LocalOnboardingProfile>;
    return {
      notificationChoice: parsed.notificationChoice ?? null,
      notificationPermissionStatus: parsed.notificationPermissionStatus ?? 'undetermined',
      notificationPromptedAt: parsed.notificationPromptedAt ?? null,
      onboardingCompletedAt: parsed.onboardingCompletedAt ?? null,
    };
  } catch {
    return defaultProfile();
  }
}

export async function writeLocalOnboardingProfile(
  profile: LocalOnboardingProfile
): Promise<void> {
  globalThis.localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
}

export async function clearLocalOnboardingProfile(): Promise<void> {
  globalThis.localStorage.removeItem(STORAGE_KEY);
}
