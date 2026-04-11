import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { act, renderHook } from '@testing-library/react-native';

jest.mock('@/features/engagement/InAppCampaignService', () => ({
  loadActiveCampaigns: jest.fn(async () => []),
  trackCampaignInteraction: jest.fn(async () => ({})),
}));

import {
  loadActiveCampaigns,
  trackCampaignInteraction,
} from '@/features/engagement/InAppCampaignService';
import { useInAppCampaigns } from '@/hooks/useInAppCampaigns';

const mockLoadActiveCampaigns = jest.mocked(loadActiveCampaigns);
const mockTrackCampaignInteraction = jest.mocked(trackCampaignInteraction);

beforeEach(() => {
  jest.clearAllMocks();
  globalThis.localStorage?.clear();
});

describe('useInAppCampaigns', () => {
  it('loads and exposes first banner campaign while tracking impression', async () => {
    mockLoadActiveCampaigns.mockResolvedValueOnce([
      {
        campaign: {
          id: 'campaign_banner_1',
          type: 'banner',
          isActive: true,
          targeting: {},
          variants: [
            {
              id: 'variant_a',
              headline: 'Small actions add up',
              body: 'Try your roll now.',
              ctaLabel: 'Open roll',
              ctaRoute: '/',
            },
          ],
          priority: 1,
        },
        variant: {
          id: 'variant_a',
          headline: 'Small actions add up',
          body: 'Try your roll now.',
          ctaLabel: 'Open roll',
          ctaRoute: '/',
        },
      },
    ]);

    const { result } = renderHook(() => useInAppCampaigns());
    await act(async () => {});

    expect(result.current.bannerCampaign?.campaign.id).toBe('campaign_banner_1');
    expect(mockTrackCampaignInteraction).toHaveBeenCalledWith(
      expect.objectContaining({ interaction: 'impression' })
    );
  });

  it('dismisses visible banner and tracks dismiss interaction', async () => {
    mockLoadActiveCampaigns.mockResolvedValueOnce([
      {
        campaign: {
          id: 'campaign_banner_2',
          type: 'banner',
          isActive: true,
          targeting: {},
          variants: [
            {
              id: 'variant_b',
              headline: 'Stay consistent',
              body: 'Set a reminder in settings.',
              ctaLabel: 'Set reminder',
              ctaRoute: '/settings',
            },
          ],
          priority: 1,
        },
        variant: {
          id: 'variant_b',
          headline: 'Stay consistent',
          body: 'Set a reminder in settings.',
          ctaLabel: 'Set reminder',
          ctaRoute: '/settings',
        },
      },
    ]);

    const { result } = renderHook(() => useInAppCampaigns());
    await act(async () => {});

    await act(async () => {
      await result.current.dismissBannerCampaign();
    });

    expect(result.current.bannerCampaign).toBeNull();
    expect(mockTrackCampaignInteraction).toHaveBeenCalledWith(
      expect.objectContaining({ interaction: 'dismiss' })
    );
  });
});
