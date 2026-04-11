import { describe, expect, it, jest, beforeEach } from '@jest/globals';

jest.mock('@/db/schema', () => ({
  deactivateTaskCatalogItem: jest.fn(async () => {}),
  getTaskCatalog: jest.fn(async () => []),
  upsertTaskCatalogItem: jest.fn(async () => {}),
}));

import {
  createOrUpdateCatalogTask,
  deactivateCatalogTask,
  readCatalogTasks,
  validateTaskCatalogInput,
} from '@/features/admin-task-catalog/TaskCatalogService';
import {
  deactivateTaskCatalogItem,
  getTaskCatalog,
  upsertTaskCatalogItem,
} from '@/db/schema';

const mockUpsert = jest.mocked(upsertTaskCatalogItem);
const mockDeactivate = jest.mocked(deactivateTaskCatalogItem);
const mockGetCatalog = jest.mocked(getTaskCatalog);

beforeEach(() => {
  jest.clearAllMocks();
});

describe('validateTaskCatalogInput', () => {
  it('returns explicit validation errors for missing required fields', () => {
    const result = validateTaskCatalogInput({
      id: 'x',
      category: 'Mind',
      title: '',
      description: 'short',
      effortLevel: 'quick',
      isActive: true,
    });

    expect(result.valid).toBe(false);
    expect(result.fieldErrors.id).toBeTruthy();
    expect(result.fieldErrors.title).toBeTruthy();
    expect(result.fieldErrors.description).toBeTruthy();
  });

  it('accepts valid input', () => {
    const result = validateTaskCatalogInput({
      id: 'task_custom_001',
      category: 'Body',
      title: 'Morning stretch',
      description: '10-minute guided stretch sequence',
      effortLevel: 'quick',
      isActive: true,
    });

    expect(result.valid).toBe(true);
    expect(result.fieldErrors).toEqual({});
  });
});

describe('createOrUpdateCatalogTask', () => {
  it('does not persist when validation fails', async () => {
    const result = await createOrUpdateCatalogTask({
      id: 'x',
      category: 'Mind',
      title: '',
      description: 'bad',
      effortLevel: 'quick',
      isActive: true,
    });

    expect(result.valid).toBe(false);
    expect(mockUpsert).not.toHaveBeenCalled();
  });

  it('persists valid task data', async () => {
    const payload = {
      id: 'task_custom_001',
      category: 'Work' as const,
      title: 'Inbox zero sweep',
      description: 'Spend 10 minutes clearing and categorizing inbox messages',
      effortLevel: 'medium' as const,
      isActive: true,
    };

    const result = await createOrUpdateCatalogTask(payload);

    expect(result.valid).toBe(true);
    expect(mockUpsert).toHaveBeenCalledWith(payload);
  });
});

describe('status behavior', () => {
  it('deactivate marks task as inactive via repository call', async () => {
    await deactivateCatalogTask('task_custom_001');
    expect(mockDeactivate).toHaveBeenCalledWith('task_custom_001');
  });

  it('readCatalogTasks loads current catalog state', async () => {
    mockGetCatalog.mockResolvedValueOnce([
      {
        id: 'task_custom_001',
        category: 'Mind',
        title: 'Breathing break',
        description: 'Do breathing for ten minutes',
        effortLevel: 'quick',
        isActive: false,
        createdAt: new Date().toISOString(),
        lastSelectedAt: null,
      },
    ]);

    const result = await readCatalogTasks();
    expect(result).toHaveLength(1);
    expect(result[0].isActive).toBe(false);
  });
});
