import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { act, renderHook } from '@testing-library/react-native';

type NetInfoState = {
  isConnected: boolean | null;
  isInternetReachable: boolean | null;
};

let subscriber: ((state: NetInfoState) => void) | null = null;

jest.mock('@react-native-community/netinfo', () => ({
  __esModule: true,
  default: {
    fetch: jest.fn(async () => ({ isConnected: true, isInternetReachable: true })),
    addEventListener: jest.fn((next: (state: NetInfoState) => void) => {
      subscriber = next;
      return jest.fn();
    }),
  },
}));

import NetInfo from '@react-native-community/netinfo';

import { useConnectivityStatus } from '@/hooks/useConnectivityStatus';

const mockedNetInfo = jest.mocked(NetInfo);

beforeEach(() => {
  jest.clearAllMocks();
  subscriber = null;
});

describe('useConnectivityStatus', () => {
  it('starts online when network is connected', async () => {
    mockedNetInfo.fetch.mockResolvedValueOnce({ isConnected: true, isInternetReachable: true });

    const { result } = renderHook(() => useConnectivityStatus());
    await act(async () => {});

    expect(result.current.isOnline).toBe(true);
    expect(result.current.isOffline).toBe(false);
  });

  it('updates to offline when connectivity listener reports no internet', async () => {
    mockedNetInfo.fetch.mockResolvedValueOnce({ isConnected: true, isInternetReachable: true });

    const { result } = renderHook(() => useConnectivityStatus());
    await act(async () => {});

    act(() => {
      subscriber?.({ isConnected: false, isInternetReachable: false });
    });

    expect(result.current.isOffline).toBe(true);
    expect(result.current.isOnline).toBe(false);
  });
});
