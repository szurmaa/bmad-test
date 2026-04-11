import { beforeEach, describe, expect, it, jest } from '@jest/globals';

jest.mock('@/db/schema', () => ({
  getTaskCatalogVersion: jest.fn(async () => 1),
  setTaskCatalogVersion: jest.fn(async () => {}),
  upsertTaskCatalogItem: jest.fn(async () => {}),
}));

jest.mock('firebase/app', () => ({
  getApps: jest.fn(() => []),
  initializeApp: jest.fn(() => ({})),
}));

jest.mock('firebase/firestore', () => ({
  getFirestore: jest.fn(() => ({})),
  doc: jest.fn((_db: unknown, coll: string, id: string) => ({ coll, id })),
  collection: jest.fn((_db: unknown, coll: string) => ({ coll })),
  getDoc: jest.fn(async () => ({ exists: () => true, data: () => ({ version: 3 }) })),
  getDocs: jest.fn(async () => ({ docs: [] })),
}));

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
import { getTaskCatalogVersion, setTaskCatalogVersion, upsertTaskCatalogItem } from '@/db/schema';
import {
  _testonly,
  refreshTaskCatalogIfNeeded,
} from '@/features/task-catalog-refresh/TaskCatalogRefreshService';

const mockGetTaskCatalogVersion = jest.mocked(getTaskCatalogVersion);
const mockSetTaskCatalogVersion = jest.mocked(setTaskCatalogVersion);
const mockUpsert = jest.mocked(upsertTaskCatalogItem);
const mockGetDoc = jest.mocked(firestoreModule.getDoc);
const mockGetDocs = jest.mocked(firestoreModule.getDocs);

beforeEach(() => {
  jest.clearAllMocks();
  _testonly.resetFirestoreInstance();
});

describe('refreshTaskCatalogIfNeeded', () => {
  it('does not refresh when remote version is not newer', async () => {
    mockGetTaskCatalogVersion.mockResolvedValueOnce(3);
    mockGetDoc.mockResolvedValueOnce({ exists: () => true, data: () => ({ version: 3 }) } as never);

    const result = await refreshTaskCatalogIfNeeded();

    expect(result.refreshed).toBe(false);
    expect(mockUpsert).not.toHaveBeenCalled();
    expect(mockSetTaskCatalogVersion).not.toHaveBeenCalled();
  });

  it('imports tasks and bumps local version when remote version is newer', async () => {
    mockGetTaskCatalogVersion.mockResolvedValueOnce(1);
    mockGetDoc.mockResolvedValueOnce({ exists: () => true, data: () => ({ version: 4 }) } as never);
    mockGetDocs.mockResolvedValueOnce({
      docs: [
        {
          id: 'task_custom_001',
          data: () => ({
            category: 'Mind',
            title: 'Breathing break',
            description: 'Guided breathing for ten minutes',
            effortLevel: 'quick',
            isActive: true,
          }),
        },
      ],
    } as never);

    const result = await refreshTaskCatalogIfNeeded();

    expect(result.refreshed).toBe(true);
    expect(result.version).toBe(4);
    expect(result.imported).toBe(1);
    expect(mockUpsert).toHaveBeenCalledWith({
      id: 'task_custom_001',
      category: 'Mind',
      title: 'Breathing break',
      description: 'Guided breathing for ten minutes',
      effortLevel: 'quick',
      isActive: true,
    });
    expect(mockSetTaskCatalogVersion).toHaveBeenCalledWith(4);
  });
});
