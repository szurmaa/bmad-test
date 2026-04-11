import { beforeEach, describe, expect, it, jest } from '@jest/globals';

jest.mock('expo-constants', () => ({
  expoConfig: { version: '1.0.0', runtimeVersion: '1' },
  platform: { ios: true },
  executionEnvironment: 'storeClient',
}));

jest.mock('@/db/schema', () => ({
  queueForSync: jest.fn(async () => {}),
}));

import { queueForSync } from '@/db/schema';
import {
  addCrashBreadcrumb,
  captureCrash,
  evaluateCrashFreeRate,
  getCrashBreadcrumbs,
  installGlobalCrashHandler,
  resetCrashReportingState,
  startCrashReportingSession,
} from '@/features/crash-reporting/CrashReportingService';

const mockQueue = jest.mocked(queueForSync);

beforeEach(() => {
  jest.clearAllMocks();
  globalThis.localStorage?.clear();
  resetCrashReportingState();
  (globalThis as unknown as { ErrorUtils?: unknown }).ErrorUtils = undefined;
});

describe('breadcrumbs', () => {
  it('stores breadcrumbs with metadata', () => {
    addCrashBreadcrumb('roll_clicked', { daysPlayed: 3 });
    const items = getCrashBreadcrumbs();
    expect(items).toHaveLength(1);
    expect(items[0].message).toBe('roll_clicked');
    expect(items[0].metadata?.daysPlayed).toBe(3);
  });
});

describe('crash-free rate evaluation', () => {
  it('alerts when crash-free rate drops below threshold', () => {
    const result = evaluateCrashFreeRate({ sessions: 100, crashes: 1, threshold: 99.5 });
    expect(result.shouldAlert).toBe(true);
  });

  it('does not alert when rate stays above threshold', () => {
    const result = evaluateCrashFreeRate({ sessions: 1000, crashes: 1, threshold: 99.5 });
    expect(result.shouldAlert).toBe(false);
  });
});

describe('captureCrash', () => {
  it('queues crash report with breadcrumbs and release context', async () => {
    addCrashBreadcrumb('before_crash', { action: 'roll_today' });
    await startCrashReportingSession();

    const payload = await captureCrash(new Error('Boom'), { isFatal: true, source: 'test' });

    expect(payload.breadcrumbs).toHaveLength(2);
    expect(payload.release.appVersion).toBe('1.0.0');
    expect(mockQueue).toHaveBeenCalledWith('crash_report', expect.objectContaining({
      message: 'Boom',
      source: 'test',
      isFatal: true,
    }));
  });

  it('queues alert when crash-free threshold is breached', async () => {
    for (let index = 0; index < 100; index += 1) {
      await startCrashReportingSession();
    }

    await captureCrash(new Error('Threshold breach'), { isFatal: false, source: 'test' });

    expect(mockQueue).toHaveBeenCalledWith('crash_alert', expect.objectContaining({
      channel: 'team-reliability',
    }));
  });
});

describe('global crash handler', () => {
  it('installs global handler when ErrorUtils is available', () => {
    const setGlobalHandler = jest.fn();
    const getGlobalHandler = jest.fn(() => undefined);
    (globalThis as unknown as { ErrorUtils?: unknown }).ErrorUtils = { setGlobalHandler, getGlobalHandler };

    installGlobalCrashHandler();

    expect(setGlobalHandler).toHaveBeenCalledTimes(1);
  });
});
