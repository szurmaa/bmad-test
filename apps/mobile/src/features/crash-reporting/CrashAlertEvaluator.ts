export type CrashAlertEvaluation = {
  crashFreeRate: number;
  crashes: number;
  sessions: number;
  threshold: number;
  shouldAlert: boolean;
};

export function evaluateCrashAlert(params: {
  crashes: number;
  sessions: number;
  threshold?: number;
}): CrashAlertEvaluation {
  const threshold = params.threshold ?? 99.5;

  if (params.sessions <= 0) {
    return {
      crashFreeRate: 100,
      crashes: params.crashes,
      sessions: params.sessions,
      threshold,
      shouldAlert: false,
    };
  }

  const crashFreeRate = Math.max(0, ((params.sessions - params.crashes) / params.sessions) * 100);
  return {
    crashFreeRate,
    crashes: params.crashes,
    sessions: params.sessions,
    threshold,
    shouldAlert: crashFreeRate < threshold,
  };
}
