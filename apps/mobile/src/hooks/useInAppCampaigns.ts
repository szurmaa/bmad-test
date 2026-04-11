import { useCallback, useEffect, useState } from 'react';

import {
  loadActiveCampaigns,
  trackCampaignInteraction,
  type ActiveCampaign,
} from '@/features/engagement/InAppCampaignService';
import { useConnectivityStatus } from '@/hooks/useConnectivityStatus';

const CAMPAIGN_DISMISSALS_KEY = 'habit-dice.dismissed-campaign-ids';

function readDismissedCampaignIds(): string[] {
  const raw = globalThis.localStorage?.getItem(CAMPAIGN_DISMISSALS_KEY);
  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter((entry): entry is string => typeof entry === 'string');
  } catch {
    return [];
  }
}

function persistDismissedCampaignId(campaignId: string): void {
  const current = readDismissedCampaignIds();
  if (current.includes(campaignId)) {
    return;
  }

  globalThis.localStorage?.setItem(
    CAMPAIGN_DISMISSALS_KEY,
    JSON.stringify([...current, campaignId].slice(-30))
  );
}

export function useInAppCampaigns() {
  const { isOffline } = useConnectivityStatus();
  const [bannerCampaign, setBannerCampaign] = useState<ActiveCampaign | null>(null);

  useEffect(() => {
    let cancelled = false;

    if (isOffline) {
      setBannerCampaign(null);
      return () => {
        cancelled = true;
      };
    }

    loadActiveCampaigns()
      .then((campaigns) => {
        if (cancelled) {
          return;
        }

        const dismissedIds = new Set(readDismissedCampaignIds());
        const firstBanner = campaigns.find(
          (entry) => entry.campaign.type === 'banner' && !dismissedIds.has(entry.campaign.id)
        );

        if (!firstBanner) {
          setBannerCampaign(null);
          return;
        }

        setBannerCampaign(firstBanner);
        void trackCampaignInteraction({
          campaignId: firstBanner.campaign.id,
          campaignType: firstBanner.campaign.type,
          variantId: firstBanner.variant.id,
          interaction: 'impression',
        });
      })
      .catch(() => {
        if (!cancelled) {
          setBannerCampaign(null);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [isOffline]);

  const dismissBannerCampaign = useCallback(async () => {
    if (!bannerCampaign) {
      return;
    }

    persistDismissedCampaignId(bannerCampaign.campaign.id);
    setBannerCampaign(null);
    await trackCampaignInteraction({
      campaignId: bannerCampaign.campaign.id,
      campaignType: bannerCampaign.campaign.type,
      variantId: bannerCampaign.variant.id,
      interaction: 'dismiss',
    });
  }, [bannerCampaign]);

  const trackBannerClick = useCallback(async () => {
    if (!bannerCampaign) {
      return;
    }

    await trackCampaignInteraction({
      campaignId: bannerCampaign.campaign.id,
      campaignType: bannerCampaign.campaign.type,
      variantId: bannerCampaign.variant.id,
      interaction: 'click',
    });
  }, [bannerCampaign]);

  return {
    isOffline,
    showOfflineCampaignPlaceholder: isOffline,
    bannerCampaign,
    dismissBannerCampaign,
    trackBannerClick,
  };
}
