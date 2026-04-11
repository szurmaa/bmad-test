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

export type ReminderPreference = {
  enabled: boolean;
  hour: number; // 0-23
  minute: number; // 0-59
  reminderType: 'daily' | 'weekly' | 'email_only';
  doNotDisturbStart: string | null; // HH:MM
  doNotDisturbEnd: string | null; // HH:MM
};

export type UserPreferences = {
  appearance: 'system' | 'light' | 'dark';
  aboutLastViewedAt: string | null;
};

const STORAGE_KEY = 'habit-dice.onboarding-profile';
const REMINDER_PREF_KEY = 'habit-dice.reminder-preference';
const USER_PREFERENCES_KEY = 'habit-dice.user-preferences';
const LOCAL_PROFILE_ID_KEY = 'habit-dice.local-profile-id';

const DEFAULT_REMINDER: ReminderPreference = {
  enabled: false,
  hour: 9,
  minute: 0,
  reminderType: 'daily',
  doNotDisturbStart: null,
  doNotDisturbEnd: null,
};

const DEFAULT_USER_PREFERENCES: UserPreferences = {
  appearance: 'system',
  aboutLastViewedAt: null,
};

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

// ---------------------------------------------------------------------------
// Reminder preference helpers
// ---------------------------------------------------------------------------

export async function readReminderPreference(): Promise<ReminderPreference> {
  try {
    const raw = globalThis.localStorage?.getItem(REMINDER_PREF_KEY);
    if (!raw) return { ...DEFAULT_REMINDER };
    const parsed = JSON.parse(raw) as Partial<ReminderPreference>;
    return {
      enabled: parsed.enabled ?? DEFAULT_REMINDER.enabled,
      hour: typeof parsed.hour === 'number' ? parsed.hour : DEFAULT_REMINDER.hour,
      minute: typeof parsed.minute === 'number' ? parsed.minute : DEFAULT_REMINDER.minute,
      reminderType:
        parsed.reminderType === 'daily' || parsed.reminderType === 'weekly' || parsed.reminderType === 'email_only'
          ? parsed.reminderType
          : DEFAULT_REMINDER.reminderType,
      doNotDisturbStart:
        typeof parsed.doNotDisturbStart === 'string' ? parsed.doNotDisturbStart : DEFAULT_REMINDER.doNotDisturbStart,
      doNotDisturbEnd:
        typeof parsed.doNotDisturbEnd === 'string' ? parsed.doNotDisturbEnd : DEFAULT_REMINDER.doNotDisturbEnd,
    };
  } catch {
    return { ...DEFAULT_REMINDER };
  }
}

export async function writeReminderPreference(pref: ReminderPreference): Promise<void> {
  globalThis.localStorage?.setItem(REMINDER_PREF_KEY, JSON.stringify(pref));
}

export async function readUserPreferences(): Promise<UserPreferences> {
  try {
    const raw = globalThis.localStorage?.getItem(USER_PREFERENCES_KEY);
    if (!raw) {
      return { ...DEFAULT_USER_PREFERENCES };
    }

    const parsed = JSON.parse(raw) as Partial<UserPreferences>;
    return {
      appearance:
        parsed.appearance === 'system' || parsed.appearance === 'light' || parsed.appearance === 'dark'
          ? parsed.appearance
          : DEFAULT_USER_PREFERENCES.appearance,
      aboutLastViewedAt:
        typeof parsed.aboutLastViewedAt === 'string' ? parsed.aboutLastViewedAt : DEFAULT_USER_PREFERENCES.aboutLastViewedAt,
    };
  } catch {
    return { ...DEFAULT_USER_PREFERENCES };
  }
}

export async function writeUserPreferences(pref: UserPreferences): Promise<void> {
  globalThis.localStorage?.setItem(USER_PREFERENCES_KEY, JSON.stringify(pref));
}

export async function clearUserPreferences(): Promise<void> {
  globalThis.localStorage?.removeItem(USER_PREFERENCES_KEY);
}

export async function getOrCreateLocalProfileId(): Promise<string> {
  const existing = globalThis.localStorage?.getItem(LOCAL_PROFILE_ID_KEY);
  if (existing) {
    return existing;
  }

  const created =
    typeof globalThis.crypto?.randomUUID === 'function'
      ? globalThis.crypto.randomUUID()
      : `profile_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  globalThis.localStorage?.setItem(LOCAL_PROFILE_ID_KEY, created);
  return created;
}
