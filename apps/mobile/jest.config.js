const fs = require('fs');
const path = require('path');

const root = __dirname;
const topLevelExpoModulesCorePath = path.join(root, 'node_modules/expo-modules-core/index.js');
const nestedExpoModulesCorePath = path.join(root, 'node_modules/expo/node_modules/expo-modules-core/index.js');
const expoModulesCorePath = fs.existsSync(topLevelExpoModulesCorePath)
  ? topLevelExpoModulesCorePath
  : nestedExpoModulesCorePath;

/** @type {import('jest').Config} */
const config = {
  preset: 'jest-expo',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/global.css$': '<rootDir>/test/mocks/styleMock.js',
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@/assets/(.*)$': '<rootDir>/assets/$1',
    '\\.(css)$': '<rootDir>/test/mocks/styleMock.js',
    '^expo-modules-core$': expoModulesCorePath,
    '^expo-modules-core/src/polyfill/dangerous-internal$':
      '<rootDir>/test/mocks/expo-modules-core-dangerous-internal.js',
    '^expo-sqlite/localStorage/install$': '<rootDir>/__mocks__/expo-sqlite/localStorage/install.js',
  },
  testPathIgnorePatterns: ['/node_modules/', '/e2e/'],
  transformIgnorePatterns: [
    'node_modules/(?!(?:react-native|@react-native|expo|expo-.+|expo-modules-core|@expo|@expo-google-fonts|react-navigation|@react-navigation|firebase)/)',
  ],
};

module.exports = config;