import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

import type { NotificationPermissionStatus } from '@/db/local-profile-storage';

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
    const iosStatus = settings.ios?.status;

    if (
      iosStatus === Notifications.IosAuthorizationStatus.AUTHORIZED ||
      iosStatus === Notifications.IosAuthorizationStatus.PROVISIONAL ||
      settings.granted
    ) {
      return 'granted';
    }

    if (iosStatus === Notifications.IosAuthorizationStatus.DENIED) {
      return 'denied';
    }

    return 'undetermined';
  }

  if (settings.granted || settings.status === Notifications.PermissionStatus.GRANTED) {
    return 'granted';
  }

  if (settings.status === Notifications.PermissionStatus.DENIED) {
    return 'denied';
  }

  return 'undetermined';
}

async function ensureAndroidNotificationChannelAsync(): Promise<void> {
  if (Platform.OS !== 'android') {
    return;
  }

  await Notifications.setNotificationChannelAsync(DEFAULT_CHANNEL_ID, {
    name: 'Daily reminders',
    importance: Notifications.AndroidImportance.DEFAULT,
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

      const settings = await Notifications.getPermissionsAsync();
      return mapNativePermissionStatus(settings);
    },
    async requestPermission() {
      if (Platform.OS === 'web') {
        return requestWebPermission();
      }

      await ensureAndroidNotificationChannelAsync();
      const settings = await Notifications.requestPermissionsAsync({
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
