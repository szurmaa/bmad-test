import { getApps, initializeApp } from 'firebase/app';
import { doc, getFirestore, setDoc, type Firestore } from 'firebase/firestore';

import {
  getPendingSyncItems,
  incrementSyncRetryCount,
  markSynced,
} from '@/db/schema';
import { firebaseConfigFromEnv } from '@/lib/firebase/config';

// Maximum number of retry attempts before giving up on a sync item
const MAX_RETRY_COUNT = 5;

// Lazy Firestore reference — initialized on first sync attempt
let _firestore: Firestore | null = null;

/**
 * Lazily initialize Firebase and return a Firestore instance.
 * Returns null (and logs nothing) if Firebase is not configured.
 */
function getFirestoreInstance(): Firestore | null {
  if (_firestore) {
    return _firestore;
  }

  const config = firebaseConfigFromEnv();

  // Skip initialization if Firebase is not configured (placeholder keys)
  if (!config.apiKey || config.apiKey.startsWith('replace-with')) {
    return null;
  }

  try {
    const app =
      getApps().length > 0
        ? getApps()[0]
        : initializeApp({
            projectId: config.projectId,
            apiKey: config.apiKey,
            authDomain: config.authDomain,
            appId: config.appId,
            messagingSenderId: config.messagingSenderId,
          });

    _firestore = getFirestore(app);
    return _firestore;
  } catch {
    // Firebase unavailable — sync will be retried next foreground
    return null;
  }
}

/**
 * Write a single sync item to Firestore based on its action type.
 * Throws if the write fails so the caller can track retry count.
 */
async function syncItemToFirestore(
  firestore: Firestore,
  action: string,
  payload: Record<string, unknown>
): Promise<void> {
  switch (action) {
    case 'roll_created':
      await setDoc(
        doc(firestore, 'rolls', payload.rollId as string),
        { ...payload, syncedAt: new Date().toISOString() },
        { merge: true }
      );
      break;

    case 'roll_completed':
      await setDoc(
        doc(firestore, 'rolls', payload.rollId as string),
        { completed: true, completedAt: payload.completedAt, syncedAt: new Date().toISOString() },
        { merge: true }
      );
      break;

    case 'roll_rerolled':
      await setDoc(
        doc(firestore, 'rolls', payload.rollId as string),
        {
          rerollUsed: true,
          taskId: payload.newTaskId,
          taskCategory: payload.newTaskCategory,
          taskTitle: payload.newTaskTitle,
          rerolledAt: payload.rerolledAt,
          syncedAt: new Date().toISOString(),
        },
        { merge: true }
      );
      break;

    case 'mood_logged':
      await setDoc(
        doc(firestore, 'mood_logs', payload.moodLogId as string),
        { ...payload, syncedAt: new Date().toISOString() },
        { merge: true }
      );
      break;

    case 'product_event':
      await setDoc(
        doc(firestore, 'product_events', payload.eventId as string),
        { ...payload, syncedAt: new Date().toISOString() },
        { merge: true }
      );
      break;

    case 'crash_report':
      await setDoc(
        doc(firestore, 'crash_reports', payload.crashId as string),
        { ...payload, syncedAt: new Date().toISOString() },
        { merge: true }
      );
      break;

    case 'crash_alert':
      await setDoc(
        doc(firestore, 'team_alerts', payload.alertId as string),
        { ...payload, syncedAt: new Date().toISOString() },
        { merge: true }
      );
      break;

    case 'push_token_registration':
      await setDoc(
        doc(firestore, 'device_push_tokens', payload.registrationId as string),
        { ...payload, syncedAt: new Date().toISOString() },
        { merge: true }
      );
      break;

    case 'push_reminder_preference':
      await setDoc(
        doc(firestore, 'device_notification_preferences', payload.registrationId as string),
        { ...payload, syncedAt: new Date().toISOString() },
        { merge: true }
      );
      break;

    case 'user_profile_updated':
      await setDoc(
        doc(firestore, 'user_profiles', payload.profileId as string),
        { ...payload, syncedAt: new Date().toISOString() },
        { merge: true }
      );
      break;

    case 'account_deletion_requested':
      await setDoc(
        doc(firestore, 'deletion_requests', payload.profileId as string),
        { ...payload, syncedAt: new Date().toISOString() },
        { merge: true }
      );
      break;

    default:
      // Unknown action — mark as synced so it doesn't block the queue
      break;
  }
}

/**
 * Process the offline sync queue.
 * - Reads up to 50 pending items from SQLite.
 * - Skips items that have exceeded MAX_RETRY_COUNT.
 * - On success: marks the item synced.
 * - On failure: increments retry_count (silent, retried next foreground).
 *
 * Safe to call multiple times concurrently — each call is independent.
 */
export async function processQueue(): Promise<void> {
  const firestore = getFirestoreInstance();

  // No Firebase — nothing to sync; items remain in queue for later
  if (!firestore) {
    return;
  }

  let pendingItems: Awaited<ReturnType<typeof getPendingSyncItems>>;

  try {
    pendingItems = await getPendingSyncItems();
  } catch {
    return;
  }

  if (!pendingItems || pendingItems.length === 0) {
    return;
  }

  for (const item of pendingItems) {
    if (item.retry_count >= MAX_RETRY_COUNT) {
      // Permanently failed item — skip silently; a future schema migration could prune these
      continue;
    }

    let payload: Record<string, unknown>;
    try {
      payload = JSON.parse(item.payload) as Record<string, unknown>;
    } catch {
      // Malformed payload — mark synced so it doesn't block forever
      await markSynced(item.id).catch(() => {});
      continue;
    }

    try {
      await syncItemToFirestore(firestore, item.action, payload);
      await markSynced(item.id);
    } catch {
      // Transient failure — increment retry counter and continue with remaining items
      await incrementSyncRetryCount(item.id).catch(() => {});
    }
  }
}

// Exported for tests only
export const _testonly = {
  resetFirestoreInstance: () => {
    _firestore = null;
  },
};
