import { beforeEach, describe, expect, it, jest } from '@jest/globals';

jest.mock('@/db/local-profile-storage', () => ({
  readLocalOnboardingProfile: jest.fn(async () => ({
    notificationChoice: null,
    notificationPermissionStatus: 'undetermined',
    notificationPromptedAt: null,
    onboardingCompletedAt: '2026-04-11T12:00:00.000Z',
  })),
}));

jest.mock('@/db/schema', () => ({
  queueForSync: jest.fn(async () => {}),
}));

import { readLocalOnboardingProfile } from '@/db/local-profile-storage';
import { queueForSync } from '@/db/schema';
import {
  analyticsEventSchema,
  buildAnalyticsEvent,
  trackProductEvent,
} from '@/features/analytics/AnalyticsService';

const mockReadProfile = jest.mocked(readLocalOnboardingProfile);
const mockQueueForSync = jest.mocked(queueForSync);

beforeEach(() => {
  jest.clearAllMocks();
  globalThis.localStorage?.clear();
});

describe('analyticsEventSchema', () => {
  it('accepts a valid analytics event contract', () => {
    expect(() => analyticsEventSchema.parse({
      eventId: 'evt_1',
      name: 'daily_roll',
      action: 'roll_today',
      userId: 'user_1',
      cohort: '2026-04-11',
      timestamp: new Date().toISOString(),
      properties: { daysPlayed: 2, completed: false },
    })).not.toThrow();
  });
});

describe('buildAnalyticsEvent', () => {
  it('builds event with required dimensions', async () => {
    const event = await buildAnalyticsEvent('daily_roll', 'roll_today', { daysPlayed: 3 });

    expect(event.name).toBe('daily_roll');
    expect(event.action).toBe('roll_today');
    expect(event.userId).toBeTruthy();
    expect(event.cohort).toBe('2026-04-11');
    expect(event.timestamp).toBeTruthy();
    expect(event.properties.daysPlayed).toBe(3);
  });

  it('uses pre-onboarding cohort when onboarding is incomplete', async () => {
    mockReadProfile.mockResolvedValueOnce({
      notificationChoice: null,
      notificationPermissionStatus: 'undetermined',
      notificationPromptedAt: null,
      onboardingCompletedAt: null,
    });

    const event = await buildAnalyticsEvent('daily_roll', 'roll_today');
    expect(event.cohort).toBe('pre-onboarding');
  });
});

describe('trackProductEvent', () => {
  it('queues product_event sync records', async () => {
    const event = await trackProductEvent('mood_submitted', 'log_mood', { moodValue: 4 });

    expect(mockQueueForSync).toHaveBeenCalledWith('product_event', event);
    expect(event.name).toBe('mood_submitted');
  });
});
