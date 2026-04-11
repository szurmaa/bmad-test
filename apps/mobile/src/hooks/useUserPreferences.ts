import { useCallback, useEffect, useState } from 'react';

import {
  getOrCreateLocalProfileId,
  readUserPreferences,
  writeUserPreferences,
  type UserPreferences,
} from '@/db/local-profile-storage';
import { queueForSync } from '@/db/schema';

export function useUserPreferences() {
  const [isLoading, setIsLoading] = useState(true);
  const [preferences, setPreferences] = useState<UserPreferences>({
    appearance: 'system',
    aboutLastViewedAt: null,
  });

  useEffect(() => {
    let cancelled = false;

    readUserPreferences().then((stored) => {
      if (!cancelled) {
        setPreferences(stored);
        setIsLoading(false);
      }
    });

    return () => {
      cancelled = true;
    };
  }, []);

  const setAppearance = useCallback(async (appearance: UserPreferences['appearance']) => {
    const next = { ...preferences, appearance };
    setPreferences(next);
    await writeUserPreferences(next);

    const profileId = await getOrCreateLocalProfileId();
    await queueForSync('user_profile_updated', {
      profileId,
      appearance,
      updatedAt: new Date().toISOString(),
    });
  }, [preferences]);

  const markAboutViewed = useCallback(async () => {
    const next = { ...preferences, aboutLastViewedAt: new Date().toISOString() };
    setPreferences(next);
    await writeUserPreferences(next);
  }, [preferences]);

  return {
    isLoading,
    appearance: preferences.appearance,
    aboutLastViewedAt: preferences.aboutLastViewedAt,
    setAppearance,
    markAboutViewed,
  };
}
