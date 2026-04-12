import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { z } from 'zod';

import { readReminderPreference } from '@/db/local-profile-storage';
import { queueForSync } from '@/db/schema';
import {
  createNotificationPermissionService,
  type NotificationPermissionService,
} from '@/features/notifications/services/NotificationPermissionService';
import { safeGetExpoPushTokenAsync } from '@/features/notifications/services/SafeNotificationsService';

const PUSH_REGISTRATION_ID_KEY = 'habit-dice.push-registration-id';
const LAST_PUSH_TOKEN_KEY = 'habit-dice.push-token';

const pushRegistrationSchema = z.object({
  registrationId: z.string().min(1),
  expoPushToken: z.string().min(1),
  platform: z.enum(['ios', 'android', 'web', 'unknown']),
  permissionStatus: z.enum(['granted', 'denied', 'undetermined', 'unsupported']),
  reminderEnabled: z.boolean(),
  reminderHour: z.number().int().min(0).max(23),
  reminderMinute: z.number().int().min(0).max(59),
  registeredAt: z.string().min(1),
});

const pushReminderPreferenceSchema = z.object({
  registrationId: z.string().min(1),
  reminderEnabled: z.boolean(),
  reminderHour: z.number().int().min(0).max(23),
  reminderMinute: z.number().int().min(0).max(59),
  updatedAt: z.string().min(1),
});

export type PushRegistrationPayload = z.infer<typeof pushRegistrationSchema>;
export type PushReminderPreferencePayload = z.infer<typeof pushReminderPreferenceSchema>;

function getPlatform(): PushRegistrationPayload['platform'] {
  if (Platform.OS === 'ios') return 'ios';
  if (Platform.OS === 'android') return 'android';
  if (Platform.OS === 'web') return 'web';
  return 'unknown';
}

function getProjectId(): string | undefined {
  const fromEasConfig = (Constants as { easConfig?: { projectId?: string } }).easConfig?.projectId;
  if (fromEasConfig) {
    return fromEasConfig;
  }

  const fromExtra = (Constants.expoConfig?.extra as { eas?: { projectId?: string } } | undefined)?.eas?.projectId;
  return fromExtra;
}

function getOrCreateRegistrationId(): string {
  const existing = globalThis.localStorage?.getItem(PUSH_REGISTRATION_ID_KEY);
  if (existing) {
    return existing;
  }

  const next =
    typeof globalThis.crypto?.randomUUID === 'function'
      ? globalThis.crypto.randomUUID()
      : `push_reg_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  globalThis.localStorage?.setItem(PUSH_REGISTRATION_ID_KEY, next);
  return next;
}

function shouldSkipTokenQueue(token: string): boolean {
  const previousToken = globalThis.localStorage?.getItem(LAST_PUSH_TOKEN_KEY);
  if (previousToken === token) {
    return true;
  }

  globalThis.localStorage?.setItem(LAST_PUSH_TOKEN_KEY, token);
  return false;
}

export async function registerDevicePushToken(
  permissionService: NotificationPermissionService = createNotificationPermissionService()
): Promise<'granted' | 'denied' | 'undetermined' | 'unsupported'> {
  const permissionStatus = await permissionService.getCurrentStatus();
  if (permissionStatus !== 'granted' || Platform.OS === 'web') {
    return permissionStatus;
  }

  const tokenResponse = await safeGetExpoPushTokenAsync({
    projectId: getProjectId(),
  });

  if (!tokenResponse?.data) {
    return permissionStatus;
  }

  if (shouldSkipTokenQueue(tokenResponse.data)) {
    return permissionStatus;
  }

  const registrationId = getOrCreateRegistrationId();
  const reminderPref = await readReminderPreference();
  const payload = pushRegistrationSchema.parse({
    registrationId,
    expoPushToken: tokenResponse.data,
    platform: getPlatform(),
    permissionStatus,
    reminderEnabled: reminderPref.enabled,
    reminderHour: reminderPref.hour,
    reminderMinute: reminderPref.minute,
    registeredAt: new Date().toISOString(),
  });

  await queueForSync('push_token_registration', payload);
  return permissionStatus;
}

export async function queuePushReminderPreference(payload: {
  enabled: boolean;
  hour: number;
  minute: number;
}): Promise<void> {
  const registrationId = getOrCreateRegistrationId();
  const syncPayload = pushReminderPreferenceSchema.parse({
    registrationId,
    reminderEnabled: payload.enabled,
    reminderHour: payload.hour,
    reminderMinute: payload.minute,
    updatedAt: new Date().toISOString(),
  });

  await queueForSync('push_reminder_preference', syncPayload);
}
