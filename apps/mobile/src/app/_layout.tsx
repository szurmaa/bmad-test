import { Slot, useRouter } from 'expo-router';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import * as Notifications from 'expo-notifications';
import React from 'react';
import { useColorScheme } from 'react-native';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import AppTabs from '@/components/app-tabs';
import { parseReminderDeepLink } from '@/features/notifications/services/NotificationSchedulerService';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();

  React.useEffect(() => {
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

    return () => subscription.remove();
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
