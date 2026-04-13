import type { AppiumServiceConfig } from '@wdio/appium-service';
import * as fs from 'fs';
import * as path from 'path';

const platform = (process.env.PLATFORM ?? 'android') as 'android' | 'ios';

// ---------------------------------------------------------------------------
// iOS: resolve .app path from env var OR auto-detect from Expo build output.
// Appium MUST have an `app` path to boot the simulator and install the app.
// Without it, Appium will error because there is nothing to install/launch.
// Build the app first:  npm run build:ios:sim
// ---------------------------------------------------------------------------
function resolveIosAppPath(): string | undefined {
  if (process.env.IOS_APP_PATH) return process.env.IOS_APP_PATH;

  // 1. Local derivedDataPath used by the old xcodebuild script
  const localBuildDir = path.resolve(
    __dirname,
    'ios/build/Build/Products/Debug-iphonesimulator',
  );
  if (fs.existsSync(localBuildDir)) {
    const apps = fs.readdirSync(localBuildDir).filter((f) => f.endsWith('.app'));
    if (apps.length > 0) return path.join(localBuildDir, apps[0]);
  }

  // 2. Xcode DerivedData — where `expo run:ios` places the build
  const derivedData = path.join(
    process.env.HOME ?? '',
    'Library/Developer/Xcode/DerivedData',
  );
  if (fs.existsSync(derivedData)) {
    // Find the most recently modified habitdice-* directory
    const entries = fs.readdirSync(derivedData)
      .filter((d) => d.startsWith('habitdice-'))
      .map((d) => ({ name: d, mtime: fs.statSync(path.join(derivedData, d)).mtimeMs }))
      .sort((a, b) => b.mtime - a.mtime);
    for (const entry of entries) {
      const simDir = path.join(derivedData, entry.name, 'Build/Products/Debug-iphonesimulator');
      if (fs.existsSync(simDir)) {
        const apps = fs.readdirSync(simDir).filter((f) => f.endsWith('.app'));
        if (apps.length > 0) return path.join(simDir, apps[0]);
      }
    }
  }

  return undefined;
}

// ---------------------------------------------------------------------------
// Android: resolve APK path from env var OR auto-detect from Expo build output.
// Build first:  npm run build:android:debug
// ---------------------------------------------------------------------------
function resolveAndroidAppPath(): string | undefined {
  if (process.env.ANDROID_APP_PATH) return process.env.ANDROID_APP_PATH;

  const apkDir = path.resolve(
    __dirname,
    'android/app/build/outputs/apk/debug',
  );
  if (!fs.existsSync(apkDir)) return undefined;

  const apks = fs.readdirSync(apkDir).filter((f) => f.endsWith('.apk'));
  return apks.length > 0 ? path.join(apkDir, apks[0]) : undefined;
}

const iosAppPath = resolveIosAppPath();
const androidAppPath = resolveAndroidAppPath();

if (platform === 'ios' && !iosAppPath) {
  console.warn(
    '\n⚠️  No iOS .app found. Run `npm run build:ios:sim` before running E2E tests.\n' +
    '   Or set IOS_APP_PATH=/path/to/YourApp.app\n',
  );
}

if (platform === 'android' && !androidAppPath) {
  console.warn(
    '\n⚠️  No Android APK found. Run `npm run build:android:debug` before running E2E tests.\n' +
    '   Or set ANDROID_APP_PATH=/path/to/app-debug.apk\n',
  );
}

// ---------------------------------------------------------------------------
// Capabilities
// ---------------------------------------------------------------------------
const androidCapabilities: Record<string, unknown> = {
  'appium:platformName': 'Android',
  'appium:automationName': 'UiAutomator2',
  'appium:appPackage': 'com.habitdice',
  'appium:appActivity': '.MainActivity',
  'appium:noReset': false,
  'appium:autoGrantPermissions': true,
  'appium:autoLaunch': true,
};
if (androidAppPath) {
  androidCapabilities['appium:app'] = androidAppPath;
} else {
  // Fall back to launching the already-installed package
  androidCapabilities['appium:appPackage'] = 'com.habitdice';
}

const iosCapabilities: Record<string, unknown> = {
  'appium:platformName': 'iOS',
  'appium:automationName': 'XCUITest',
  'appium:platformVersion': process.env.IOS_PLATFORM_VERSION ?? '18.6',
  'appium:deviceName': process.env.IOS_DEVICE_NAME ?? 'iPhone 16 Pro',
  'appium:noReset': false,
  'appium:autoAcceptAlerts': false, // manage permission dialogs manually in specs
  'appium:autoLaunch': true,
  // Give XCUITest enough time to boot a cold simulator (~2 min)
  'appium:simulatorStartupTimeout': 120000,
  'appium:wdaLaunchTimeout': 120000,
  'appium:wdaConnectionTimeout': 120000,
};
if (iosAppPath) {
  // App path tells Appium what to install — also provides bundleId implicitly
  iosCapabilities['appium:app'] = iosAppPath;
} else {
  // No build available: try to activate an already-installed app by bundleId
  iosCapabilities['appium:bundleId'] = 'com.habitdice';
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
