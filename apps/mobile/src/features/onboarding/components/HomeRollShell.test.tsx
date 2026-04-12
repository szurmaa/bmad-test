import { describe, expect, it, jest } from '@jest/globals';
import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react-native';

import { HomeRollShell } from '@/features/onboarding/components/HomeRollShell';

jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

jest.mock('@/hooks/useDailyRollInit', () => ({
  useDailyRollInit: jest.fn(),
}));

jest.mock('@/hooks/useInAppCampaigns', () => ({
  useInAppCampaigns: jest.fn(() => ({
    isOffline: false,
    showOfflineCampaignPlaceholder: false,
    bannerCampaign: null,
    dismissBannerCampaign: jest.fn(async () => {}),
    trackBannerClick: jest.fn(async () => {}),
  })),
}));

jest.mock('@/hooks/useConnectivityStatus', () => ({
  useConnectivityStatus: jest.fn(() => ({
    isOffline: false,
    isOnline: true,
  })),
}));

const mockedModule = jest.requireMock('@/hooks/useDailyRollInit') as {
  useDailyRollInit: jest.Mock;
};
const mockUseDailyRollInit = mockedModule.useDailyRollInit;

describe('HomeRollShell', () => {
  it('shows the dice roll state before a task is created', () => {
    const rollToday = jest.fn();

    mockUseDailyRollInit.mockReturnValue({
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
      rollToday,
      skipMoodToday: jest.fn(),
    });

    render(<HomeRollShell />);

    fireEvent.press(screen.getByTestId('roll-button'));

    expect(rollToday).toHaveBeenCalledTimes(1);
    expect(screen.queryByTestId('task-reveal-card')).toBeNull();
    expect(screen.getByTestId('days-played-counter')).toBeTruthy();
    expect(screen.getByText('Your first roll starts the count.')).toBeTruthy();
  });

  it('shows the revealed task and completion action after rolling', () => {
    const completeToday = jest.fn();
    const rerollCurrentTask = jest.fn();

    mockUseDailyRollInit.mockReturnValue({
      completeToday,
      currentRoll: {
        id: 'roll-1',
        date: '2026-04-11',
        taskId: 'task_body_001',
        taskCategory: 'Body',
        taskTitle: 'Drink water',
        taskDescription: 'Drink one full glass of water',
        completed: false,
        rerollUsed: false,
        moodLogged: false,
        createdAt: '2026-04-11T10:00:00.000Z',
        syncedToFirebase: false,
      },
      daysPlayed: 3,
      error: null,
      isInitializing: false,
      isRerolling: false,
      isRolling: false,
      isSavingMood: false,
      logMoodToday: jest.fn(),
      rerollCurrentTask,
      rollToday: jest.fn(),
      skipMoodToday: jest.fn(),
    });

    render(<HomeRollShell />);

    expect(screen.getByTestId('task-reveal-card')).toBeTruthy();
    expect(screen.getByText('Drink water')).toBeTruthy();
    expect(screen.getByText("You've shown up 3 times.")).toBeTruthy();

    fireEvent.press(screen.getByTestId('complete-button'));
    expect(completeToday).toHaveBeenCalledTimes(1);

    fireEvent.press(screen.getByTestId('reroll-button'));
    expect(rerollCurrentTask).toHaveBeenCalledTimes(1);
  });

  it('shows neutral reroll messaging after the reroll has been used', () => {
    mockUseDailyRollInit.mockReturnValue({
      completeToday: jest.fn(),
      currentRoll: {
        id: 'roll-1',
        date: '2026-04-11',
        taskId: 'task_body_002',
        taskCategory: 'Body',
        taskTitle: '5-minute walk',
        taskDescription: 'Take a 5-minute walk outside or around your home',
        completed: false,
        rerollUsed: true,
        moodLogged: false,
        createdAt: '2026-04-11T10:00:00.000Z',
        syncedToFirebase: false,
      },
      daysPlayed: 3,
      error: null,
      isInitializing: false,
      isRerolling: false,
      isRolling: false,
      isSavingMood: false,
      logMoodToday: jest.fn(),
      rerollCurrentTask: jest.fn(),
      rollToday: jest.fn(),
      skipMoodToday: jest.fn(),
    });

    render(<HomeRollShell />);

    expect(screen.getAllByText('Reroll used today')).toHaveLength(2);
    expect(screen.getByText('Ready again tomorrow.')).toBeTruthy();
    expect(screen.queryByText(/streak/i)).toBeNull();
  });

  it('shows mood prompt after task is completed and mood not yet logged', () => {
    jest.useFakeTimers();
    const logMoodToday = jest.fn();
    const skipMoodToday = jest.fn();

    mockUseDailyRollInit.mockReturnValue({
      completeToday: jest.fn(),
      currentRoll: {
        id: 'roll-1',
        date: '2026-04-11',
        taskId: 'task_body_001',
        taskCategory: 'Body',
        taskTitle: 'Drink water',
        taskDescription: 'Drink one full glass of water',
        completed: true,
        rerollUsed: false,
        moodLogged: false,
        createdAt: '2026-04-11T10:00:00.000Z',
        syncedToFirebase: false,
      },
      daysPlayed: 3,
      error: null,
      isInitializing: false,
      isRerolling: false,
      isRolling: false,
      isSavingMood: false,
      logMoodToday,
      rerollCurrentTask: jest.fn(),
      rollToday: jest.fn(),
      skipMoodToday,
    });

    render(<HomeRollShell />);
    // Advance past the 1400ms completion moment so mood prompt becomes visible
    act(() => { jest.advanceTimersByTime(1500); });

    expect(screen.getByTestId('mood-prompt')).toBeTruthy();
    expect(screen.getByText('How are you feeling?')).toBeTruthy();
    expect(screen.getByTestId('mood-skip-button')).toBeTruthy();
    expect(screen.getByTestId('mood-option-3')).toBeTruthy();

    fireEvent.press(screen.getByTestId('mood-skip-button'));
    expect(skipMoodToday).toHaveBeenCalledTimes(1);
    jest.useRealTimers();
  });

  it('does not replay completion moment on initial load with a completed roll', () => {
    mockUseDailyRollInit.mockReturnValue({
      completeToday: jest.fn(),
      currentRoll: {
        id: 'roll-1',
        date: '2026-04-11',
        taskId: 'task_body_001',
        taskCategory: 'Body',
        taskTitle: 'Drink water',
        taskDescription: 'Drink one full glass of water',
        completed: true,
        rerollUsed: false,
        moodLogged: false,
        createdAt: '2026-04-11T10:00:00.000Z',
        syncedToFirebase: false,
      },
      daysPlayed: 3,
      error: null,
      isInitializing: false,
      isRerolling: false,
      isRolling: false,
      isSavingMood: false,
      logMoodToday: jest.fn(),
      rerollCurrentTask: jest.fn(),
      rollToday: jest.fn(),
      skipMoodToday: jest.fn(),
    });

    render(<HomeRollShell />);

    expect(screen.queryByTestId('completion-moment')).toBeNull();
    expect(screen.getByTestId('mood-prompt')).toBeTruthy();
  });

  it('does not show mood prompt when mood already logged', () => {
    jest.useFakeTimers();
    mockUseDailyRollInit.mockReturnValue({
      completeToday: jest.fn(),
      currentRoll: {
        id: 'roll-1',
        date: '2026-04-11',
        taskId: 'task_body_001',
        taskCategory: 'Body',
        taskTitle: 'Drink water',
        taskDescription: 'Drink one full glass of water',
        completed: true,
        rerollUsed: false,
        moodLogged: true,
        moodValue: 4,
        createdAt: '2026-04-11T10:00:00.000Z',
        syncedToFirebase: false,
      },
      daysPlayed: 3,
      error: null,
      isInitializing: false,
      isRerolling: false,
      isRolling: false,
      isSavingMood: false,
      logMoodToday: jest.fn(),
      rerollCurrentTask: jest.fn(),
      rollToday: jest.fn(),
      skipMoodToday: jest.fn(),
    });

    render(<HomeRollShell />);
    act(() => { jest.advanceTimersByTime(1500); });

    expect(screen.queryByTestId('mood-prompt')).toBeNull();
    jest.useRealTimers();
  });

  it('calls logMoodToday when a mood option is selected', () => {
    jest.useFakeTimers();
    const logMoodToday = jest.fn();

    mockUseDailyRollInit.mockReturnValue({
      completeToday: jest.fn(),
      currentRoll: {
        id: 'roll-1',
        date: '2026-04-11',
        taskId: 'task_body_001',
        taskCategory: 'Body',
        taskTitle: 'Drink water',
        taskDescription: 'Drink one full glass of water',
        completed: true,
        rerollUsed: false,
        moodLogged: false,
        createdAt: '2026-04-11T10:00:00.000Z',
        syncedToFirebase: false,
      },
      daysPlayed: 3,
      error: null,
      isInitializing: false,
      isRerolling: false,
      isRolling: false,
      isSavingMood: false,
      logMoodToday,
      rerollCurrentTask: jest.fn(),
      rollToday: jest.fn(),
      skipMoodToday: jest.fn(),
    });

    render(<HomeRollShell />);
    act(() => { jest.advanceTimersByTime(1500); });

    fireEvent.press(screen.getByTestId('mood-option-5'));
    expect(logMoodToday).toHaveBeenCalledWith(5);
    jest.useRealTimers();
  });
});
