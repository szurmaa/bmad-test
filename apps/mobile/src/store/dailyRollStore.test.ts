import { beforeEach, describe, expect, it } from '@jest/globals';

import { useDailyRollStore } from '@/store/dailyRollStore';

describe('dailyRollStore', () => {
  beforeEach(() => {
    useDailyRollStore.setState({
      currentRoll: null,
      daysPlayed: 0,
      isLoading: false,
      error: null,
    });
  });

  it('creates one roll and increments days played only when initialized', () => {
    useDailyRollStore.getState().initializeToday([
      {
        id: 'task-1',
        category: 'Mind',
        title: 'Journal one thought',
        description: 'Write one sentence.',
      },
    ]);

    const firstState = useDailyRollStore.getState();

    expect(firstState.currentRoll?.taskId).toBe('task-1');
    expect(firstState.daysPlayed).toBe(1);

    useDailyRollStore.getState().initializeToday([
      {
        id: 'task-2',
        category: 'Body',
        title: 'Drink water',
        description: 'Drink one glass.',
      },
    ]);

    const secondState = useDailyRollStore.getState();

    expect(secondState.currentRoll?.taskId).toBe('task-1');
    expect(secondState.daysPlayed).toBe(1);
  });

  it('marks an active roll as completed', () => {
    useDailyRollStore.setState({
      currentRoll: {
        id: 'roll-1',
        date: '2026-04-11',
        taskId: 'task-1',
        taskCategory: 'Mind',
        taskTitle: 'Journal one thought',
        taskDescription: 'Write one sentence.',
        completed: false,
        rerollUsed: false,
        moodLogged: false,
        createdAt: '2026-04-11T10:00:00.000Z',
        syncedToFirebase: false,
      },
    });

    useDailyRollStore.getState().completeRoll();

    const state = useDailyRollStore.getState();

    expect(state.currentRoll?.completed).toBe(true);
    expect(state.currentRoll?.completedAt).toBeTruthy();
  });

  it('allows exactly one reroll for the current day', () => {
    useDailyRollStore.setState({
      currentRoll: {
        id: 'roll-1',
        date: '2026-04-11',
        taskId: 'task-1',
        taskCategory: 'Mind',
        taskTitle: 'Journal one thought',
        taskDescription: 'Write one sentence.',
        completed: false,
        rerollUsed: false,
        moodLogged: false,
        createdAt: '2026-04-11T10:00:00.000Z',
        syncedToFirebase: false,
      },
    });

    useDailyRollStore.getState().rerollToday({
      id: 'task-2',
      category: 'Body',
      title: 'Drink water',
      description: 'Drink one glass.',
    });

    const firstReroll = useDailyRollStore.getState();

    expect(firstReroll.currentRoll?.taskId).toBe('task-2');
    expect(firstReroll.currentRoll?.rerollUsed).toBe(true);

    useDailyRollStore.getState().rerollToday({
      id: 'task-3',
      category: 'Life',
      title: 'Make your bed',
      description: 'Make your bed neatly.',
    });

    const secondReroll = useDailyRollStore.getState();

    expect(secondReroll.currentRoll?.taskId).toBe('task-2');
    expect(secondReroll.currentRoll?.rerollUsed).toBe(true);
  });
});