import { beforeEach, describe, expect, it, jest } from '@jest/globals';

jest.mock('@/db/schema', () => ({
  createTaskReviewEvent: jest.fn(async () => {}),
  getLatestTaskReviewEvent: jest.fn(async () => null),
  getTaskCatalogVersion: jest.fn(async () => 1),
  setTaskCatalogVersion: jest.fn(async () => {}),
}));

import {
  createTaskReviewEvent,
  getLatestTaskReviewEvent,
  getTaskCatalogVersion,
  setTaskCatalogVersion,
} from '@/db/schema';
import {
  approveTaskReview,
  isTransitionAllowed,
  publishApprovedTask,
  rejectTaskReview,
  submitTaskForReview,
} from '@/features/admin-review-workflow/ReviewPublishService';

const mockCreateEvent = jest.mocked(createTaskReviewEvent);
const mockGetLatest = jest.mocked(getLatestTaskReviewEvent);
const mockGetVersion = jest.mocked(getTaskCatalogVersion);
const mockSetVersion = jest.mocked(setTaskCatalogVersion);

beforeEach(() => {
  jest.clearAllMocks();
});

describe('Review workflow transitions', () => {
  it('validates legal transitions', () => {
    expect(isTransitionAllowed('draft', 'in_review')).toBe(true);
    expect(isTransitionAllowed('in_review', 'approved')).toBe(true);
    expect(isTransitionAllowed('approved', 'published')).toBe(true);
    expect(isTransitionAllowed('draft', 'published')).toBe(false);
  });

  it('submits draft task for review', async () => {
    mockGetLatest.mockResolvedValueOnce(null);

    await submitTaskForReview('task_1');

    expect(mockCreateEvent).toHaveBeenCalledWith(expect.objectContaining({
      taskId: 'task_1',
      status: 'in_review',
    }));
  });

  it('approves in_review task with reviewer metadata', async () => {
    mockGetLatest.mockResolvedValueOnce({
      id: 'x',
      task_id: 'task_1',
      status: 'in_review',
      reviewer_id: null,
      reviewer_notes: null,
      reviewed_at: null,
      created_at: new Date().toISOString(),
    });

    await approveTaskReview('task_1', 'reviewer_1', 'Looks good');

    expect(mockCreateEvent).toHaveBeenCalledWith(expect.objectContaining({
      taskId: 'task_1',
      status: 'approved',
      reviewerId: 'reviewer_1',
      reviewerNotes: 'Looks good',
    }));
  });

  it('rejects in_review task with reviewer metadata', async () => {
    mockGetLatest.mockResolvedValueOnce({
      id: 'x',
      task_id: 'task_1',
      status: 'in_review',
      reviewer_id: null,
      reviewer_notes: null,
      reviewed_at: null,
      created_at: new Date().toISOString(),
    });

    await rejectTaskReview('task_1', 'reviewer_2', 'Needs category fix');

    expect(mockCreateEvent).toHaveBeenCalledWith(expect.objectContaining({
      taskId: 'task_1',
      status: 'rejected',
      reviewerId: 'reviewer_2',
      reviewerNotes: 'Needs category fix',
    }));
  });

  it('publishes approved task and bumps catalog version', async () => {
    mockGetLatest.mockResolvedValueOnce({
      id: 'x',
      task_id: 'task_1',
      status: 'approved',
      reviewer_id: 'reviewer_1',
      reviewer_notes: 'OK',
      reviewed_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
    });
    mockGetVersion.mockResolvedValueOnce(5);

    const version = await publishApprovedTask('task_1');

    expect(version).toBe(6);
    expect(mockCreateEvent).toHaveBeenCalledWith(expect.objectContaining({
      taskId: 'task_1',
      status: 'published',
    }));
    expect(mockSetVersion).toHaveBeenCalledWith(6);
  });

  it('throws for invalid transitions', async () => {
    mockGetLatest.mockResolvedValueOnce({
      id: 'x',
      task_id: 'task_1',
      status: 'draft',
      reviewer_id: null,
      reviewer_notes: null,
      reviewed_at: null,
      created_at: new Date().toISOString(),
    });

    await expect(approveTaskReview('task_1', 'reviewer_1')).rejects.toThrow(
      'Invalid transition: draft -> approved'
    );
  });
});
