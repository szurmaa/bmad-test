import { useEffect, useState } from 'react';
import useDailyRollStore from '@/store/dailyRollStore';
import { getActiveTasks, getTodayRoll, createDailyRoll, seedTaskLibrary, getDaysPlayed } from '@/db/schema';
import { SEED_TASKS } from '@/types/task';
import { v4 as uuidv4 } from 'uuid';

/**
 * Hook to manage daily roll initialization
 * - Seeds task library on first launch
 * - Initializes today's roll if not already done
 * - Syncs days played count
 */
export const useDailyRollInit = () => {
  const [isInitializing, setIsInitializing] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { currentRoll, initializeToday, loadFromStorage, daysPlayed } = useDailyRollStore();

  useEffect(() => {
    const initialize = async () => {
      try {
        setIsInitializing(true);
        setError(null);

        // First, rehydrate Zustand store from AsyncStorage
        await loadFromStorage();

        // Seed the task library (if not already done, the insert will ignore)
        await seedTaskLibrary(SEED_TASKS);

        // Check if already rolled today
        const todayRoll = await getTodayRoll();

        if (todayRoll) {
          // Already rolled today - load it into the store
          // Note: Zustand's persist middleware should handle this on rehydration
          return;
        }

        // New day - create a new roll
        const activeTasks = await getActiveTasks();

        if (activeTasks.length === 0) {
          throw new Error('No active tasks available');
        }

        // Initialize with tasks
        initializeToday(
          activeTasks.map((task) => ({
            id: task.id,
            category: task.category,
            title: task.title,
            description: task.description,
          }))
        );

        // Persist the roll to database
        const store = useDailyRollStore.getState();
        if (store.currentRoll) {
          await createDailyRoll({
            id: store.currentRoll.id,
            date: store.currentRoll.date,
            taskId: store.currentRoll.taskId,
            taskCategory: store.currentRoll.taskCategory,
            taskTitle: store.currentRoll.taskTitle,
            taskDescription: store.currentRoll.taskDescription,
            createdAt: store.currentRoll.createdAt,
          });
        }

        // Get updated days played count
        const daysPlayedCount = await getDaysPlayed();
        console.log(`Days played: ${daysPlayedCount}`);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown initialization error';
        console.error('Daily roll initialization error:', errorMessage);
        setError(errorMessage);
      } finally {
        setIsInitializing(false);
      }
    };

    initialize();
  }, []);

  return {
    isInitializing,
    error,
    currentRoll,
    daysPlayed,
  };
};

export default useDailyRollInit;
