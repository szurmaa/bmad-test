// Manual mock for expo-notifications used by jest test runner.
// Provides enum constants and no-op implementations for all functions used in tests.

const PermissionStatus = {
  GRANTED: 'granted',
  DENIED: 'denied',
  UNDETERMINED: 'undetermined',
};

const IosAuthorizationStatus = {
  NOT_DETERMINED: 0,
  DENIED: 1,
  AUTHORIZED: 2,
  PROVISIONAL: 3,
  EPHEMERAL: 4,
};

const AndroidImportance = {
  DEFAULT: 3,
  HIGH: 4,
  LOW: 2,
  MAX: 5,
  MIN: 1,
  NONE: 0,
  UNSPECIFIED: -1000,
};

const SchedulableTriggerInputTypes = {
  DAILY: 'DAILY',
  WEEKLY: 'WEEKLY',
  CALENDAR: 'CALENDAR',
  DATE: 'DATE',
  TIME_INTERVAL: 'TIME_INTERVAL',
};

module.exports = {
  PermissionStatus,
  IosAuthorizationStatus,
  AndroidImportance,
  SchedulableTriggerInputTypes,
  getPermissionsAsync: jest.fn(async () => ({
    granted: false,
    status: PermissionStatus.UNDETERMINED,
    ios: { status: IosAuthorizationStatus.NOT_DETERMINED },
  })),
  requestPermissionsAsync: jest.fn(async () => ({
    granted: false,
    status: PermissionStatus.DENIED,
    ios: { status: IosAuthorizationStatus.DENIED },
  })),
  setNotificationChannelAsync: jest.fn(async () => null),
  scheduleNotificationAsync: jest.fn(async () => 'mock-notification-id'),
  cancelScheduledNotificationAsync: jest.fn(async () => {}),
  addNotificationResponseReceivedListener: jest.fn(() => ({ remove: jest.fn() })),
  getLastNotificationResponseAsync: jest.fn(async () => null),
};
