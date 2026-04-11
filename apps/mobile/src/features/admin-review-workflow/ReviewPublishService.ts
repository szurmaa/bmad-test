import {
  createTaskReviewEvent,
  getLatestTaskReviewEvent,
  getTaskCatalogVersion,
  setTaskCatalogVersion,
  type DatabaseTables,
} from '@/db/schema';

export type ReviewStatus = 'draft' | 'in_review' | 'approved' | 'rejected' | 'published';

const allowedTransitions: Record<ReviewStatus, ReviewStatus[]> = {
  draft: ['in_review'],
  in_review: ['approved', 'rejected'],
  approved: ['published'],
  rejected: ['draft'],
  published: [],
};

function generateReviewEventId(taskId: string): string {
  return `review_${taskId}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export function isTransitionAllowed(from: ReviewStatus, to: ReviewStatus): boolean {
  return allowedTransitions[from].includes(to);
}

export async function submitTaskForReview(taskId: string): Promise<void> {
  const latest = await getLatestTaskReviewEvent(taskId);
  const current = (latest?.status as ReviewStatus | undefined) ?? 'draft';

  if (!isTransitionAllowed(current, 'in_review')) {
    throw new Error(`Invalid transition: ${current} -> in_review`);
  }

  await createTaskReviewEvent({
    id: generateReviewEventId(taskId),
    taskId,
    status: 'in_review',
  });
}

export async function approveTaskReview(taskId: string, reviewerId: string, reviewerNotes?: string): Promise<void> {
  const latest = await getLatestTaskReviewEvent(taskId);
  const current = (latest?.status as ReviewStatus | undefined) ?? 'draft';

  if (!isTransitionAllowed(current, 'approved')) {
    throw new Error(`Invalid transition: ${current} -> approved`);
  }

  await createTaskReviewEvent({
    id: generateReviewEventId(taskId),
    taskId,
    status: 'approved',
    reviewerId,
    reviewerNotes,
  });
}

export async function rejectTaskReview(taskId: string, reviewerId: string, reviewerNotes: string): Promise<void> {
  const latest = await getLatestTaskReviewEvent(taskId);
  const current = (latest?.status as ReviewStatus | undefined) ?? 'draft';

  if (!isTransitionAllowed(current, 'rejected')) {
    throw new Error(`Invalid transition: ${current} -> rejected`);
  }

  await createTaskReviewEvent({
    id: generateReviewEventId(taskId),
    taskId,
    status: 'rejected',
    reviewerId,
    reviewerNotes,
  });
}

export async function publishApprovedTask(taskId: string): Promise<number> {
  const latest = await getLatestTaskReviewEvent(taskId);
  const current = (latest?.status as ReviewStatus | undefined) ?? 'draft';

  if (!isTransitionAllowed(current, 'published')) {
    throw new Error(`Invalid transition: ${current} -> published`);
  }

  await createTaskReviewEvent({
    id: generateReviewEventId(taskId),
    taskId,
    status: 'published',
  });

  const currentVersion = await getTaskCatalogVersion();
  const nextVersion = currentVersion + 1;
  await setTaskCatalogVersion(nextVersion);
  return nextVersion;
}

export async function getCurrentReviewState(taskId: string): Promise<DatabaseTables['task_review_events'] | null> {
  return getLatestTaskReviewEvent(taskId);
}
