import { useCallback, useEffect, useState } from 'react';

import {
  readReminderPreference,
  writeReminderPreference,
  type ReminderPreference,
} from '@/db/local-profile-storage';
import {
  cancelReminderNotification,
  scheduleReminderNotification,
} from '@/features/notifications/services/NotificationSchedulerService';

export type UseReminderSettingsReturn = {
  isLoading: boolean;
  enabled: boolean;
  hour: number;
  minute: number;
  setEnabled: (value: boolean) => Promise<void>;
  setTime: (hour: number, minute: number) => Promise<void>;
};

/**
 * Hook that reads, writes, and applies reminder notification preferences.
 * Automatically schedules or cancels notifications whenever settings change.
 */
export function useReminderSettings(): UseReminderSettingsReturn {
  const [isLoading, setIsLoading] = useState(true);
  const [pref, setPref] = useState<ReminderPreference>({ enabled: false, hour: 9, minute: 0 });

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

  const setEnabled = useCallback(async (value: boolean) => {
    const next: ReminderPreference = { ...pref, enabled: value };
    setPref(next);
    await writeReminderPreference(next);

    if (value) {
      await scheduleReminderNotification({ hour: next.hour, minute: next.minute });
    } else {
      await cancelReminderNotification();
    }
  }, [pref]);

  const setTime = useCallback(async (hour: number, minute: number) => {
    const next: ReminderPreference = { ...pref, hour, minute };
    setPref(next);
    await writeReminderPreference(next);

    if (next.enabled) {
      await scheduleReminderNotification({ hour, minute });
    }
  }, [pref]);

  return {
    isLoading,
    enabled: pref.enabled,
    hour: pref.hour,
    minute: pref.minute,
    setEnabled,
    setTime,
  };
}
