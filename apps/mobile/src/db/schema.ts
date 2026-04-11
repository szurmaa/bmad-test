import * as SQLite from 'expo-sqlite';
import { format } from 'date-fns';

/**
 * Database schema and initialization for Habit Dice
 * Stores daily rolls, task completions, mood logs, and synced state
 */

const DB_NAME = 'habit_dice.db';
const SCHEMA_VERSION = 1;

export interface DatabaseTables {
  'daily_rolls': {
    id: string;
    date: string;
    task_id: string;
    task_category: string;
    task_title: string;
    task_description: string;
    completed: boolean;
    completed_at: string | null;
    reroll_used: boolean;
    created_at: string;
    synced_to_firebase: boolean;
  };
  'task_completions': {
    id: string;
    daily_roll_id: string;
    completed_at: string;
    synced_to_firebase: boolean;
  };
  'mood_logs': {
    id: string;
    daily_roll_id: string;
    mood_value: number; // 1-5
    created_at: string;
    synced_to_firebase: boolean;
  };
  'task_library': {
    id: string;
    category: string; // Mind, Body, Life, Work
    title: string;
    description: string;
    effort_level: string; // quick, medium, involved
    is_active: boolean;
    created_at: string;
    last_selected_at: string | null;
  };
  'sync_queue': {
    id: string;
    action: string; // 'roll_created', 'roll_completed', 'mood_logged'
    payload: string; // JSON
    created_at: string;
    synced_at: string | null;
    retry_count: number;
  };
}

let db: SQLite.SQLiteDatabase | null = null;

/**
 * Get or initialize database connection
 */
export const getDatabase = async (): Promise<SQLite.SQLiteDatabase> => {
  if (db) {
    return db;
  }

  db = await SQLite.openDatabaseAsync(DB_NAME);
  await initializeSchema();
  return db;
};

/**
 * Initialize database schema
 */
const initializeSchema = async () => {
  if (!db) throw new Error('Database not initialized');

  // Create daily_rolls table
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS daily_rolls (
      id TEXT PRIMARY KEY,
      date TEXT NOT NULL UNIQUE,
      task_id TEXT NOT NULL,
      task_category TEXT NOT NULL,
      task_title TEXT NOT NULL,
      task_description TEXT NOT NULL,
      completed INTEGER DEFAULT 0,
      completed_at TEXT,
      reroll_used INTEGER DEFAULT 0,
      created_at TEXT NOT NULL,
      synced_to_firebase INTEGER DEFAULT 0
    );
  `);

  // Create task_completions table
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS task_completions (
      id TEXT PRIMARY KEY,
      daily_roll_id TEXT NOT NULL,
      completed_at TEXT NOT NULL,
      synced_to_firebase INTEGER DEFAULT 0,
      FOREIGN KEY(daily_roll_id) REFERENCES daily_rolls(id)
    );
  `);

  // Create mood_logs table
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS mood_logs (
      id TEXT PRIMARY KEY,
      daily_roll_id TEXT NOT NULL,
      mood_value INTEGER NOT NULL CHECK(mood_value >= 1 AND mood_value <= 5),
      created_at TEXT NOT NULL,
      synced_to_firebase INTEGER DEFAULT 0,
      FOREIGN KEY(daily_roll_id) REFERENCES daily_rolls(id)
    );
  `);

  // Create task_library table
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS task_library (
      id TEXT PRIMARY KEY,
      category TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      effort_level TEXT DEFAULT 'quick',
      is_active INTEGER DEFAULT 1,
      created_at TEXT NOT NULL,
      last_selected_at TEXT
    );
  `);

  // Create sync_queue table
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS sync_queue (
      id TEXT PRIMARY KEY,
      action TEXT NOT NULL,
      payload TEXT NOT NULL,
      created_at TEXT NOT NULL,
      synced_at TEXT,
      retry_count INTEGER DEFAULT 0
    );
  `);

  // Create indexes for performance
  await db.execAsync(`
    CREATE INDEX IF NOT EXISTS idx_daily_rolls_date ON daily_rolls(date);
    CREATE INDEX IF NOT EXISTS idx_daily_rolls_synced ON daily_rolls(synced_to_firebase);
    CREATE INDEX IF NOT EXISTS idx_mood_logs_roll_id ON mood_logs(daily_roll_id);
    CREATE INDEX IF NOT EXISTS idx_task_library_active ON task_library(is_active);
    CREATE INDEX IF NOT EXISTS idx_sync_queue_synced ON sync_queue(synced_at);
  `);
};

/**
 * Insert a daily roll
 */
export const createDailyRoll = async (roll: {
  id: string;
  date: string;
  taskId: string;
  taskCategory: string;
  taskTitle: string;
  taskDescription: string;
  createdAt: string;
}) => {
  const database = await getDatabase();
  await database.runAsync(
    `INSERT INTO daily_rolls 
      (id, date, task_id, task_category, task_title, task_description, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [roll.id, roll.date, roll.taskId, roll.taskCategory, roll.taskTitle, roll.taskDescription, roll.createdAt]
  );
};

/**
 * Get today's roll
 */
export const getTodayRoll = async () => {
  const database = await getDatabase();
  const today = format(new Date(), 'yyyy-MM-dd');

  const result = await database.getFirstAsync(
    `SELECT * FROM daily_rolls WHERE date = ?`,
    [today]
  );

  return result as DatabaseTables['daily_rolls'] | null;
};

