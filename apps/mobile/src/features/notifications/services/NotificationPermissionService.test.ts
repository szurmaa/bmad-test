import { describe, expect, it } from '@jest/globals';
import * as Notifications from 'expo-notifications';

import { mapNativePermissionStatus } from '@/features/notifications/services/NotificationPermissionService';

describe('mapNativePermissionStatus', () => {
  it('returns granted when iOS authorization is authorized', () => {
    const status = mapNativePermissionStatus({
      granted: true,
      status: Notifications.PermissionStatus.GRANTED,
      ios: { status: Notifications.IosAuthorizationStatus.AUTHORIZED },
    });

    expect(status).toBe('granted');
  });

  it('returns denied when permissions are denied', () => {
    const status = mapNativePermissionStatus({
      granted: false,
      status: Notifications.PermissionStatus.DENIED,
      ios: { status: Notifications.IosAuthorizationStatus.DENIED },
    });

    expect(status).toBe('denied');
  });

  it('returns undetermined when no choice has been made yet', () => {
    const status = mapNativePermissionStatus({
      granted: false,
      status: Notifications.PermissionStatus.UNDETERMINED,
      ios: { status: Notifications.IosAuthorizationStatus.NOT_DETERMINED },
    });

    expect(status).toBe('undetermined');
  });
});
