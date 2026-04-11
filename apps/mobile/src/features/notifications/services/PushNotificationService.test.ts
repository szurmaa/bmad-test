import { beforeEach, describe, expect, it, jest } from '@jest/globals';

jest.mock('expo-constants', () => ({
  easConfig: { projectId: 'test-project' },
  expoConfig: { extra: { eas: { projectId: 'test-project' } } },
}));

jest.mock('expo-notifications', () => ({
  getExpoPushTokenAsync: jest.fn(async () => ({ data: 'ExponentPushToken[test-token]' })),
}));

jest.mock('@/db/local-profile-storage', () => ({
  readReminderPreference: jest.fn(async () => ({ enabled: true, hour: 8, minute: 45 })),
}));

jest.mock('@/db/schema', () => ({
  queueForSync: jest.fn(async () => {}),
}));

import * as Notifications from 'expo-notifications';

import { queueForSync } from '@/db/schema';
import {
  queuePushReminderPreference,
  registerDevicePushToken,
} from '@/features/notifications/services/PushNotificationService';

const mockQueueForSync = jest.mocked(queueForSync);
const mockGetExpoPushTokenAsync = jest.mocked(Notifications.getExpoPushTokenAsync);

beforeEach(() => {
  jest.clearAllMocks();
  globalThis.localStorage?.clear();
});

describe('registerDevicePushToken', () => {
  it('queues push token registration when permission is granted', async () => {
    const permissionService = {
      getCurrentStatus: jest.fn(async () => 'granted' as const),
      requestPermission: jest.fn(async () => 'granted' as const),
    };

    const status = await registerDevicePushToken(permissionService);

    expect(status).toBe('granted');
    expect(mockGetExpoPushTokenAsync).toHaveBeenCalled();
    expect(mockQueueForSync).toHaveBeenCalledWith(
      'push_token_registration',
      expect.objectContaining({
        expoPushToken: 'ExponentPushToken[test-token]',
        reminderEnabled: true,
        reminderHour: 8,
        reminderMinute: 45,
      })
    );
  });

  it('does not queue token registration when permission is denied', async () => {
    const permissionService = {
      getCurrentStatus: jest.fn(async () => 'denied' as const),
      requestPermission: jest.fn(async () => 'denied' as const),
    };

    const status = await registerDevicePushToken(permissionService);

    expect(status).toBe('denied');
    expect(mockGetExpoPushTokenAsync).not.toHaveBeenCalled();
    expect(mockQueueForSync).not.toHaveBeenCalledWith('push_token_registration', expect.anything());
  });
});

describe('queuePushReminderPreference', () => {
  it('queues reminder preference updates for backend scheduling', async () => {
    await queuePushReminderPreference({ enabled: false, hour: 21, minute: 10 });

    expect(mockQueueForSync).toHaveBeenCalledWith(
      'push_reminder_preference',
      expect.objectContaining({
        reminderEnabled: false,
        reminderHour: 21,
        reminderMinute: 10,
      })
    );
  });
});
