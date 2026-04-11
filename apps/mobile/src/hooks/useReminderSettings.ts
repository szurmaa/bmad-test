import { useCallback, useEffect, useState } from 'react';

import {
  readReminderPreference,
  writeReminderPreference,
  type ReminderPreference,
} from '@/db/local-profile-storage';
import {
  cancelReminderNotification,
  type ReminderType,
  scheduleReminderNotification,
} from '@/features/notifications/services/NotificationSchedulerService';
import { queuePushReminderPreference } from '@/features/notifications/services/PushNotificationService';
import { trackProductEvent } from '@/features/analytics/AnalyticsService';
import { addCrashBreadcrumb } from '@/features/crash-reporting/CrashReportingService';
import { getOrCreateLocalProfileId } from '@/db/local-profile-storage';
import { queueForSync } from '@/db/schema';

export type UseReminderSettingsReturn = {
  isLoading: boolean;
  enabled: boolean;
  hour: number;
  minute: number;
  reminderType: ReminderType;
  doNotDisturbStart: string | null;
  doNotDisturbEnd: string | null;
  setEnabled: (value: boolean) => Promise<void>;
  setTime: (hour: number, minute: number) => Promise<void>;
  setReminderType: (value: ReminderType) => Promise<void>;
  setDoNotDisturbWindow: (start: string | null, end: string | null) => Promise<void>;
};

function parseTimeToMinutes(value: string): number | null {
  const match = value.match(/^(\d{2}):(\d{2})$/);
  if (!match) {
    return null;
  }

  const hour = Number(match[1]);
  const minute = Number(match[2]);
  if (hour < 0 || hour > 23 || minute < 0 || minute > 59) {
    return null;
  }

  return hour * 60 + minute;
}

export function isSuppressedByDoNotDisturb(params: {
  hour: number;
  minute: number;
  start: string | null;
  end: string | null;
}): boolean {
  if (!params.start || !params.end) {
    return false;
  }

  const current = params.hour * 60 + params.minute;
  const startMinutes = parseTimeToMinutes(params.start);
  const endMinutes = parseTimeToMinutes(params.end);
  if (startMinutes === null || endMinutes === null) {
    return false;
  }

  // Handles both same-day windows (e.g. 13:00-15:00) and overnight windows (e.g. 22:00-07:00).
  if (startMinutes <= endMinutes) {
    return current >= startMinutes && current < endMinutes;
  }

  return current >= startMinutes || current < endMinutes;
}

/**
 * Hook that reads, writes, and applies reminder notification preferences.
 * Automatically schedules or cancels notifications whenever settings change.
 */
export function useReminderSettings(): UseReminderSettingsReturn {
  const [isLoading, setIsLoading] = useState(true);
  const [pref, setPref] = useState<ReminderPreference>({
    enabled: false,
    hour: 9,
    minute: 0,
    reminderType: 'daily',
    doNotDisturbStart: null,
    doNotDisturbEnd: null,
  });

  useEffect(() => {
    let cancelled = false;

    readReminderPreference().then((stored) => {
      if (!cancelled) {
        setPref(stored);
        setIsLoading(false);
      }
    });

    return () => { cancelled = true; };
  }, []);

  const syncProfilePreference = useCallback(async (value: ReminderPreference) => {
    const profileId = await getOrCreateLocalProfileId();
    await queueForSync('user_profile_updated', {
      profileId,
      notificationsEnabled: value.enabled,
      reminderType: value.reminderType,
      reminderHour: value.hour,
      reminderMinute: value.minute,
      doNotDisturbStart: value.doNotDisturbStart,
      doNotDisturbEnd: value.doNotDisturbEnd,
      updatedAt: new Date().toISOString(),
    });
  }, []);

  const applyScheduleFromPreference = useCallback(async (value: ReminderPreference) => {
    if (!value.enabled || value.reminderType === 'email_only') {
      await cancelReminderNotification();
      return;
    }

    const suppressed = isSuppressedByDoNotDisturb({
      hour: value.hour,
      minute: value.minute,
      start: value.doNotDisturbStart,
      end: value.doNotDisturbEnd,
    });

    if (suppressed) {
      await cancelReminderNotification();
      return;
    }

    await scheduleReminderNotification(
      { hour: value.hour, minute: value.minute },
      { reminderType: value.reminderType }
    );
  }, []);

  const setEnabled = useCallback(async (value: boolean) => {
    const next: ReminderPreference = { ...pref, enabled: value };
    setPref(next);
    await writeReminderPreference(next);
    await applyScheduleFromPreference(next);
    await syncProfilePreference(next);

    if (value) {
      await queuePushReminderPreference({
        enabled: true,
        hour: next.hour,
        minute: next.minute,
      });
      await trackProductEvent('reminder_enabled', 'enable_reminder', {
        hour: next.hour,
        minute: next.minute,
      });
      addCrashBreadcrumb('reminder_enabled', { hour: next.hour, minute: next.minute });
    } else {
      await queuePushReminderPreference({
        enabled: false,
        hour: next.hour,
        minute: next.minute,
      });
      await trackProductEvent('reminder_disabled', 'disable_reminder', {
        hour: next.hour,
        minute: next.minute,
      });
      addCrashBreadcrumb('reminder_disabled', { hour: next.hour, minute: next.minute });
    }
  }, [applyScheduleFromPreference, pref, syncProfilePreference]);

  const setTime = useCallback(async (hour: number, minute: number) => {
    const next: ReminderPreference = { ...pref, hour, minute };
    setPref(next);
    await writeReminderPreference(next);
    await syncProfilePreference(next);

    if (next.enabled) {
      await applyScheduleFromPreference(next);
      await queuePushReminderPreference({
        enabled: true,
        hour,
        minute,
      });
      await trackProductEvent('reminder_time_updated', 'update_reminder_time', {
        hour,
        minute,
      });
      addCrashBreadcrumb('reminder_time_updated', { hour, minute });
    }
  }, [applyScheduleFromPreference, pref, syncProfilePreference]);

  const setReminderType = useCallback(async (value: ReminderType) => {
    const next: ReminderPreference = { ...pref, reminderType: value };
    setPref(next);
    await writeReminderPreference(next);
    await applyScheduleFromPreference(next);
    await syncProfilePreference(next);

    await trackProductEvent('reminder_time_updated', 'update_reminder_type', {
      reminderType: value,
      hour: next.hour,
      minute: next.minute,
    });
  }, [applyScheduleFromPreference, pref, syncProfilePreference]);

  const setDoNotDisturbWindow = useCallback(async (start: string | null, end: string | null) => {
    const next: ReminderPreference = {
      ...pref,
      doNotDisturbStart: start,
      doNotDisturbEnd: end,
    };

    setPref(next);
    await writeReminderPreference(next);
    await applyScheduleFromPreference(next);
    await syncProfilePreference(next);
  }, [applyScheduleFromPreference, pref, syncProfilePreference]);

  return {
    isLoading,
    enabled: pref.enabled,
    hour: pref.hour,
    minute: pref.minute,
    reminderType: pref.reminderType,
    doNotDisturbStart: pref.doNotDisturbStart,
    doNotDisturbEnd: pref.doNotDisturbEnd,
    setEnabled,
    setTime,
    setReminderType,
    setDoNotDisturbWindow,
  };
}
