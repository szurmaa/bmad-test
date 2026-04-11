import { describe, expect, it, jest } from '@jest/globals';
import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react-native';

import { HomeRollShell } from '@/features/onboarding/components/HomeRollShell';

jest.mock('@/hooks/useDailyRollInit', () => ({
  useDailyRollInit: jest.fn(),
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
      rerollCurrentTask: jest.fn(),
      rollToday,
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
      rerollCurrentTask,
      rollToday: jest.fn(),
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
      rerollCurrentTask: jest.fn(),
      rollToday: jest.fn(),
    });

    render(<HomeRollShell />);

    expect(screen.getAllByText('Reroll used today')).toHaveLength(2);
    expect(screen.getByText('Ready again tomorrow.')).toBeTruthy();
    expect(screen.queryByText(/streak/i)).toBeNull();
  });
});