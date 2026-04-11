import { beforeEach, describe, expect, it, jest } from '@jest/globals';

jest.mock('expo-file-system', () => ({
  documentDirectory: 'file:///documents/',
  cacheDirectory: 'file:///cache/',
  writeAsStringAsync: jest.fn(async () => {}),
  EncodingType: { UTF8: 'utf8' },
}));

jest.mock('@/db/local-profile-storage', () => ({
  clearLocalOnboardingProfile: jest.fn(async () => {}),
  clearUserPreferences: jest.fn(async () => {}),
  getOrCreateLocalProfileId: jest.fn(async () => 'profile-1'),
  readLocalOnboardingProfile: jest.fn(async () => ({ onboardingCompletedAt: null })),
  readReminderPreference: jest.fn(async () => ({ enabled: false, hour: 9, minute: 0, reminderType: 'daily', doNotDisturbStart: null, doNotDisturbEnd: null })),
  readUserPreferences: jest.fn(async () => ({ appearance: 'system', aboutLastViewedAt: null })),
  writeReminderPreference: jest.fn(async () => {}),
}));

jest.mock('@/db/schema', () => ({
  getDatabase: jest.fn(),
  queueForSync: jest.fn(async () => {}),
}));

import * as FileSystem from 'expo-file-system';

import { getDatabase, queueForSync } from '@/db/schema';
import { exportUserDataToJsonFile, requestAccountDeletion } from '@/features/settings/DataPrivacyService';

const mockWriteAsStringAsync = jest.mocked(FileSystem.writeAsStringAsync);
const mockGetDatabase = jest.mocked(getDatabase);
const mockQueueForSync = jest.mocked(queueForSync);
const mockDb = {
  getAllAsync: jest.fn(async () => []),
  execAsync: jest.fn(async () => {}),
};

beforeEach(() => {
  jest.clearAllMocks();
  mockGetDatabase.mockResolvedValue(mockDb as never);
});

describe('DataPrivacyService', () => {
  it('exports user data to a JSON file', async () => {
    const result = await exportUserDataToJsonFile();

    expect(result.fileName).toContain('habit-dice-export-');
    expect(result.fileUri).toContain('file:///documents/');
    expect(mockWriteAsStringAsync).toHaveBeenCalledTimes(1);
  });

  it('queues account deletion request after clearing local data', async () => {
    await requestAccountDeletion();

    expect(mockDb.execAsync).toHaveBeenCalled();
    expect(mockQueueForSync).toHaveBeenCalledWith(
      'account_deletion_requested',
      expect.objectContaining({ profileId: 'profile-1', retentionDays: 30 })
    );
  });
});
