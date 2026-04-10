import React from 'react';

import { NotificationPermissionGate } from '@/features/onboarding/components/NotificationPermissionGate';

export default function HomeScreen() {
  return <NotificationPermissionGate />;
}
