import { describe, expect, it, jest, beforeEach } from '@jest/globals';

// Mock DB schema functions
jest.mock('@/db/schema', () => ({
  getPendingSyncItems: jest.fn(),
  incrementSyncRetryCount: jest.fn(async () => {}),
  markSynced: jest.fn(async () => {}),
}));

// Mock firebase/app
jest.mock('firebase/app', () => ({
  initializeApp: jest.fn(() => ({})),
  getApps: jest.fn(() => []),
}));

// Mock firebase/firestore
jest.mock('firebase/firestore', () => ({
  getFirestore: jest.fn(() => ({})),
  setDoc: jest.fn(async () => {}),
  doc: jest.fn((_db: unknown, _col: string, id: string) => ({ id })),
}));

// Mock firebase config to return real-looking values so Firebase init proceeds
jest.mock('@/lib/firebase/config', () => ({
  firebaseConfigFromEnv: jest.fn(() => ({
    projectId: 'test-project',
    apiKey: 'test-api-key',
    authDomain: 'test.firebaseapp.com',
    appId: '1:000:web:000',
    messagingSenderId: '000',
  })),
}));

import * as firestoreModule from 'firebase/firestore';
import {
  getPendingSyncItems,
  incrementSyncRetryCount,
  markSynced,
} from '@/db/schema';
import { processQueue, _testonly } from '@/features/sync/SyncService';

const mockGetPending = jest.mocked(getPendingSyncItems);
const mockIncrementRetry = jest.mocked(incrementSyncRetryCount);
const mockMarkSynced = jest.mocked(markSynced);
const mockSetDoc = jest.mocked(firestoreModule.setDoc);

beforeEach(() => {
  jest.clearAllMocks();
  _testonly.resetFirestoreInstance();
});

function makeSyncItem(overrides: Partial<{
  id: string;
  action: string;
  payload: string;
  retry_count: number;
  created_at: string;
  synced_at: string | null;
}> = {}) {
  return {
    id: 'sync-1',
    action: 'roll_created',
    payload: JSON.stringify({ rollId: 'roll-1', date: '2026-04-11', taskId: 't-1', taskCategory: 'Mind', taskTitle: 'Test', createdAt: new Date().toISOString() }),
    retry_count: 0,
    created_at: new Date().toISOString(),
    synced_at: null,
    ...overrides,
  };
}

describe('processQueue', () => {
  it('does nothing when there are no pending items', async () => {
    mockGetPending.mockResolvedValueOnce([]);
    await processQueue();
    expect(mockMarkSynced).not.toHaveBeenCalled();
    expect(mockSetDoc).not.toHaveBeenCalled();
  });

  it('marks item synced after successful Firestore write', async () => {
    mockGetPending.mockResolvedValueOnce([makeSyncItem()]);
    mockSetDoc.mockResolvedValueOnce(undefined as never);

    await processQueue();

    expect(mockSetDoc).toHaveBeenCalledTimes(1);
    expect(mockMarkSynced).toHaveBeenCalledWith('sync-1');
    expect(mockIncrementRetry).not.toHaveBeenCalled();
  });

  it('increments retry_count on Firestore failure', async () => {
    mockGetPending.mockResolvedValueOnce([makeSyncItem()]);
    mockSetDoc.mockRejectedValueOnce(new Error('network error') as never);

    await processQueue();

    expect(mockIncrementRetry).toHaveBeenCalledWith('sync-1');
    expect(mockMarkSynced).not.toHaveBeenCalled();
  });

  it('skips items that have exceeded MAX_RETRY_COUNT', async () => {
    mockGetPending.mockResolvedValueOnce([makeSyncItem({ retry_count: 5 })]);

    await processQueue();

    expect(mockSetDoc).not.toHaveBeenCalled();
    expect(mockMarkSynced).not.toHaveBeenCalled();
    expect(mockIncrementRetry).not.toHaveBeenCalled();
  });

  it('marks item with malformed payload as synced to unblock queue', async () => {
    mockGetPending.mockResolvedValueOnce([makeSyncItem({ payload: 'NOT_JSON' })]);

    await processQueue();

    expect(mockMarkSynced).toHaveBeenCalledWith('sync-1');
    expect(mockSetDoc).not.toHaveBeenCalled();
  });

  it('processes multiple items and continues after a failure', async () => {
    const items = [
      makeSyncItem({ id: 'sync-1' }),
      makeSyncItem({ id: 'sync-2', action: 'roll_completed', payload: JSON.stringify({ rollId: 'roll-1', date: '2026-04-11', completedAt: new Date().toISOString() }) }),
      makeSyncItem({ id: 'sync-3', action: 'mood_logged', payload: JSON.stringify({ moodLogId: 'm-1', rollId: 'roll-1', date: '2026-04-11', moodValue: 4, loggedAt: new Date().toISOString() }) }),
    ];
    mockGetPending.mockResolvedValueOnce(items);

    // First write fails, rest succeed
    mockSetDoc
      .mockRejectedValueOnce(new Error('fail') as never)
      .mockResolvedValue(undefined as never);

    await processQueue();

    expect(mockIncrementRetry).toHaveBeenCalledWith('sync-1');
    expect(mockMarkSynced).toHaveBeenCalledWith('sync-2');
    expect(mockMarkSynced).toHaveBeenCalledWith('sync-3');
  });

  it('returns early when getPendingSyncItems throws', async () => {
    mockGetPending.mockRejectedValueOnce(new Error('db error') as never);

    // Should not throw
    await expect(processQueue()).resolves.toBeUndefined();
    expect(mockSetDoc).not.toHaveBeenCalled();
  });
});
