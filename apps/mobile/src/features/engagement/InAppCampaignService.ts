import Constants from 'expo-constants';
import { getApps, initializeApp } from 'firebase/app';
import { collection, getDocs, getFirestore, type Firestore } from 'firebase/firestore';

import { readLocalOnboardingProfile } from '@/db/local-profile-storage';
import { getDaysPlayed } from '@/db/schema';
import { trackProductEvent } from '@/features/analytics/AnalyticsService';
import { firebaseConfigFromEnv } from '@/lib/firebase/config';

export type CampaignType = 'banner' | 'modal' | 'streak-milestone-overlay';

export type CampaignVariant = {
  id: string;
  headline: string;
  body: string;
  ctaLabel: string;
  ctaRoute: string;
};

export type CampaignTargeting = {
  cohorts?: string[];
  minDaysPlayed?: number;
  minAppVersion?: string;
};

export type Campaign = {
  id: string;
  type: CampaignType;
  isActive: boolean;
  startsAt?: string;
  endsAt?: string;
  targeting: CampaignTargeting;
  variants: CampaignVariant[];
  priority: number;
};

export type ActiveCampaign = {
  campaign: Campaign;
  variant: CampaignVariant;
};

type CampaignContext = {
  cohort: string;
  daysPlayed: number;
  appVersion: string;
};

let _firestore: Firestore | null = null;

function getFirestoreInstance(): Firestore | null {
  if (_firestore) {
    return _firestore;
  }

  const config = firebaseConfigFromEnv();
  if (!config.apiKey || config.apiKey.startsWith('replace-with')) {
    return null;
  }

  try {
    const app =
      getApps().length > 0
        ? getApps()[0]
        : initializeApp({
            projectId: config.projectId,
            apiKey: config.apiKey,
            authDomain: config.authDomain,
            appId: config.appId,
            messagingSenderId: config.messagingSenderId,
          });

    _firestore = getFirestore(app);
    return _firestore;
  } catch {
    return null;
  }
}

function parseVariant(index: number, raw: Record<string, unknown>): CampaignVariant | null {
  if (
    typeof raw.headline !== 'string' ||
    typeof raw.body !== 'string' ||
    typeof raw.ctaLabel !== 'string' ||
    typeof raw.ctaRoute !== 'string'
  ) {
    return null;
  }

  const id = typeof raw.id === 'string' && raw.id.length > 0 ? raw.id : `variant_${index}`;
  return {
    id,
    headline: raw.headline,
    body: raw.body,
    ctaLabel: raw.ctaLabel,
    ctaRoute: raw.ctaRoute,
  };
}

function parseCampaign(id: string, data: Record<string, unknown>): Campaign | null {
  const rawType = data.type;
  if (rawType !== 'banner' && rawType !== 'modal' && rawType !== 'streak-milestone-overlay') {
    return null;
  }

  const rawVariants = Array.isArray(data.variants) ? data.variants : [];
  const variants = rawVariants
    .map((entry, index) =>
      typeof entry === 'object' && entry !== null
        ? parseVariant(index, entry as Record<string, unknown>)
        : null
    )
    .filter((item): item is CampaignVariant => Boolean(item));

  if (variants.length === 0) {
    return null;
  }

  const rawTargeting =
    typeof data.targeting === 'object' && data.targeting !== null
      ? (data.targeting as Record<string, unknown>)
      : {};

  const cohorts = Array.isArray(rawTargeting.cohorts)
    ? rawTargeting.cohorts.filter((value): value is string => typeof value === 'string')
    : undefined;

  return {
    id,
    type: rawType,
    isActive: typeof data.isActive === 'boolean' ? data.isActive : true,
    startsAt: typeof data.startsAt === 'string' ? data.startsAt : undefined,
    endsAt: typeof data.endsAt === 'string' ? data.endsAt : undefined,
    priority: typeof data.priority === 'number' ? data.priority : 0,
    targeting: {
      cohorts,
      minDaysPlayed:
        typeof rawTargeting.minDaysPlayed === 'number' ? rawTargeting.minDaysPlayed : undefined,
      minAppVersion:
        typeof rawTargeting.minAppVersion === 'string' ? rawTargeting.minAppVersion : undefined,
    },
    variants,
  };
}

