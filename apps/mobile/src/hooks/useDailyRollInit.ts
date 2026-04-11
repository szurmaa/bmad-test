import { useEffect, useState } from 'react';

import useDailyRollStore from '@/store/dailyRollStore';
import {
  createDailyRoll,
  getDaysPlayed,
  getRandomActiveTask,
  getTodayRoll,
  markRollComplete,
  rerollDailyTask,
  seedTaskLibrary,
} from '@/db/schema';
import { SEED_TASKS } from '@/types/task';

/**
 * Hook to manage daily roll initialization
 * - Seeds task library on first launch
 * - Initializes today's roll if not already done
 * - Syncs days played count
 */
export const useDailyRollInit = () => {
  const [isInitializing, setIsInitializing] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRolling, setIsRolling] = useState(false);
  const [isRerolling, setIsRerolling] = useState(false);

  const {
    completeRoll,
    currentRoll,
    daysPlayed,
    hydrateFromDatabase,
    initializeToday,
    loadFromStorage,
    resetForNewDay,
    rerollToday,
    setError: setStoreError,
  } = useDailyRollStore();

  useEffect(() => {
    const initialize = async () => {
      try {
        setIsInitializing(true);
        setError(null);

        // First, rehydrate Zustand store from AsyncStorage
        await loadFromStorage();

        // Seed the task library (if not already done, the insert will ignore)
        await seedTaskLibrary(SEED_TASKS);

        const daysPlayedCount = await getDaysPlayed();
        const todayRoll = await getTodayRoll();

        if (todayRoll) {
          hydrateFromDatabase({
            currentRoll: {
              id: todayRoll.id,
              date: todayRoll.date,
              taskId: todayRoll.task_id,
              taskCategory: todayRoll.task_category as 'Mind' | 'Body' | 'Life' | 'Work',
              taskTitle: todayRoll.task_title,
              taskDescription: todayRoll.task_description,
              completed: Boolean(todayRoll.completed),
              completedAt: todayRoll.completed_at ?? undefined,
              rerollUsed: Boolean(todayRoll.reroll_used),
              moodLogged: false,
              createdAt: todayRoll.created_at,
              syncedToFirebase: Boolean(todayRoll.synced_to_firebase),
            },
            daysPlayed: daysPlayedCount,
          });
        } else {
          resetForNewDay();
          hydrateFromDatabase({ currentRoll: null, daysPlayed: daysPlayedCount });
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown initialization error';
        setError(errorMessage);
        setStoreError(errorMessage);
      } finally {
        setIsInitializing(false);
      }
    };

    initialize();
  }, []);

  const rollToday = async () => {
    if (currentRoll || isRolling) {
      return;
    }

    try {
      setIsRolling(true);
      setError(null);
      setStoreError(null);

      const task = await getRandomActiveTask();

      if (!task) {
        throw new Error('No active tasks available');
      }

      initializeToday([
        {
          id: task.id,
          category: task.category,
          title: task.title,
          description: task.description,
        },
      ]);

      const nextRoll = useDailyRollStore.getState().currentRoll;
      if (!nextRoll) {
        throw new Error('Unable to create today\'s roll');
      }

      await createDailyRoll({
        id: nextRoll.id,
        date: nextRoll.date,
        taskId: nextRoll.taskId,
        taskCategory: nextRoll.taskCategory,
        taskTitle: nextRoll.taskTitle,
        taskDescription: nextRoll.taskDescription,
        createdAt: nextRoll.createdAt,
      });

      const daysPlayedCount = await getDaysPlayed();
      hydrateFromDatabase({ currentRoll: nextRoll, daysPlayed: daysPlayedCount });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Roll failed';
      setError(errorMessage);
      setStoreError(errorMessage);
    } finally {
      setIsRolling(false);
    }
  };

  const completeToday = async () => {
    if (!currentRoll || currentRoll.completed) {
      return;
    }

    try {
      await markRollComplete(currentRoll.id);
      completeRoll();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unable to save completion';
      setError(errorMessage);
      setStoreError(errorMessage);
    }
  };

  const rerollCurrentTask = async () => {
    if (!currentRoll || currentRoll.rerollUsed || currentRoll.completed || isRerolling) {
      return;
    }

    try {
      setIsRerolling(true);
      setError(null);
      setStoreError(null);

      const nextTask = await getRandomActiveTask(currentRoll.taskId);

      if (!nextTask) {
        throw new Error('No alternate task is available right now');
      }

      await rerollDailyTask(currentRoll.id, {
        id: nextTask.id,
        category: nextTask.category,
        title: nextTask.title,
        description: nextTask.description,
      });

      rerollToday({
        id: nextTask.id,
        category: nextTask.category,
        title: nextTask.title,
        description: nextTask.description,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Reroll failed';
      setError(errorMessage);
      setStoreError(errorMessage);
    } finally {
      setIsRerolling(false);
    }
  };

  return {
    completeToday,
    isInitializing,
    isRolling,
    isRerolling,
    error,
    currentRoll,
    daysPlayed,
    rerollCurrentTask,
    rollToday,
  };
};

export default useDailyRollInit;
