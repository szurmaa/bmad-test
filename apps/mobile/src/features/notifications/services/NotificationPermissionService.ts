import { Platform } from 'react-native';

import type { NotificationPermissionStatus } from '@/db/local-profile-storage';
import {
  safeGetPermissionsAsync,
  safeRequestPermissionAsync,
  safeSetNotificationChannelAsync,
  getIosAuthorizationStatus,
  getPermissionStatus,
  getAndroidImportance,
} from '@/features/notifications/services/SafeNotificationsService';

export type NotificationPermissionService = {
  getCurrentStatus: () => Promise<NotificationPermissionStatus>;
  requestPermission: () => Promise<NotificationPermissionStatus>;
};

type NativePermissionSettings = {
  granted?: boolean;
  status?: string;
  ios?: {
    status?: number | null;
  } | null;
};

const DEFAULT_CHANNEL_ID = 'daily-reminders';

export function mapNativePermissionStatus(
  settings: NativePermissionSettings
): NotificationPermissionStatus {
  if (Platform.OS === 'ios') {
    const IosAuthorizationStatus = getIosAuthorizationStatus();
    const iosStatus = settings.ios?.status;

    if (
      iosStatus === IosAuthorizationStatus.AUTHORIZED ||
      iosStatus === IosAuthorizationStatus.PROVISIONAL ||
      settings.granted
    ) {
      return 'granted';
    }

    if (iosStatus === IosAuthorizationStatus.DENIED) {
      return 'denied';
    }

    return 'undetermined';
  }

  const PermissionStatus = getPermissionStatus();
  if (settings.granted || settings.status === PermissionStatus.GRANTED) {
    return 'granted';
  }

  if (settings.status === PermissionStatus.DENIED) {
    return 'denied';
  }

  return 'undetermined';
}

async function ensureAndroidNotificationChannelAsync(): Promise<void> {
  if (Platform.OS !== 'android') {
    return;
  }

  const AndroidImportance = getAndroidImportance();
  await safeSetNotificationChannelAsync(DEFAULT_CHANNEL_ID, {
    name: 'Daily reminders',
    importance: AndroidImportance.DEFAULT,
  });
}

async function getWebPermissionStatus(): Promise<NotificationPermissionStatus> {
  if (typeof Notification === 'undefined') {
    return 'unsupported';
  }

  if (Notification.permission === 'granted') {
    return 'granted';
  }

  if (Notification.permission === 'denied') {
    return 'denied';
  }

  return 'undetermined';
}

async function requestWebPermission(): Promise<NotificationPermissionStatus> {
  if (typeof Notification === 'undefined' || typeof Notification.requestPermission !== 'function') {
    return 'unsupported';
  }

  const result = await Notification.requestPermission();

  if (result === 'granted') {
    return 'granted';
  }

  if (result === 'denied') {
    return 'denied';
  }

  return 'undetermined';
}

export function createNotificationPermissionService(): NotificationPermissionService {
  return {
    async getCurrentStatus() {
      if (Platform.OS === 'web') {
        return getWebPermissionStatus();
      }

      const settings = await safeGetPermissionsAsync();
      return mapNativePermissionStatus(settings);
    },
    async requestPermission() {
      if (Platform.OS === 'web') {
        return requestWebPermission();
      }

      await ensureAndroidNotificationChannelAsync();
      const settings = await safeRequestPermissionAsync({
        ios: {
          allowAlert: true,
          allowBadge: true,
          allowSound: true,
        },
      });

      return mapNativePermissionStatus(settings);
    },
  };
}
