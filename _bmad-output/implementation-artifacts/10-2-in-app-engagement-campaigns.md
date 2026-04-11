# Story 10.2: In-App Engagement Campaigns

Status: done

## Story

As a product team member,
I want to run targeted in-app campaigns,
So that users see contextual offers and challenges.

## Acceptance Criteria

1. **Given** a campaign is created in backend
**When** app checks for active campaigns
**Then** device retrieves and displays matching banners or modals
**And** campaign targets by cohort, feature version, or streak status.

2. **Given** a user interacts with a campaign
**When** engagement event is logged
**Then** campaign metrics are trackable
**And** unit, integration, and E2E tests validate campaign flow.

## Implementation Notes

- Campaign configuration in Firestore
- A/B test variants stored with campaign metadata
- Remote config or Firestore collection sync
- Campaign types: banner, modal, streak-milestone overlay
- Target rules: cohort, day_threshold, etc.

## Testing Requirements

- Unit tests: Campaign targeting logic, condition evaluation
- Integration tests: Load campaigns → filter by cohort → verify display criteria
- E2E tests: User in cohort → sees campaign → interacts → metrics logged

## Dev Record

- Added campaign engine service in `apps/mobile/src/features/engagement/InAppCampaignService.ts`:
	- fetches campaign definitions from Firestore `campaigns`
	- validates campaign type/variants and filters invalid records
	- evaluates active window and targeting by cohort, min days played, and app version
	- tracks campaign interactions (impression, click, dismiss) via product event analytics
- Added campaign runtime hook in `apps/mobile/src/hooks/useInAppCampaigns.ts`:
	- loads active campaigns and selects top-priority eligible banner
	- tracks impression when campaign banner is surfaced
	- supports dismiss persistence and click/dismiss event tracking
- Integrated campaign UX into `apps/mobile/src/features/onboarding/components/HomeRollShell.tsx`:
	- renders contextual banner with headline/body/CTA
	- supports dismiss action and CTA route deep-linking
- Extended analytics event contract in `apps/mobile/src/features/analytics/AnalyticsService.ts`:
	- `campaign_impression`
	- `campaign_clicked`
	- `campaign_dismissed`
- Added tests:
	- `apps/mobile/src/features/engagement/InAppCampaignService.test.ts`
	- `apps/mobile/src/hooks/useInAppCampaigns.test.ts`
	- updated `apps/mobile/src/features/onboarding/components/HomeRollShell.test.tsx`

Validation run:
- Tests: 25 passing in focused suites including campaign targeting, hook behavior, and home-shell integration

## References

**FRs Covered:** FR36, FR37, FR38
**Epic:** Epic 10 - Push Notifications & Engagement
