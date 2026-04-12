/**
 * Development utility to clear all local storage
 * Use this to reset app state between testing sessions
 */

const STORAGE_KEYS = [
  'habit-dice.onboarding-profile',
  'habit-dice.reminder-preference',
  'habit-dice.user-preferences',
  'habit-dice.local-profile-id',
];

export async function clearAllLocalStorage(): Promise<void> {
  STORAGE_KEYS.forEach(key => {
    try {
      globalThis.localStorage.removeItem(key);
    } catch (error) {
      console.warn(`Failed to clear storage key "${key}":`, error);
    }
  });
  
  console.log('✓ Cleared all Habit Dice local storage');
}

export async function clearSpecificStorage(key: string): Promise<void> {
  try {
    globalThis.localStorage.removeItem(key);
    console.log(`✓ Cleared storage key: ${key}`);
  } catch (error) {
    console.warn(`Failed to clear storage key "${key}":`, error);
  }
}

export function logStorageState(): void {
  console.log('Current local storage state:');
  STORAGE_KEYS.forEach(key => {
    const value = globalThis.localStorage.getItem(key);
    console.log(`  ${key}:`, value ? JSON.parse(value) : '(empty)');
  });
}
