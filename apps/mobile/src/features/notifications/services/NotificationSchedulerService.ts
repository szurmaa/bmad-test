import {
  safeScheduleNotificationAsync,
  safeCancelScheduledNotificationAsync,
  getSchedulableTriggerInputTypes,
} from '@/features/notifications/services/SafeNotificationsService';

const REMINDER_NOTIFICATION_ID_KEY = 'habit-dice.reminder-notification-id';
const CHANNEL_ID = 'daily-reminders';
const DEEP_LINK_URL = 'habitdice://roll';

export type ScheduledTime = {
  hour: number; // 0-23
  minute: number; // 0-59
};

export type ReminderType = 'daily' | 'weekly' | 'email_only';

/**
 * Schedule a daily reminder notification at the given local time.
 * Cancels any previously scheduled reminder before scheduling the new one.
 * Returns the new notification identifier.
 */
export async function scheduleReminderNotification(
  time: ScheduledTime,
  options?: { reminderType?: ReminderType }
): Promise<string> {
  // Cancel any existing scheduled reminder first
  await cancelReminderNotification();

  const reminderType = options?.reminderType ?? 'daily';
  if (reminderType === 'email_only') {
    return '';
  }

  const day = new Date().getDay();
  const weekday = day === 0 ? 1 : day + 1;
  const SchedulableTriggerInputTypes = getSchedulableTriggerInputTypes();
  const trigger =
    reminderType === 'weekly'
      ? {
          type: SchedulableTriggerInputTypes.WEEKLY,
          weekday,
          hour: time.hour,
          minute: time.minute,
          channelId: CHANNEL_ID,
        }
      : {
          type: SchedulableTriggerInputTypes.DAILY,
          hour: time.hour,
          minute: time.minute,
          channelId: CHANNEL_ID,
        };

  const notificationId = await safeScheduleNotificationAsync({
    content: {
      title: 'Your daily roll is waiting 🎲',
      body: 'Tap to roll your micro-habit for today.',
      data: { url: DEEP_LINK_URL },
    },
    trigger,
  });

  // Persist the identifier so we can cancel it later
  await _saveNotificationId(notificationId);

  return notificationId;
}

/**
 * Cancel the currently scheduled daily reminder (if any).
 */
export async function cancelReminderNotification(): Promise<void> {
  const existingId = await _loadNotificationId();

  if (existingId) {
    await safeCancelScheduledNotificationAsync(existingId);
    await _clearNotificationId();
  }
}

/**
 * Parse a deep-link URL carried in a notification response.
 * Returns the pathname portion (e.g. 'roll') or null if the URL does not match.
 */
export function parseReminderDeepLink(url: string | undefined): string | null {
  if (!url) {
    return null;
  }

  try {
    const parsed = new URL(url);
    if (parsed.protocol === 'habitdice:') {
      return parsed.pathname.replace(/^\/+/, '') || parsed.host;
    }
  } catch {
    // Not a valid URL
  }

  return null;
}

// ---------------------------------------------------------------------------
// Private: tiny persistence wrapper using expo-sqlite localStorage polyfill
// (already installed via local-profile-storage). Falls back to a module-level
// variable in environments where globalThis.localStorage is unavailable (tests).
// ---------------------------------------------------------------------------

let _inMemoryNotificationId: string | null = null;

async function _saveNotificationId(id: string): Promise<void> {
  _inMemoryNotificationId = id;
  try {
    globalThis.localStorage?.setItem(REMINDER_NOTIFICATION_ID_KEY, id);
  } catch {
    // localStorage unavailable (e.g. test environment) — in-memory fallback is used
  }
}

async function _loadNotificationId(): Promise<string | null> {
  if (_inMemoryNotificationId) {
    return _inMemoryNotificationId;
  }

  try {
    const stored = globalThis.localStorage?.getItem(REMINDER_NOTIFICATION_ID_KEY);
    if (stored) {
      _inMemoryNotificationId = stored;
      return stored;
    }
  } catch {
    // no-op
  }

  return null;
}

async function _clearNotificationId(): Promise<void> {
  _inMemoryNotificationId = null;
  try {
    globalThis.localStorage?.removeItem(REMINDER_NOTIFICATION_ID_KEY);
  } catch {
    // no-op
  }
}

// Exported for tests only
export const _testonly = { _saveNotificationId, _loadNotificationId, _clearNotificationId };
