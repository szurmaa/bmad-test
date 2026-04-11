import { describe, expect, it, jest, beforeEach } from '@jest/globals';

// Mock expo-notifications before importing the module under test
jest.mock('expo-notifications', () => ({
  scheduleNotificationAsync: jest.fn(async () => 'test-notification-id'),
  cancelScheduledNotificationAsync: jest.fn(async () => {}),
  SchedulableTriggerInputTypes: { DAILY: 'DAILY' },
}));

import * as Notifications from 'expo-notifications';
import {
  cancelReminderNotification,
  parseReminderDeepLink,
  scheduleReminderNotification,
  _testonly,
} from '@/features/notifications/services/NotificationSchedulerService';

const mockSchedule = jest.mocked(Notifications.scheduleNotificationAsync);
const mockCancel = jest.mocked(Notifications.cancelScheduledNotificationAsync);

beforeEach(async () => {
  jest.clearAllMocks();
  // Reset in-memory state between tests
  await _testonly._clearNotificationId();
});

describe('scheduleReminderNotification', () => {
  it('calls scheduleNotificationAsync with DAILY trigger and correct time', async () => {
    await scheduleReminderNotification({ hour: 9, minute: 30 });

    expect(mockSchedule).toHaveBeenCalledTimes(1);
    const [call] = mockSchedule.mock.calls;
    const arg = call[0] as any;
    expect(arg.trigger.hour).toBe(9);
    expect(arg.trigger.minute).toBe(30);
    expect(arg.content.data.url).toBe('habitdice://roll');
  });

  it('cancels any previous notification before scheduling a new one', async () => {
    mockSchedule.mockResolvedValueOnce('first-id').mockResolvedValueOnce('second-id');

    await scheduleReminderNotification({ hour: 8, minute: 0 });
    await scheduleReminderNotification({ hour: 10, minute: 0 });

    expect(mockCancel).toHaveBeenCalledTimes(1);
    expect(mockCancel).toHaveBeenCalledWith('first-id');
    expect(mockSchedule).toHaveBeenCalledTimes(2);
  });

  it('returns the notification identifier', async () => {
    const id = await scheduleReminderNotification({ hour: 7, minute: 0 });
    expect(id).toBe('test-notification-id');
  });
});

describe('cancelReminderNotification', () => {
  it('cancels the stored notification id', async () => {
    await scheduleReminderNotification({ hour: 9, minute: 0 });
    await cancelReminderNotification();

    expect(mockCancel).toHaveBeenCalledWith('test-notification-id');
  });

  it('does nothing when there is no stored notification', async () => {
    await cancelReminderNotification();
    expect(mockCancel).not.toHaveBeenCalled();
  });
});

describe('parseReminderDeepLink', () => {
  it('parses habitdice://roll as roll', () => {
    expect(parseReminderDeepLink('habitdice://roll')).toBe('roll');
  });

  it('returns null for unrelated URLs', () => {
    expect(parseReminderDeepLink('https://example.com')).toBeNull();
  });

  it('returns null for undefined', () => {
    expect(parseReminderDeepLink(undefined)).toBeNull();
  });

  it('returns null for empty strings', () => {
    expect(parseReminderDeepLink('')).toBeNull();
  });
});
