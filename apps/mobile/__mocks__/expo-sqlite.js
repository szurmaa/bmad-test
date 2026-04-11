// Manual mock for expo-sqlite used by jest test runner.
// Provides no-op implementations for all database operations.

const mockDb = {
  execAsync: jest.fn(async () => {}),
  runAsync: jest.fn(async () => ({ lastInsertRowId: 0, changes: 0 })),
  getFirstAsync: jest.fn(async () => null),
  getAllAsync: jest.fn(async () => []),
  closeAsync: jest.fn(async () => {}),
};

module.exports = {
  openDatabaseAsync: jest.fn(async () => mockDb),
  SQLiteDatabase: jest.fn(),
};
