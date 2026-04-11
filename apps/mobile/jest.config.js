/** @type {import('jest').Config} */
const config = {
  preset: 'jest-expo',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/global.css$': '<rootDir>/test/mocks/styleMock.js',
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@/assets/(.*)$': '<rootDir>/assets/$1',
    '\\.(css)$': '<rootDir>/test/mocks/styleMock.js',
    '^expo-modules-core$': '<rootDir>/node_modules/expo-modules-core/index.js',
    '^expo-modules-core/src/polyfill/dangerous-internal$':
      '<rootDir>/test/mocks/expo-modules-core-dangerous-internal.js',
    '^expo-sqlite/localStorage/install$': '<rootDir>/__mocks__/expo-sqlite/localStorage/install.js',
  },
  testPathIgnorePatterns: ['/node_modules/', '/e2e/'],
  transformIgnorePatterns: [
    'node_modules/(?!(?:react-native|@react-native|expo(?:nent)?|expo-notifications|expo-modules-core|@expo|expo-router|@expo-google-fonts|react-navigation|@react-navigation|firebase)/)',
  ],
};

module.exports = config;