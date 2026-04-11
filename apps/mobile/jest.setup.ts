import '@testing-library/jest-native/extend-expect';

jest.mock(
	'@react-native-async-storage/async-storage',
	() => require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

const mockRouter = {
	push: jest.fn(),
	replace: jest.fn(),
	back: jest.fn(),
	canGoBack: jest.fn(() => true),
};

jest.mock('expo-router', () => ({
	useRouter: () => mockRouter,
	usePathname: () => '/',
	useSegments: () => [],
}));
