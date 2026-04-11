# Story 10.2: In-App Engagement Campaigns

Status: backlog

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

## References

**FRs Covered:** FR36, FR37, FR38
**Epic:** Epic 10 - Push Notifications & Engagement
