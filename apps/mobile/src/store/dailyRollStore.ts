import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { format } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';

/**
 * Daily Roll State Management
 * Tracks the daily roll, reroll availability, and mood log status
 */

export interface DailyRoll {
  id: string;
  date: string; // ISO date string
  taskId: string;
  taskCategory: 'Mind' | 'Body' | 'Life' | 'Work';
  taskTitle: string;
  taskDescription: string;
  completed: boolean;
  completedAt?: string; // ISO timestamp
  rerollUsed: boolean;
  moodLogged: boolean;
  moodValue?: number; // 1-5 scale
  createdAt: string; // ISO timestamp
  syncedToFirebase: boolean;
}

export interface DailyRollStore {
  currentRoll: DailyRoll | null;
  daysPlayed: number;
  isLoading: boolean;
  error: string | null;

  // Actions
  initializeToday: (tasks: Array<{ id: string; category: string; title: string; description: string }>) => void;
  completeRoll: () => void;
  rerollToday: (newTask: { id: string; category: string; title: string; description: string }) => void;
  logMood: (moodValue: number) => void;
  markSyncedToFirebase: () => void;
  resetForNewDay: () => void;
  hydrateFromDatabase: (payload: { currentRoll: DailyRoll | null; daysPlayed: number }) => void;
  setError: (error: string | null) => void;
  loadFromStorage: () => Promise<void>;
}

/**
 * Check if a new day has started (midnight UTC or local)
 */
const isNewDay = (lastRollDate: string | null): boolean => {
  if (!lastRollDate) return true;

  const lastDateString = format(new Date(lastRollDate), 'yyyy-MM-dd');
  const todayString = format(new Date(), 'yyyy-MM-dd');

  return lastDateString !== todayString;
};

export const useDailyRollStore = create<DailyRollStore>()(
  persist(
    (set, get) => ({
      currentRoll: null,
      daysPlayed: 0,
      isLoading: false,
      error: null,

      initializeToday: (tasks) => {
        const state = get();

        // If already rolled today, don't create a new roll
        if (state.currentRoll && !isNewDay(state.currentRoll.date)) {
          return;
        }

        // If new day, increment days played and create new roll
        if (isNewDay(state.currentRoll?.date ?? null)) {
          const randomTask = tasks[Math.floor(Math.random() * tasks.length)];
          const today = format(new Date(), 'yyyy-MM-dd');

          const newRoll: DailyRoll = {
            id: uuidv4(),
            date: today,
            taskId: randomTask.id,
            taskCategory: randomTask.category as 'Mind' | 'Body' | 'Life' | 'Work',
            taskTitle: randomTask.title,
            taskDescription: randomTask.description,
            completed: false,
            rerollUsed: false,
            moodLogged: false,
            createdAt: new Date().toISOString(),
            syncedToFirebase: false,
          };

          set({
            currentRoll: newRoll,
            daysPlayed: state.daysPlayed + 1,
            error: null,
          });
        }
      },

      completeRoll: () => {
        set((state) => {
          if (!state.currentRoll) return state;

          return {
            currentRoll: {
              ...state.currentRoll,
              completed: true,
              completedAt: new Date().toISOString(),
            },
          };
        });
      },

      rerollToday: (newTask) => {
        set((state) => {
          if (!state.currentRoll || state.currentRoll.rerollUsed) {
            return state;
          }

          return {
            currentRoll: {
              ...state.currentRoll,
              taskId: newTask.id,
              taskCategory: newTask.category as 'Mind' | 'Body' | 'Life' | 'Work',
              taskTitle: newTask.title,
              taskDescription: newTask.description,
              completed: false,
              rerollUsed: true,
            },
          };
        });
      },

      logMood: (moodValue) => {
        set((state) => {
          if (!state.currentRoll) return state;

          if (moodValue < 1 || moodValue > 5) {
            return {
              ...state,
              error: 'Mood value must be between 1 and 5',
            };
          }

          return {
            currentRoll: {
              ...state.currentRoll,
              moodLogged: true,
              moodValue,
            },
            error: null,
          };
        });
      },

      markSyncedToFirebase: () => {
        set((state) => {
          if (!state.currentRoll) return state;

          return {
            currentRoll: {
              ...state.currentRoll,
              syncedToFirebase: true,
            },
          };
        });
      },

      resetForNewDay: () => {
        set({
          currentRoll: null,
          isLoading: false,
          error: null,
        });
      },

      hydrateFromDatabase: ({ currentRoll, daysPlayed }) => {
        set({
          currentRoll,
          daysPlayed,
          isLoading: false,
          error: null,
        });
      },

      setError: (error) => {
        set({ error });
      },

      loadFromStorage: async () => {
        // This is called by Zustand's persist middleware on rehydration
        // Additional async initialization can happen here if needed
      },
    }),
    {
      name: 'daily-roll-store',
      storage: {
        getItem: async (name) => {
          const item = await AsyncStorage.getItem(name);
          return item ? JSON.parse(item) : null;
        },
        setItem: async (name, value) => {
          await AsyncStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: async (name) => {
          await AsyncStorage.removeItem(name);
        },
      },
    }
  )
);

export default useDailyRollStore;
