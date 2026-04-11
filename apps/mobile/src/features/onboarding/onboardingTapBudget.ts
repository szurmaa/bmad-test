export const MAX_ONBOARDING_TAPS = 4;

export function isWithinOnboardingTapBudget(tapCount: number): boolean {
  return tapCount <= MAX_ONBOARDING_TAPS;
}