function parseVersion(version: string): [number, number, number] {
  const [major, minor, patch] = version.split('.').map((part) => Number.parseInt(part || '0', 10));
  return [major || 0, minor || 0, patch || 0];
}

function meetsMinVersion(current: string, minimum: string): boolean {
  const [curMajor, curMinor, curPatch] = parseVersion(current);
  const [minMajor, minMinor, minPatch] = parseVersion(minimum);

  if (curMajor !== minMajor) return curMajor > minMajor;
  if (curMinor !== minMinor) return curMinor > minMinor;
  return curPatch >= minPatch;
}

export function campaignIsCurrentlyActive(campaign: Campaign, now = new Date()): boolean {
  if (!campaign.isActive) {
    return false;
  }

  if (campaign.startsAt && new Date(campaign.startsAt).getTime() > now.getTime()) {
    return false;
  }

  if (campaign.endsAt && new Date(campaign.endsAt).getTime() < now.getTime()) {
    return false;
  }

  return true;
}

export function doesCampaignMatchTargeting(campaign: Campaign, context: CampaignContext): boolean {
  const { cohorts, minDaysPlayed, minAppVersion } = campaign.targeting;

  if (cohorts && cohorts.length > 0 && !cohorts.includes(context.cohort)) {
    return false;
  }

  if (typeof minDaysPlayed === 'number' && context.daysPlayed < minDaysPlayed) {
    return false;
  }

  if (minAppVersion && !meetsMinVersion(context.appVersion, minAppVersion)) {
    return false;
  }

  return true;
}

function pickVariant(campaign: Campaign): CampaignVariant {
  const index = Math.floor(Math.random() * campaign.variants.length);
  return campaign.variants[index];
}

async function getCampaignContext(): Promise<CampaignContext> {
  const profile = await readLocalOnboardingProfile();
  const cohort = profile.onboardingCompletedAt ? profile.onboardingCompletedAt.slice(0, 10) : 'pre-onboarding';
  const daysPlayed = await getDaysPlayed();
  const appVersion = Constants.expoConfig?.version ?? '0.0.0';

  return {
    cohort,
    daysPlayed,
    appVersion,
  };
}

export async function loadActiveCampaigns(): Promise<ActiveCampaign[]> {
  const firestore = getFirestoreInstance();
  if (!firestore) {
    return [];
  }

  const [context, snapshot] = await Promise.all([
    getCampaignContext(),
    getDocs(collection(firestore, 'campaigns')),
  ]);

  const allCampaigns = snapshot.docs
    .map((docRef) => parseCampaign(docRef.id, docRef.data() as Record<string, unknown>))
    .filter((campaign): campaign is Campaign => Boolean(campaign));

  return allCampaigns
    .filter((campaign) => campaignIsCurrentlyActive(campaign))
    .filter((campaign) => doesCampaignMatchTargeting(campaign, context))
    .sort((left, right) => right.priority - left.priority)
    .map((campaign) => ({ campaign, variant: pickVariant(campaign) }));
}

export async function trackCampaignInteraction(params: {
  campaignId: string;
  campaignType: CampaignType;
  variantId: string;
  interaction: 'impression' | 'click' | 'dismiss';
}) {
  const eventName =
    params.interaction === 'impression'
      ? 'campaign_impression'
      : params.interaction === 'click'
        ? 'campaign_clicked'
        : 'campaign_dismissed';

  return trackProductEvent(eventName, `campaign_${params.interaction}`, {
    campaignId: params.campaignId,
    campaignType: params.campaignType,
    variantId: params.variantId,
  });
}

export const _testonly = {
  resetFirestoreInstance: () => {
    _firestore = null;
  },
};
