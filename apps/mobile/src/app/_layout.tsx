import { Slot, useRouter } from 'expo-router';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import * as Notifications from 'expo-notifications';
import React from 'react';
import { AppState, useColorScheme } from 'react-native';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import AppTabs from '@/components/app-tabs';
import {
  addCrashBreadcrumb,
  installGlobalCrashHandler,
  startCrashReportingSession,
} from '@/features/crash-reporting/CrashReportingService';
import { registerDevicePushToken } from '@/features/notifications/services/PushNotificationService';
import { parseReminderDeepLink } from '@/features/notifications/services/NotificationSchedulerService';
import { processQueue } from '@/features/sync/SyncService';
import { refreshTaskCatalogIfNeeded } from '@/features/task-catalog-refresh/TaskCatalogRefreshService';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();

  React.useEffect(() => {
    installGlobalCrashHandler();
    startCrashReportingSession().catch(() => {});
    addCrashBreadcrumb('app_layout_mounted');

    // Handle notification tap while app is already open
    const subscription = Notifications.addNotificationResponseReceivedListener((response) => {
      const url = response.notification.request.content.data?.url as string | undefined;
      const target = parseReminderDeepLink(url);
      if (target === 'roll' || target === '') {
        router.push('/');
      }
    });

    // Handle notification tap that launched the app (cold start)
    Notifications.getLastNotificationResponseAsync().then((response) => {
      if (!response) return;
      const url = response.notification.request.content.data?.url as string | undefined;
      const target = parseReminderDeepLink(url);
      if (target === 'roll' || target === '') {
        router.push('/');
      }
    });

    // Trigger background sync whenever the app comes to the foreground
    const appStateSubscription = AppState.addEventListener('change', (nextState) => {
      if (nextState === 'active') {
        addCrashBreadcrumb('app_foregrounded');
        processQueue().catch(() => {});
        refreshTaskCatalogIfNeeded().catch(() => {});
      }
    });

    // Also attempt sync on initial mount
    registerDevicePushToken().catch(() => {});
    processQueue().catch(() => {});
    refreshTaskCatalogIfNeeded().catch(() => {});

    return () => {
      subscription.remove();
      appStateSubscription.remove();
    };
  }, [router]);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AnimatedSplashOverlay />
      <AppTabs>
        <Slot />
      </AppTabs>
    </ThemeProvider>
  );
}
