import type { AppiumServiceConfig } from '@wdio/appium-service';

const platform = (process.env.PLATFORM ?? 'android') as 'android' | 'ios';

// Only include 'appium:app' when an explicit path is provided — passing undefined
// causes Appium to reject the capability object entirely.
const androidCapabilities: Record<string, unknown> = {
  'appium:platformName': 'Android',
  'appium:automationName': 'UiAutomator2',
  // Expo Go package — override with your dev-build package name if needed
  'appium:appPackage': 'host.exp.exponent',
  'appium:appActivity': 'host.exp.exponent.experience.HomeActivity',
  'appium:noReset': false,
  'appium:autoGrantPermissions': true,
};
if (process.env.ANDROID_APP_PATH) {
  androidCapabilities['appium:app'] = process.env.ANDROID_APP_PATH;
}

const iosCapabilities: Record<string, unknown> = {
  'appium:platformName': 'iOS',
  'appium:automationName': 'XCUITest',
  'appium:platformVersion': process.env.IOS_PLATFORM_VERSION ?? '26.1',
  'appium:deviceName': process.env.IOS_DEVICE_NAME ?? 'iPhone 17',
  // Expo Go bundle id — override with your dev-build bundle id if needed
  'appium:bundleId': 'org.reactjs.native.example.habitdice',
  'appium:noReset': false,
  'appium:autoAcceptAlerts': false, // manage permission dialogs manually in specs
};
if (process.env.IOS_APP_PATH) {
  iosCapabilities['appium:app'] = process.env.IOS_APP_PATH;
}

export const config: WebdriverIO.Config = {
  runner: 'local',

  hostname: '127.0.0.1',
  port: 4723,
  path: '/',

  // Only pick up the WDIO-native specs — never the old Playwright files
  specs: ['./e2e/**/*.spec.ts'],
  exclude: [],

  // One device at a time; increase when running on a device farm
  maxInstances: 1,

  capabilities: [platform === 'ios' ? iosCapabilities : androidCapabilities],

  logLevel: 'info',

  bail: 0,

  baseUrl: '',

  waitforTimeout: 15000,

  connectionRetryTimeout: 30000,

  // 3 retries total gives Appium time to recover a flaky device session
  connectionRetryCount: 3,

  services: [
    [
      'appium',
      {
        command: 'appium',
        args: {
          address: '127.0.0.1',
          port: 4723,
          basePath: '/',
        },
        appiumStartTimeout: 60000,
      } as AppiumServiceConfig,
    ],
  ],

  framework: 'mocha',

  reporters: ['spec'],

  mochaOpts: {
    ui: 'bdd',
    timeout: 90000,
  },
};
