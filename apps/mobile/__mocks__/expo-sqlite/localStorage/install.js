// Mock for expo-sqlite/localStorage/install
// In the real app this installs a globalThis.localStorage polyfill using SQLite.
// In tests we use jsdom's built-in localStorage (or a simple in-memory stub).

// No-op: jest environment already provides globalThis.localStorage via jsdom
// or tests that need it set it up manually.
