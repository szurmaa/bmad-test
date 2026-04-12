/**
 * Safe wrapper for expo-notifications that handles platform limitations.
 * 
 * On Android with Expo Go (SDK 53+), push notifications are not available.
 * This service provides safe no-op fallbacks to prevent crashes.
 */

import { Platform } from 'react-native';
import Constants from 'expo-constants';

// Try to import notifications, but fail gracefully on Android+ExpoGo
let Notifications: typeof import('expo-notifications') | null = null;
let isNotificationsAvailable = false;

try {
  // Only attempt to import on platforms/environments where it's supported
  // Android SDK 53+ with Expo Go doesn't support notifications
  if (!(Platform.OS === 'android' && Constants.appOwnership === 'expo')) {
    Notifications = require('expo-notifications');
    isNotificationsAvailable = true;
  }
} catch (error) {
  // Silently fail - notifications not available in this environment
  console.warn('[Notifications] Service unavailable in this environment');
}

/**
 * Check if notifications service is available
 */
export function isNotificationServiceAvailable(): boolean {
  return isNotificationsAvailable;
}

/**
 * Add a listener for notification responses (when user taps a notification)
 * Safe fallback: returns a no-op unsubscribe function if notifications unavailable
 */
export function safeAddNotificationResponseReceivedListener(
  listener: (response: any) => void
): { remove: () => void } {
  if (!isNotificationsAvailable || !Notifications) {
    return { remove: () => {} };
  }
  return Notifications.addNotificationResponseReceivedListener(listener);
}

/**
 * Get the last notification response that launched the app
 * Safe fallback: returns null if notifications unavailable
 */
export async function safeGetLastNotificationResponseAsync(): Promise<any | null> {
  if (!isNotificationsAvailable || !Notifications) {
    return null;
  }
  return Notifications.getLastNotificationResponseAsync();
}

/**
 * Schedule a notification
 * Safe fallback: returns empty string if notifications unavailable
 */
export async function safeScheduleNotificationAsync(
  params: any
): Promise<string> {
  if (!isNotificationsAvailable || !Notifications) {
    return '';
  }
  return Notifications.scheduleNotificationAsync(params);
}

/**
 * Cancel a scheduled notification
 * Safe fallback: no-op if notifications unavailable
 */
export async function safeCancelScheduledNotificationAsync(
  notificationId: string
): Promise<void> {
  if (!isNotificationsAvailable || !Notifications || !notificationId) {
    return;
  }
  return Notifications.cancelScheduledNotificationAsync(notificationId);
}

/**
 * Get notification permission status
 * Safe fallback: returns 'unsupported' if notifications unavailable
 */
export async function safeGetPermissionsAsync(): Promise<any> {
  if (!isNotificationsAvailable || !Notifications) {
    return { status: 'unsupported', ios: null };
  }
  return Notifications.getPermissionsAsync();
}

/**
 * Request notification permission
 * Safe fallback: returns 'unsupported' status if notifications unavailable
 */
export async function safeRequestPermissionAsync(options?: any): Promise<any> {
  if (!isNotificationsAvailable || !Notifications) {
    return { status: 'unsupported', ios: null };
  }
  return Notifications.requestPermissionsAsync(options);
}

/**
 * Set notification channel (Android only)
 * Safe fallback: no-op if notifications unavailable
 */
export async function safeSetNotificationChannelAsync(
  channelId: string,
  options: any
): Promise<any> {
  if (!isNotificationsAvailable || !Notifications) {
    return;
  }
  return Notifications.setNotificationChannelAsync(channelId, options);
}

/**
 * Get SchedulableTriggerInputTypes enum
 * Safe fallback: returns a mock object with safe fallback values if notifications unavailable
 */
export function getSchedulableTriggerInputTypes(): any {
  if (!isNotificationsAvailable || !Notifications) {
    return {
      DAILY: 'daily',
      WEEKLY: 'weekly',
      TIME_INTERVAL: 'time_interval',
    };
  }
  return Notifications.SchedulableTriggerInputTypes;
}

/**
 * Get IosAuthorizationStatus enum
 * Safe fallback: returns empty object if notifications unavailable
 */
export function getIosAuthorizationStatus(): any {
  if (!isNotificationsAvailable || !Notifications) {
    return {
      AUTHORIZED: -1,
      PROVISIONAL: 12,
      DENIED: 1,
      NOT_DETERMINED: 0,
    };
  }
  return Notifications.IosAuthorizationStatus;
}

/**
 * Get PermissionStatus enum
 * Safe fallback: returns minimal object if notifications unavailable
 */
export function getPermissionStatus(): any {
  if (!isNotificationsAvailable || !Notifications) {
    return {
      GRANTED: 'granted',
      DENIED: 'denied',
    };
  }
  return Notifications.PermissionStatus;
}

/**
 * Get AndroidImportance enum
 * Safe fallback: returns minimal object if notifications unavailable
 */
export function getAndroidImportance(): any {
  if (!isNotificationsAvailable || !Notifications) {
    return {
      DEFAULT: 3,
      HIGH: 4,
      LOW: 2,
      MIN: 1,
    };
  }
  return Notifications.AndroidImportance;
}

/**
 * Get the actual Notifications API (if available)
 * Use this only if you've checked isNotificationServiceAvailable() first
 */
export function getNotificationsAPI() {
  return Notifications;
}

/**
 * Get Expo push token
 * Safe fallback: returns null if notifications unavailable
 */
export async function safeGetExpoPushTokenAsync(options?: any): Promise<{ data: string } | null> {
  if (!isNotificationsAvailable || !Notifications) {
    return null;
  }
  try {
    return Notifications.getExpoPushTokenAsync(options);
  } catch (error) {
    console.warn('[Notifications] Failed to get push token:', error);
    return null;
  }
}

