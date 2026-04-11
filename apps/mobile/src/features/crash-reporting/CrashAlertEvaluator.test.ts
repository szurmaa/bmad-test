import { describe, expect, it } from '@jest/globals';

import { evaluateCrashAlert } from '@/features/crash-reporting/CrashAlertEvaluator';

describe('evaluateCrashAlert', () => {
  it('returns 100% crash-free when no sessions exist', () => {
    expect(evaluateCrashAlert({ crashes: 3, sessions: 0 }).crashFreeRate).toBe(100);
  });

  it('alerts below threshold', () => {
    const result = evaluateCrashAlert({ crashes: 2, sessions: 100, threshold: 99.5 });
    expect(result.shouldAlert).toBe(true);
  });

  it('does not alert when at or above threshold', () => {
    const result = evaluateCrashAlert({ crashes: 1, sessions: 1000, threshold: 99.5 });
    expect(result.shouldAlert).toBe(false);
  });
});
