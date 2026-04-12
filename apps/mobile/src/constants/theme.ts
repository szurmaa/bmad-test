/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import '@/global.css';

import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#223332',
    background: '#F7F3EA',
    backgroundElement: '#FFFBF6',
    backgroundSelected: '#ECE4D7',
    textSecondary: '#5F706F',
    primary: '#3D6F69',
    primaryText: '#F6F2EA',
    success: '#6F9D79',
    warning: '#D8A575',
    error: '#C88484',
  },
  dark: {
    text: '#F2ECE1',
    background: '#1E2A2B',
    backgroundElement: '#243534',
    backgroundSelected: '#2F4443',
    textSecondary: '#B4C4C2',
    primary: '#7FAEA8',
    primaryText: '#13201F',
    success: '#8FB89A',
    warning: '#D8A575',
    error: '#D89D9D',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
