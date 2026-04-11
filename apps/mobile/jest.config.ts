import type { Config } from 'jest';

const config: Config = {
  preset: 'jest-expo',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@/assets/(.*)$': '<rootDir>/assets/$1',
    '\\.(css)$': '<rootDir>/test/mocks/styleMock.js',
    '^expo-modules-core$': '<rootDir>/node_modules/expo-modules-core/index.js',
    '^expo-modules-core/src/polyfill/dangerous-internal$':
      '<rootDir>/test/mocks/expo-modules-core-dangerous-internal.js',
  },
  testPathIgnorePatterns: ['/node_modules/', '/e2e/'],
  transformIgnorePatterns: [
    'node_modules/(?!(?:react-native|@react-native|expo(?:nent)?|expo-modules-core|@expo|expo-router|@expo-google-fonts|react-navigation|@react-navigation)/)',
  ],
};

export default config;
