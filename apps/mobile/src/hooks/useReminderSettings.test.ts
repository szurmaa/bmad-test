import { describe, expect, it, jest, beforeEach } from '@jest/globals';
import { act, renderHook } from '@testing-library/react-native';

// Mock dependencies before importing the hook
jest.mock('@/db/local-profile-storage', () => ({
  readReminderPreference: jest.fn(),
  writeReminderPreference: jest.fn(async () => {}),
}));

jest.mock('@/features/notifications/services/NotificationSchedulerService', () => ({
  scheduleReminderNotification: jest.fn(async () => 'notif-id'),
  cancelReminderNotification: jest.fn(async () => {}),
}));

import {
  readReminderPreference,
  writeReminderPreference,
} from '@/db/local-profile-storage';
import {
  cancelReminderNotification,
  scheduleReminderNotification,
} from '@/features/notifications/services/NotificationSchedulerService';
import { useReminderSettings } from '@/hooks/useReminderSettings';

const mockRead = jest.mocked(readReminderPreference);
const mockWrite = jest.mocked(writeReminderPreference);
const mockSchedule = jest.mocked(scheduleReminderNotification);
const mockCancel = jest.mocked(cancelReminderNotification);

beforeEach(() => {
  jest.clearAllMocks();
  // Default: reminders disabled, 9:00
  mockRead.mockResolvedValue({ enabled: false, hour: 9, minute: 0 });
});

describe('useReminderSettings', () => {
  it('loads defaults from storage on mount', async () => {
    mockRead.mockResolvedValueOnce({ enabled: true, hour: 8, minute: 15 });

    const { result } = renderHook(() => useReminderSettings());

    // Should start loading
    expect(result.current.isLoading).toBe(true);

    await act(async () => {});

    expect(result.current.isLoading).toBe(false);
    expect(result.current.enabled).toBe(true);
    expect(result.current.hour).toBe(8);
    expect(result.current.minute).toBe(15);
  });

  it('starts with isLoading=true and exposes defaults before data resolves', () => {
    // mockRead is a promise that hasn't resolved yet; hold it
    let resolve: (v: any) => void;
    mockRead.mockReturnValueOnce(new Promise((r) => { resolve = r; }));

    const { result } = renderHook(() => useReminderSettings());

    expect(result.current.isLoading).toBe(true);
    // Defaults while loading
    expect(result.current.enabled).toBe(false);
    expect(result.current.hour).toBe(9);
    expect(result.current.minute).toBe(0);
  });

  describe('setEnabled', () => {
    it('persists enabled=true and schedules a notification', async () => {
      const { result } = renderHook(() => useReminderSettings());
      await act(async () => {});

      await act(async () => {
        await result.current.setEnabled(true);
      });

      expect(mockWrite).toHaveBeenCalledWith({ enabled: true, hour: 9, minute: 0 });
      expect(mockSchedule).toHaveBeenCalledWith({ hour: 9, minute: 0 });
      expect(mockCancel).not.toHaveBeenCalled();
      expect(result.current.enabled).toBe(true);
    });

    it('persists enabled=false and cancels the notification', async () => {
      mockRead.mockResolvedValueOnce({ enabled: true, hour: 9, minute: 0 });
      const { result } = renderHook(() => useReminderSettings());
      await act(async () => {});

      await act(async () => {
        await result.current.setEnabled(false);
      });

      expect(mockWrite).toHaveBeenCalledWith({ enabled: false, hour: 9, minute: 0 });
      expect(mockCancel).toHaveBeenCalledTimes(1);
      expect(mockSchedule).not.toHaveBeenCalled();
      expect(result.current.enabled).toBe(false);
    });
  });

  describe('setTime', () => {
    it('persists new time and re-schedules when reminders are enabled', async () => {
      mockRead.mockResolvedValueOnce({ enabled: true, hour: 9, minute: 0 });
      const { result } = renderHook(() => useReminderSettings());
      await act(async () => {});

      await act(async () => {
        await result.current.setTime(20, 30);
      });

      expect(mockWrite).toHaveBeenCalledWith({ enabled: true, hour: 20, minute: 30 });
      expect(mockSchedule).toHaveBeenCalledWith({ hour: 20, minute: 30 });
      expect(result.current.hour).toBe(20);
      expect(result.current.minute).toBe(30);
    });

    it('persists new time but does NOT schedule when reminders are disabled', async () => {
      const { result } = renderHook(() => useReminderSettings());
      await act(async () => {});

      await act(async () => {
        await result.current.setTime(20, 30);
      });

      expect(mockWrite).toHaveBeenCalledWith({ enabled: false, hour: 20, minute: 30 });
      expect(mockSchedule).not.toHaveBeenCalled();
    });
  });
});
