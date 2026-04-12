import { describe, expect, it, jest } from '@jest/globals';
import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';

import type {
  LocalOnboardingProfile,
  NotificationChoice,
  NotificationPermissionStatus,
} from '@/db/local-profile-storage';
import { OnboardingFlowGate } from '@/features/onboarding/components/OnboardingFlowGate';
import { MAX_ONBOARDING_TAPS } from '@/features/onboarding/onboardingTapBudget';
import type { NotificationPermissionService } from '@/features/notifications/services/NotificationPermissionService';
import type { OnboardingProfileRepository } from '@/features/onboarding/repository/OnboardingProfileRepository';

jest.mock('@/hooks/useDailyRollInit', () => ({
  useDailyRollInit: jest.fn(() => ({
    completeToday: jest.fn(),
    currentRoll: null,
    daysPlayed: 0,
    error: null,
    isInitializing: false,
    isRerolling: false,
    isRolling: false,
    isSavingMood: false,
    logMoodToday: jest.fn(),
    rerollCurrentTask: jest.fn(),
    rollToday: jest.fn(),
    skipMoodToday: jest.fn(),
  })),
}));

jest.mock('@/hooks/useInAppCampaigns', () => ({
  useInAppCampaigns: jest.fn(() => ({
    bannerCampaign: null,
    dismissBannerCampaign: jest.fn(async () => {}),
    trackBannerClick: jest.fn(async () => {}),
    showOfflineCampaignPlaceholder: false,
  })),
}));

jest.mock('@/hooks/useConnectivityStatus', () => ({
  useConnectivityStatus: jest.fn(() => ({
    isOffline: false,
    isOnline: true,
  })),
}));

function createRepositoryMock(
  initialProfile: LocalOnboardingProfile = {
    notificationChoice: null,
    notificationPermissionStatus: 'undetermined',
    notificationPromptedAt: null,
    onboardingCompletedAt: null,
  }
): OnboardingProfileRepository {
  const readProfile = jest.fn(async () => initialProfile);
  const saveNotificationDecision = jest.fn(
    async (choice: NotificationChoice, permissionStatus: NotificationPermissionStatus) => ({
      notificationChoice: choice,
      notificationPermissionStatus: permissionStatus,
      notificationPromptedAt: '2026-04-10T16:00:00.000Z',
      onboardingCompletedAt: '2026-04-10T16:00:00.000Z',
    })
  );

  return {
    readProfile,
    saveNotificationDecision,
  };
}

describe('OnboardingFlowGate', () => {
  it('falls back from loading state when profile read hangs', async () => {
    const repository: OnboardingProfileRepository = {
      readProfile: jest.fn(async () => new Promise<LocalOnboardingProfile>(() => {})),
      saveNotificationDecision: jest.fn(async (choice: NotificationChoice, permissionStatus: NotificationPermissionStatus) => ({
        notificationChoice: choice,
        notificationPermissionStatus: permissionStatus,
        notificationPromptedAt: '2026-04-10T16:00:00.000Z',
        onboardingCompletedAt: '2026-04-10T16:00:00.000Z',
      })),
    };

    const permissionService: NotificationPermissionService = {
      getCurrentStatus: jest.fn(async () => 'undetermined' as NotificationPermissionStatus),
      requestPermission: jest.fn(async () => 'granted' as NotificationPermissionStatus),
    };

    render(
      <OnboardingFlowGate
        profileRepository={repository}
        permissionService={permissionService}
        profileLoadTimeoutMs={1}
      />
    );

    expect(screen.getByText('Loading your first step...')).toBeTruthy();

    await waitFor(() => {
      expect(screen.getByTestId('notification-step')).toBeTruthy();
    });
  });

  it('reaches the home roll screen within tap budget after not now', async () => {
    const repository = createRepositoryMock();
    const permissionService: NotificationPermissionService = {
      getCurrentStatus: jest.fn(async () => 'undetermined' as NotificationPermissionStatus),
      requestPermission: jest.fn(async () => 'granted' as NotificationPermissionStatus),
    };

    render(
      <OnboardingFlowGate profileRepository={repository} permissionService={permissionService} />
    );

    expect(await screen.findByTestId('notification-step')).toBeTruthy();

    let tapCount = 0;
    fireEvent.press(screen.getByTestId('not-now-button'));
    tapCount += 1;

    await waitFor(() => {
      expect(screen.getByTestId('roll-button')).toBeTruthy();
    });

    expect(tapCount).toBeLessThanOrEqual(MAX_ONBOARDING_TAPS);
  });

  it('reaches the home roll screen within tap budget after allow', async () => {
    const repository = createRepositoryMock();
    const permissionService: NotificationPermissionService = {
      getCurrentStatus: jest.fn(async () => 'undetermined' as NotificationPermissionStatus),
      requestPermission: jest.fn(async () => 'granted' as NotificationPermissionStatus),
    };

    render(
      <OnboardingFlowGate profileRepository={repository} permissionService={permissionService} />
    );

    expect(await screen.findByTestId('notification-step')).toBeTruthy();

    let tapCount = 0;
    fireEvent.press(screen.getByTestId('allow-button'));
    tapCount += 1;

    await waitFor(() => {
      expect(screen.getByTestId('roll-button')).toBeTruthy();
    });

    expect(tapCount).toBeLessThanOrEqual(MAX_ONBOARDING_TAPS);
  });

  it('shows roll controls immediately when onboarding is already complete', async () => {
    const repository = createRepositoryMock({
      notificationChoice: 'allow',
      notificationPermissionStatus: 'granted',
      notificationPromptedAt: '2026-04-10T16:00:00.000Z',
      onboardingCompletedAt: '2026-04-10T16:00:00.000Z',
    });

    const permissionService: NotificationPermissionService = {
      getCurrentStatus: jest.fn(async () => 'undetermined' as NotificationPermissionStatus),
      requestPermission: jest.fn(async () => 'granted' as NotificationPermissionStatus),
    };

    render(
      <OnboardingFlowGate profileRepository={repository} permissionService={permissionService} />
    );

    expect(await screen.findByTestId('roll-button')).toBeTruthy();
    expect(screen.queryByTestId('notification-step')).toBeNull();
  });
});