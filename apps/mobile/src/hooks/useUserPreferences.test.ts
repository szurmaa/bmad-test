import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { act, renderHook } from '@testing-library/react-native';

jest.mock('@/db/local-profile-storage', () => ({
  getOrCreateLocalProfileId: jest.fn(async () => 'profile-1'),
  readUserPreferences: jest.fn(async () => ({ appearance: 'system', aboutLastViewedAt: null })),
  writeUserPreferences: jest.fn(async () => {}),
}));

jest.mock('@/db/schema', () => ({
  queueForSync: jest.fn(async () => {}),
}));

import { readUserPreferences, writeUserPreferences } from '@/db/local-profile-storage';
import { queueForSync } from '@/db/schema';
import { useUserPreferences } from '@/hooks/useUserPreferences';

const mockRead = jest.mocked(readUserPreferences);
const mockWrite = jest.mocked(writeUserPreferences);
const mockQueue = jest.mocked(queueForSync);

beforeEach(() => {
  jest.clearAllMocks();
});

describe('useUserPreferences', () => {
  it('loads preferences on mount', async () => {
    const { result } = renderHook(() => useUserPreferences());
    await act(async () => {});

    expect(result.current.isLoading).toBe(false);
    expect(result.current.appearance).toBe('system');
  });

  it('persists appearance and queues profile update', async () => {
    const { result } = renderHook(() => useUserPreferences());
    await act(async () => {});

    await act(async () => {
      await result.current.setAppearance('dark');
    });

    expect(mockWrite).toHaveBeenCalledWith(expect.objectContaining({ appearance: 'dark' }));
    expect(mockQueue).toHaveBeenCalledWith('user_profile_updated', expect.objectContaining({
      profileId: 'profile-1',
      appearance: 'dark',
    }));
  });
});
