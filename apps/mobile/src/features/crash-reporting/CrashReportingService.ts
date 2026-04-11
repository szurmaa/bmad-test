import Constants from 'expo-constants';

import { queueForSync } from '@/db/schema';
import { evaluateCrashAlert } from '@/features/crash-reporting/CrashAlertEvaluator';

const BREADCRUMB_LIMIT = 20;
const SESSION_COUNT_KEY = 'habit-dice.crash-session-count';
const CRASH_COUNT_KEY = 'habit-dice.crash-count';
const CRASH_ALERT_THRESHOLD = 99.5;

type Breadcrumb = {
  message: string;
  timestamp: string;
  metadata?: Record<string, string | number | boolean | null>;
};

type ErrorUtilsLike = {
  getGlobalHandler?: () => ((error: Error, isFatal?: boolean) => void) | undefined;
  setGlobalHandler?: (handler: (error: Error, isFatal?: boolean) => void) => void;
};

let breadcrumbs: Breadcrumb[] = [];
let previousGlobalHandler: ((error: Error, isFatal?: boolean) => void) | undefined;
const inMemoryCounters: Record<string, number> = {};

function getErrorUtils(): ErrorUtilsLike | undefined {
  return (globalThis as unknown as { ErrorUtils?: ErrorUtilsLike }).ErrorUtils;
}

function getStoredNumber(key: string): number {
  const raw = globalThis.localStorage?.getItem(key);
  if (raw) {
    return Number(raw) || 0;
  }

  return inMemoryCounters[key] ?? 0;
}

function setStoredNumber(key: string, value: number): void {
  inMemoryCounters[key] = value;
  globalThis.localStorage?.setItem(key, String(value));
}

function getReleaseContext() {
  return {
    appVersion: Constants.expoConfig?.version ?? 'unknown',
    runtimeVersion:
      typeof Constants.expoConfig?.runtimeVersion === 'string'
        ? Constants.expoConfig.runtimeVersion
        : 'unknown',
    platform: Constants.platform?.ios ? 'ios' : Constants.platform?.android ? 'android' : 'unknown',
    executionEnvironment: String(Constants.executionEnvironment ?? 'unknown'),
  };
}

export function addCrashBreadcrumb(
  message: string,
  metadata?: Record<string, string | number | boolean | null>
): void {
  breadcrumbs.push({
    message,
    timestamp: new Date().toISOString(),
    metadata,
  });

  if (breadcrumbs.length > BREADCRUMB_LIMIT) {
    breadcrumbs = breadcrumbs.slice(-BREADCRUMB_LIMIT);
  }
}

export function getCrashBreadcrumbs(): Breadcrumb[] {
  return [...breadcrumbs];
}

export function evaluateCrashFreeRate(params?: { sessions?: number; crashes?: number; threshold?: number }) {
  const sessions = params?.sessions ?? getStoredNumber(SESSION_COUNT_KEY);
  const crashes = params?.crashes ?? getStoredNumber(CRASH_COUNT_KEY);
  const threshold = params?.threshold ?? CRASH_ALERT_THRESHOLD;

  return evaluateCrashAlert({ sessions, crashes, threshold });
}

async function queueCrashAlertIfNeeded() {
  const evaluation = evaluateCrashFreeRate();
  if (!evaluation.shouldAlert) {
    return evaluation;
  }

  await queueForSync('crash_alert', {
    alertId: `crash_alert_${Date.now()}`,
    channel: 'team-reliability',
    threshold: evaluation.threshold,
    crashFreeRate: evaluation.crashFreeRate,
    sessions: evaluation.sessions,
    crashes: evaluation.crashes,
    triggeredAt: new Date().toISOString(),
  });

  return evaluation;
}

export async function captureCrash(error: Error, context?: { isFatal?: boolean; source?: string }) {
  const crashes = getStoredNumber(CRASH_COUNT_KEY) + 1;
  setStoredNumber(CRASH_COUNT_KEY, crashes);

  const payload = {
    crashId: `crash_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    message: error.message,
    stack: error.stack ?? 'no-stack',
    isFatal: Boolean(context?.isFatal),
    source: context?.source ?? 'unknown',
    occurredAt: new Date().toISOString(),
    breadcrumbs: getCrashBreadcrumbs(),
    release: getReleaseContext(),
  };

  await queueForSync('crash_report', payload);
  await queueCrashAlertIfNeeded();
  return payload;
}

export async function startCrashReportingSession() {
  const sessions = getStoredNumber(SESSION_COUNT_KEY) + 1;
  setStoredNumber(SESSION_COUNT_KEY, sessions);
  addCrashBreadcrumb('app_session_started', { sessions });
  return sessions;
}

export function installGlobalCrashHandler() {
  const errorUtils = getErrorUtils();
  if (!errorUtils?.setGlobalHandler) {
    return;
  }

  previousGlobalHandler = errorUtils.getGlobalHandler?.();

  errorUtils.setGlobalHandler((error: Error, isFatal?: boolean) => {
    void captureCrash(error, { isFatal, source: 'global_handler' });
    previousGlobalHandler?.(error, isFatal);
  });
}

export function resetCrashReportingState() {
  breadcrumbs = [];
  previousGlobalHandler = undefined;
  delete inMemoryCounters[SESSION_COUNT_KEY];
  delete inMemoryCounters[CRASH_COUNT_KEY];
  globalThis.localStorage?.removeItem(SESSION_COUNT_KEY);
  globalThis.localStorage?.removeItem(CRASH_COUNT_KEY);
}
