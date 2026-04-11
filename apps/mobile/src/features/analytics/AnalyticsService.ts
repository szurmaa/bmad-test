import { z } from 'zod';

import { readLocalOnboardingProfile } from '@/db/local-profile-storage';
import { queueForSync } from '@/db/schema';

const ANALYTICS_USER_ID_KEY = 'habit-dice.analytics-user-id';

export const analyticsEventNames = [
  'daily_roll',
  'daily_roll_completed',
  'reroll_used',
  'mood_submitted',
  'reminder_enabled',
  'reminder_disabled',
  'reminder_time_updated',
  'campaign_impression',
  'campaign_clicked',
  'campaign_dismissed',
] as const;

export type AnalyticsEventName = (typeof analyticsEventNames)[number];

export const analyticsEventSchema = z.object({
  eventId: z.string().min(1),
  name: z.enum(analyticsEventNames),
  action: z.string().min(1),
  userId: z.string().min(1),
  cohort: z.string().min(1),
  timestamp: z.string().min(1),
  properties: z.record(z.string(), z.union([z.string(), z.number(), z.boolean(), z.null()])).default({}),
});

export type AnalyticsEvent = z.infer<typeof analyticsEventSchema>;

function generateAnalyticsId(): string {
  if (typeof globalThis.crypto?.randomUUID === 'function') {
    return globalThis.crypto.randomUUID();
  }

  return `analytics_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

async function getOrCreateAnalyticsUserId(): Promise<string> {
  const existing = globalThis.localStorage?.getItem(ANALYTICS_USER_ID_KEY);
  if (existing) {
    return existing;
  }

  const next = generateAnalyticsId();
  globalThis.localStorage?.setItem(ANALYTICS_USER_ID_KEY, next);
  return next;
}

async function getCohort(): Promise<string> {
  const profile = await readLocalOnboardingProfile();
  if (!profile.onboardingCompletedAt) {
    return 'pre-onboarding';
  }

  return profile.onboardingCompletedAt.slice(0, 10);
}

export async function buildAnalyticsEvent(
  name: AnalyticsEventName,
  action: string,
  properties: AnalyticsEvent['properties'] = {}
): Promise<AnalyticsEvent> {
  const event = {
    eventId: generateAnalyticsId(),
    name,
    action,
    userId: await getOrCreateAnalyticsUserId(),
    cohort: await getCohort(),
    timestamp: new Date().toISOString(),
    properties,
  };

  return analyticsEventSchema.parse(event);
}

export async function trackProductEvent(
  name: AnalyticsEventName,
  action: string,
  properties: AnalyticsEvent['properties'] = {}
): Promise<AnalyticsEvent> {
  const event = await buildAnalyticsEvent(name, action, properties);
  await queueForSync('product_event', event);
  return event;
}
