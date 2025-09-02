import { initializeApp } from 'firebase/app'
import { getAuth, connectAuthEmulator, GoogleAuthProvider } from 'firebase/auth'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app)

// Initialize Google Auth Provider
export const googleProvider = new GoogleAuthProvider()

// Configure Google Sign-In settings
googleProvider.setCustomParameters({
  prompt: 'select_account' // Forces account selection even when one account is available
})

// Enable auth emulator in development if needed
if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
  // Only enable emulator if explicitly configured
  if (process.env.NEXT_PUBLIC_USE_AUTH_EMULATOR === 'true') {
    connectAuthEmulator(auth, 'http://localhost:9099')
  }
}

export default app
