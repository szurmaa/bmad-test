import * as FileSystem from 'expo-file-system';

import {
  clearLocalOnboardingProfile,
  clearUserPreferences,
  getOrCreateLocalProfileId,
  readLocalOnboardingProfile,
  readReminderPreference,
  readUserPreferences,
  writeReminderPreference,
} from '@/db/local-profile-storage';
import { getDatabase, queueForSync } from '@/db/schema';

export async function exportUserDataToJsonFile(): Promise<{ fileUri: string; fileName: string }> {
  const database = await getDatabase();

  const [dailyRolls, moodLogs, taskCompletions, profile, reminderPreference, userPreferences] = await Promise.all([
    database.getAllAsync('SELECT * FROM daily_rolls ORDER BY created_at DESC'),
    database.getAllAsync('SELECT * FROM mood_logs ORDER BY created_at DESC'),
    database.getAllAsync('SELECT * FROM task_completions ORDER BY completed_at DESC'),
    readLocalOnboardingProfile(),
    readReminderPreference(),
    readUserPreferences(),
  ]);

  const payload = {
    exportedAt: new Date().toISOString(),
    onboardingProfile: profile,
    reminderPreference,
    userPreferences,
    dailyRolls,
    moodLogs,
    taskCompletions,
  };

  const fileName = `habit-dice-export-${Date.now()}.json`;
  const baseDirectory = FileSystem.documentDirectory ?? FileSystem.cacheDirectory;
  if (!baseDirectory) {
    throw new Error('No writable directory available for data export');
  }

  const fileUri = `${baseDirectory}${fileName}`;
  await FileSystem.writeAsStringAsync(fileUri, JSON.stringify(payload, null, 2), {
    encoding: FileSystem.EncodingType.UTF8,
  });

  return {
    fileUri,
    fileName,
  };
}

export async function requestAccountDeletion(): Promise<void> {
  const profileId = await getOrCreateLocalProfileId();
  const database = await getDatabase();

  await database.execAsync(`
    DELETE FROM task_completions;
    DELETE FROM mood_logs;
    DELETE FROM daily_rolls;
    DELETE FROM sync_queue;
  `);

  await clearLocalOnboardingProfile();
  await clearUserPreferences();
  await writeReminderPreference({
    enabled: false,
    hour: 9,
    minute: 0,
    reminderType: 'daily',
    doNotDisturbStart: null,
    doNotDisturbEnd: null,
  });

  await queueForSync('account_deletion_requested', {
    profileId,
    requestedAt: new Date().toISOString(),
    retentionDays: 30,
  });
}
