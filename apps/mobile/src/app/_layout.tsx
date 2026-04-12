import { Slot, useRouter } from 'expo-router';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import React from 'react';
import { AppState, useColorScheme } from 'react-native';
import NetInfo from '@react-native-community/netinfo';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import AppTabs from '@/components/app-tabs';
import { Colors } from '@/constants/theme';
import {
  addCrashBreadcrumb,
  installGlobalCrashHandler,
  startCrashReportingSession,
} from '@/features/crash-reporting/CrashReportingService';
import {
  safeAddNotificationResponseReceivedListener,
  safeGetLastNotificationResponseAsync,
} from '@/features/notifications/services/SafeNotificationsService';
import { registerDevicePushToken } from '@/features/notifications/services/PushNotificationService';
import { parseReminderDeepLink } from '@/features/notifications/services/NotificationSchedulerService';
import { processQueue } from '@/features/sync/SyncService';
import { refreshTaskCatalogIfNeeded } from '@/features/task-catalog-refresh/TaskCatalogRefreshService';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const palette = colorScheme === 'dark' ? Colors.dark : Colors.light;
  const navigationTheme = {
    ...(colorScheme === 'dark' ? DarkTheme : DefaultTheme),
    colors: {
      ...(colorScheme === 'dark' ? DarkTheme.colors : DefaultTheme.colors),
      background: palette.background,
      card: palette.backgroundElement,
      text: palette.text,
      border: palette.backgroundSelected,
      primary: palette.primary,
    },
  };

  React.useEffect(() => {
    let isMounted = true; // Prevent state updates on unmounted component

    // Initialize crash reporting and app state
    installGlobalCrashHandler();
    startCrashReportingSession().catch(() => {});
    addCrashBreadcrumb('app_layout_mounted');

    // Handle notification tap while app is already open
    const subscription = safeAddNotificationResponseReceivedListener((response) => {
      if (!isMounted) return;
      const url = response.notification.request.content.data?.url as string | undefined;
      const target = parseReminderDeepLink(url);
      if (target === 'roll' || target === '') {
        router.push('/');
      }
    });

    // Handle notification tap that launched the app (cold start)
    // Use a deferred async operation to avoid state updates during render
    let deferred: () => Promise<void> | undefined;
    deferred = async () => {
      const response = await safeGetLastNotificationResponseAsync();
      if (!isMounted || !response) return;
      const url = response.notification.request.content.data?.url as string | undefined;
      const target = parseReminderDeepLink(url);
      if (isMounted && (target === 'roll' || target === '')) {
        router.push('/');
      }
    };
    deferred().catch(() => {});

    // Trigger background sync whenever the app comes to the foreground
    const appStateSubscription = AppState.addEventListener('change', (nextState) => {
      if (nextState === 'active' && isMounted) {
        addCrashBreadcrumb('app_foregrounded');
        processQueue().catch(() => {});
        refreshTaskCatalogIfNeeded().catch(() => {});
      }
    });

    const netInfoSubscription = NetInfo.addEventListener((state) => {
      if (!isMounted) return;
      const connected = state.isConnected ?? false;
      const reachable = state.isInternetReachable ?? connected;

      if (connected && reachable) {
        addCrashBreadcrumb('connectivity_restored');
        processQueue().catch(() => {});
        refreshTaskCatalogIfNeeded().catch(() => {});
      }
    });

    // Also attempt sync on initial mount
    registerDevicePushToken().catch(() => {});
    processQueue().catch(() => {});
    refreshTaskCatalogIfNeeded().catch(() => {});

    return () => {
      isMounted = false; // Prevent callbacks after unmount
      subscription.remove();
      appStateSubscription.remove();
      netInfoSubscription();
    };
  }, [router]);

  return (
    <ThemeProvider value={navigationTheme}>
      <AnimatedSplashOverlay />
      <AppTabs>
        <Slot />
      </AppTabs>
    </ThemeProvider>
  );
}
