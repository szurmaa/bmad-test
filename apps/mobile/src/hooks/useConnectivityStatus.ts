import { useEffect, useState } from 'react';
import NetInfo from '@react-native-community/netinfo';

export function useConnectivityStatus() {
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    let isMounted = true;

    NetInfo.fetch().then((state) => {
      if (!isMounted) {
        return;
      }

      const connected = state.isConnected ?? false;
      const reachable = state.isInternetReachable ?? connected;
      setIsOffline(!(connected && reachable));
    });

    const unsubscribe = NetInfo.addEventListener((state) => {
      const connected = state.isConnected ?? false;
      const reachable = state.isInternetReachable ?? connected;
      setIsOffline(!(connected && reachable));
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  return {
    isOffline,
    isOnline: !isOffline,
  };
}
