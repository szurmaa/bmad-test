export type FirebaseEnvironment = "development" | "preview" | "production";

export type FirebaseConfig = {
  projectId: string;
  apiKey: string;
  authDomain: string;
  appId: string;
  messagingSenderId: string;
};

export const firebaseConfigFromEnv = (): FirebaseConfig => ({
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID ?? "",
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY ?? "",
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN ?? "",
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID ?? "",
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? "",
});
