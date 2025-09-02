import { initializeApp, getApps } from "firebase/app";
import {
  getAuth,
  connectAuthEmulator,
  GoogleAuthProvider,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "dummy-key",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "dummy-domain",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "dummy-project",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "dummy-bucket",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "dummy-app-id",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "dummy-measurement",
};

// Initialize Firebase only if not already initialized and in browser environment
let app: ReturnType<typeof initializeApp> | null = null;
let auth: ReturnType<typeof getAuth> | null = null;
let googleProvider: GoogleAuthProvider | null = null;

if (typeof window !== "undefined" && !getApps().length) {
  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    googleProvider = new GoogleAuthProvider();
    
    // Configure Google Sign-In settings
    googleProvider.setCustomParameters({
      prompt: "select_account", // Forces account selection even when one account is available
    });

    // Enable auth emulator in development if needed
    if (process.env.NODE_ENV === "development") {
      // Only enable emulator if explicitly configured
      if (process.env.NEXT_PUBLIC_USE_AUTH_EMULATOR === "true") {
        connectAuthEmulator(auth, "http://localhost:9099");
      }
    }
  } catch (error) {
    console.warn("Firebase initialization failed:", error);
    // Create dummy objects for SSR/build time
    app = null;
    auth = null;
    googleProvider = null;
  }
} else if (typeof window === "undefined") {
  // Server-side rendering - create dummy objects
  app = null;
  auth = null;
  googleProvider = null;
}

export { auth, googleProvider };
export default app;
