import { describe, expect, it } from '@jest/globals';

jest.mock('expo-constants', () => ({
  expoConfig: { version: '1.0.0' },
}));

jest.mock('firebase/app', () => ({
  getApps: jest.fn(() => []),
  initializeApp: jest.fn(() => ({})),
}));

jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  getDocs: jest.fn(async () => ({ docs: [] })),
  getFirestore: jest.fn(() => ({})),
}));

import {
  campaignIsCurrentlyActive,
  doesCampaignMatchTargeting,
  type Campaign,
} from '@/features/engagement/InAppCampaignService';

const baseCampaign: Campaign = {
  id: 'campaign_1',
  type: 'banner',
  isActive: true,
  targeting: {},
  variants: [
    {
      id: 'a',
      headline: 'Try reminders',
      body: 'Stay consistent with a daily nudge.',
      ctaLabel: 'Open settings',
      ctaRoute: '/settings',
    },
  ],
  priority: 10,
};

describe('campaignIsCurrentlyActive', () => {
  it('returns false for campaigns outside their time window', () => {
    const now = new Date('2026-04-11T12:00:00.000Z');
    const campaign: Campaign = {
      ...baseCampaign,
      startsAt: '2026-04-12T00:00:00.000Z',
      endsAt: '2026-04-13T00:00:00.000Z',
    };

    expect(campaignIsCurrentlyActive(campaign, now)).toBe(false);
  });

  it('returns true when active and within the time window', () => {
    const now = new Date('2026-04-11T12:00:00.000Z');
    const campaign: Campaign = {
      ...baseCampaign,
      startsAt: '2026-04-10T00:00:00.000Z',
      endsAt: '2026-04-12T00:00:00.000Z',
    };

    expect(campaignIsCurrentlyActive(campaign, now)).toBe(true);
  });
});

describe('doesCampaignMatchTargeting', () => {
  it('matches when all targeting conditions pass', () => {
    const campaign: Campaign = {
      ...baseCampaign,
      targeting: {
        cohorts: ['2026-04-11'],
        minDaysPlayed: 3,
        minAppVersion: '1.0.0',
      },
    };

    expect(
      doesCampaignMatchTargeting(campaign, {
        cohort: '2026-04-11',
        daysPlayed: 5,
        appVersion: '1.2.0',
      })
    ).toBe(true);
  });

  it('fails when cohort does not match', () => {
    const campaign: Campaign = {
      ...baseCampaign,
      targeting: { cohorts: ['2026-04-09'] },
    };

    expect(
      doesCampaignMatchTargeting(campaign, {
        cohort: '2026-04-11',
        daysPlayed: 5,
        appVersion: '1.0.0',
      })
    ).toBe(false);
  });
});
