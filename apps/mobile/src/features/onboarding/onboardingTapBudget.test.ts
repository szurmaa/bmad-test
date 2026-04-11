import { describe, expect, it } from '@jest/globals';

import {
  isWithinOnboardingTapBudget,
  MAX_ONBOARDING_TAPS,
} from '@/features/onboarding/onboardingTapBudget';

describe('onboarding tap budget', () => {
  it('accepts tap counts inside the budget', () => {
    expect(isWithinOnboardingTapBudget(1)).toBe(true);
    expect(isWithinOnboardingTapBudget(MAX_ONBOARDING_TAPS)).toBe(true);
  });

  it('rejects tap counts above the budget', () => {
    expect(isWithinOnboardingTapBudget(MAX_ONBOARDING_TAPS + 1)).toBe(false);
  });
});