/**
 * Mark roll as completed
 */
export const markRollComplete = async (rollId: string) => {
  const database = await getDatabase();
  await database.runAsync(
    `UPDATE daily_rolls 
     SET completed = 1, completed_at = ?
     WHERE id = ?`,
    [new Date().toISOString(), rollId]
  );
};

/**
 * Mark reroll as used
 */
export const markRerollUsed = async (rollId: string) => {
  const database = await getDatabase();
  await database.runAsync(
    `UPDATE daily_rolls 
     SET reroll_used = 1
     WHERE id = ?`,
    [rollId]
  );
};

export const rerollDailyTask = async (rollId: string, task: {
  id: string;
  category: string;
  title: string;
  description: string;
}) => {
  const database = await getDatabase();
  await database.runAsync(
    `UPDATE daily_rolls
     SET task_id = ?, task_category = ?, task_title = ?, task_description = ?, reroll_used = 1, completed = 0, completed_at = NULL
     WHERE id = ?`,
    [task.id, task.category, task.title, task.description, rollId]
  );
};

/**
 * Log mood for a roll
 */
export const logMood = async (moodLogId: string, rollId: string, moodValue: number) => {
  const database = await getDatabase();
  await database.runAsync(
    `INSERT INTO mood_logs (id, daily_roll_id, mood_value, created_at)
     VALUES (?, ?, ?, ?)`,
    [moodLogId, rollId, moodValue, new Date().toISOString()]
  );
};

/**
 * Get all active tasks from library
 */
export const getActiveTasks = async (): Promise<any[]> => {
  const database = await getDatabase();
  const result = await database.getAllAsync<DatabaseTables['task_library']>(
    `SELECT * FROM task_library WHERE is_active = 1 ORDER BY RANDOM()`
  );

  return (result || []).map((row) => ({
    id: row.id,
    category: row.category,
    title: row.title,
    description: row.description,
    effortLevel: row.effort_level,
  }));
};

export const getRandomActiveTask = async (excludeTaskId?: string) => {
  const database = await getDatabase();
  const params = excludeTaskId ? [excludeTaskId] : [];
  const query = excludeTaskId
    ? `SELECT * FROM task_library WHERE is_active = 1 AND id != ? ORDER BY RANDOM() LIMIT 1`
    : `SELECT * FROM task_library WHERE is_active = 1 ORDER BY RANDOM() LIMIT 1`;

  const row = await database.getFirstAsync<DatabaseTables['task_library']>(query, params);

  if (!row) {
    return null;
  }

  return {
    id: row.id,
    category: row.category,
    title: row.title,
    description: row.description,
    effortLevel: row.effort_level,
  };
};

/**
 * Insert seed tasks into library (called on first app launch)
 */
export const seedTaskLibrary = async (tasks: readonly any[]) => {
  const database = await getDatabase();

  for (const task of tasks) {
    await database.runAsync(
      `INSERT OR IGNORE INTO task_library 
        (id, category, title, description, effort_level, created_at, is_active)
       VALUES (?, ?, ?, ?, ?, ?, 1)`,
      [task.id, task.category, task.title, task.description, task.effortLevel || 'quick', new Date().toISOString()]
    );
  }
};

/**
 * Queue an action for Firebase sync
 */
export const queueForSync = async (action: string, payload: object) => {
  const database = await getDatabase();
  const id = `sync_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  await database.runAsync(
    `INSERT INTO sync_queue (id, action, payload, created_at, retry_count)
     VALUES (?, ?, ?, ?, 0)`,
    [id, action, JSON.stringify(payload), new Date().toISOString()]
  );
};

/**
 * Get pending sync items
 */
export const getPendingSyncItems = async () => {
  const database = await getDatabase();
  const result = await database.getAllAsync(
    `SELECT * FROM sync_queue WHERE synced_at IS NULL ORDER BY created_at ASC LIMIT 50`
  );

  return result as DatabaseTables['sync_queue'][] | null;
};

/**
 * Mark sync item as synced
 */
export const markSynced = async (syncId: string) => {
  const database = await getDatabase();
  await database.runAsync(
    `UPDATE sync_queue SET synced_at = ? WHERE id = ?`,
    [new Date().toISOString(), syncId]
  );
};

/**
 * Get days played count (count distinct dates with rolls)
 */
export const getDaysPlayed = async (): Promise<number> => {
  const database = await getDatabase();
  const result = await database.getFirstAsync<{ count: number }>(
    `SELECT COUNT(DISTINCT date) as count FROM daily_rolls`
  );

  return result?.count || 0;
};

/**
 * Get mood log for a specific roll (null if none logged yet)
 */
export const getMoodLogForRoll = async (rollId: string): Promise<{ mood_value: number } | null> => {
  const database = await getDatabase();
  const result = await database.getFirstAsync<{ mood_value: number }>(
    `SELECT mood_value FROM mood_logs WHERE daily_roll_id = ? LIMIT 1`,
    [rollId]
  );

  return result ?? null;
};

/**
 * Increment retry_count for a sync queue item (called after a failed sync attempt)
 */
export const incrementSyncRetryCount = async (syncId: string): Promise<void> => {
  const database = await getDatabase();
  await database.runAsync(
    `UPDATE sync_queue SET retry_count = retry_count + 1 WHERE id = ?`,
    [syncId]
  );
};

export default getDatabase;
