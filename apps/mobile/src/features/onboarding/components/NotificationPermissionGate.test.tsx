import { describe, expect, it, jest } from '@jest/globals';
import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';

import {
  NotificationPermissionGate,
} from '@/features/onboarding/components/NotificationPermissionGate';
import type {
  LocalOnboardingProfile,
  NotificationChoice,
  NotificationPermissionStatus,
} from '@/db/local-profile-storage';
import type { NotificationPermissionService } from '@/features/notifications/services/NotificationPermissionService';
import type { OnboardingProfileRepository } from '@/features/onboarding/repository/OnboardingProfileRepository';

function createRepositoryMock(): OnboardingProfileRepository {
  const initialProfile: LocalOnboardingProfile = {
    notificationChoice: null,
    notificationPermissionStatus: 'undetermined',
    notificationPromptedAt: null,
    onboardingCompletedAt: null,
  };

  const readProfile = jest.fn(async () => initialProfile);
  const saveNotificationDecision = jest.fn(
    async (choice: NotificationChoice, permissionStatus: NotificationPermissionStatus) => ({
      notificationChoice: choice,
      notificationPermissionStatus: permissionStatus,
      notificationPromptedAt: '2026-04-10T15:30:00.000Z',
      onboardingCompletedAt: '2026-04-10T15:30:00.000Z',
    })
  );

  return {
    readProfile,
    saveNotificationDecision,
  };
}

describe('NotificationPermissionGate', () => {
  it('lets the user skip reminders without blocking entry', async () => {
    const repository = createRepositoryMock();
    const permissionService: NotificationPermissionService = {
      getCurrentStatus: jest.fn(async () => 'undetermined' as NotificationPermissionStatus),
      requestPermission: jest.fn(async () => 'undetermined' as NotificationPermissionStatus),
    };

    render(
      <NotificationPermissionGate
        profileRepository={repository}
        permissionService={permissionService}
      />
    );

    expect(await screen.findByTestId('notification-step')).toBeTruthy();

    fireEvent.press(screen.getByTestId('not-now-button'));

    await waitFor(() => {
      expect(screen.getByTestId('app-entry-card')).toBeTruthy();
    });

    expect(permissionService.getCurrentStatus).toHaveBeenCalledTimes(1);
    expect(repository.saveNotificationDecision).toHaveBeenCalledWith('not-now', 'undetermined');
  });

  it('requests permission and still advances after allow', async () => {
    const repository = createRepositoryMock();
    const permissionService: NotificationPermissionService = {
      getCurrentStatus: jest.fn(async () => 'undetermined' as NotificationPermissionStatus),
      requestPermission: jest.fn(async () => 'granted' as NotificationPermissionStatus),
    };

    render(
      <NotificationPermissionGate
        profileRepository={repository}
        permissionService={permissionService}
      />
    );

    expect(await screen.findByTestId('notification-step')).toBeTruthy();

    fireEvent.press(screen.getByTestId('allow-button'));

    await waitFor(() => {
      expect(screen.getByTestId('app-entry-card')).toBeTruthy();
    });

    expect(permissionService.requestPermission).toHaveBeenCalledTimes(1);
    expect(repository.saveNotificationDecision).toHaveBeenCalledWith('allow', 'granted');
  });

  it('still advances after allow when permission request fails', async () => {
    const repository = createRepositoryMock();
    const permissionService: NotificationPermissionService = {
      getCurrentStatus: jest.fn(async () => 'undetermined' as NotificationPermissionStatus),
      requestPermission: jest.fn(async () => {
        throw new Error('permission unavailable');
      }),
    };

    render(
      <NotificationPermissionGate
        profileRepository={repository}
        permissionService={permissionService}
      />
    );

    expect(await screen.findByTestId('notification-step')).toBeTruthy();

    fireEvent.press(screen.getByTestId('allow-button'));

    await waitFor(() => {
      expect(screen.getByTestId('app-entry-card')).toBeTruthy();
    });

    expect(permissionService.requestPermission).toHaveBeenCalledTimes(1);
    expect(repository.saveNotificationDecision).toHaveBeenCalledWith('allow', 'undetermined');
  });

  it('still advances when profile persistence fails', async () => {
    const repository = createRepositoryMock();
    repository.saveNotificationDecision = jest.fn(async () => {
      throw new Error('write failed');
    });

    const permissionService: NotificationPermissionService = {
      getCurrentStatus: jest.fn(async () => 'undetermined' as NotificationPermissionStatus),
      requestPermission: jest.fn(async () => 'granted' as NotificationPermissionStatus),
    };

    render(
      <NotificationPermissionGate
        profileRepository={repository}
        permissionService={permissionService}
      />
    );

    expect(await screen.findByTestId('notification-step')).toBeTruthy();

    fireEvent.press(screen.getByTestId('not-now-button'));

    await waitFor(() => {
      expect(screen.getByTestId('app-entry-card')).toBeTruthy();
    });

    expect(permissionService.getCurrentStatus).toHaveBeenCalledTimes(1);
    expect(repository.saveNotificationDecision).toHaveBeenCalledWith('not-now', 'undetermined');
  });
});
