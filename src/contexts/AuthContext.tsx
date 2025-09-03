"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  User,
  UserCredential,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  signInWithRedirect,
  getRedirectResult,
  updateProfile,
} from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";
import { Toast } from "@/components/ui/toast";

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<UserCredential>;
  signUp: (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
  ) => Promise<UserCredential>;
  logout: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithDemo: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
    isVisible: boolean;
  }>({
    message: "",
    type: "success",
    isVisible: false,
  });

  const showToast = (
    message: string,
    type: "success" | "error" = "success",
  ) => {
    setToast({ message, type, isVisible: true });
  };

  const hideToast = () => {
    setToast((prev) => ({ ...prev, isVisible: false }));
  };

  function signUp(
    email: string,
    password: string,
    firstName: string,
    lastName: string,
  ) {
    if (!auth) {
      return Promise.reject(new Error("Firebase not initialized"));
    }
    return createUserWithEmailAndPassword(auth, email, password).then(
      async (userCredential) => {
        // Update the user's display name with first and last name
        const user = userCredential.user;
        await updateProfile(user, {
          displayName: `${firstName} ${lastName}`,
          photoURL: null,
        });
        showToast("Account created successfully! Welcome to EyeMax!");
        return userCredential;
      },
    );
  }

  function signIn(email: string, password: string) {
    if (!auth) {
      return Promise.reject(new Error("Firebase not initialized"));
    }
    return signInWithEmailAndPassword(auth, email, password).then(
      (userCredential) => {
        showToast("Welcome back! You've been signed in successfully.");
        return userCredential;
      },
    );
  }

  function logout() {
    // If it's a demo user, just clear the local state
    if (currentUser?.providerId === "demo") {
      setCurrentUser(null);
      setLoading(false);
      showToast("Demo session ended. Thanks for trying EyeMax!");
      return Promise.resolve();
    }
    // For real Firebase users, use Firebase signOut
    if (!auth) {
      return Promise.reject(new Error("Firebase not initialized"));
    }
    return signOut(auth).then(() => {
      showToast("You've been signed out successfully. Come back soon!");
    });
  }

  function signInWithGoogle() {
    // Use the configured Google provider from firebase.ts
    if (!auth || !googleProvider) {
      return Promise.reject(new Error("Firebase not initialized"));
    }
    return signInWithRedirect(auth, googleProvider);
  }

  // Demo account function that bypasses Firebase
  function signInWithDemo() {
    return new Promise<void>((resolve) => {
      // Create a mock user object for demo purposes
      const demoUser = {
        uid: "demo-user-123",
        email: "demo@example.com",
        displayName: "Demo User",
        photoURL: null,
        emailVerified: true,
        isAnonymous: false,
        metadata: {},
        providerData: [],
        refreshToken: "demo-token",
        tenantId: null,
        delete: () => Promise.resolve(),
        getIdToken: () => Promise.resolve("demo-id-token"),
        getIdTokenResult: () =>
          Promise.resolve({
            authTime: new Date().toISOString(),
            issuedAtTime: new Date().toISOString(),
            signInProvider: "demo",
            signInSecondFactor: null,
            token: "demo-id-token",
            claims: {},
            expirationTime: new Date(Date.now() + 3600000).toISOString(),
          }),
        reload: () => Promise.resolve(),
        toJSON: () => ({}),
        phoneNumber: null,
        providerId: "demo",
      } as User;

      setCurrentUser(demoUser);
      setLoading(false);
      showToast("Demo mode activated! Explore EyeMax features.");
      resolve();
    });
  }

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        setCurrentUser(user);
        setLoading(false);
      },
      (error) => {
        console.error("Auth state change error:", error);
        setLoading(false);
      },
    );

    // Handle redirect result for Google sign-in
    getRedirectResult(auth)
      .then((result) => {
        if (result) {
          // User successfully signed in with Google
          // The user will be automatically set by onAuthStateChanged above
          showToast("Welcome! You've been signed in with Google.");
          // Redirect to home page after successful Google sign-in
          if (typeof window !== "undefined") {
            // Use router.push instead of window.location for better Next.js integration
            setTimeout(() => {
              window.location.href = "/";
            }, 1000); // Small delay to ensure state is updated
          }
        }
      })
      .catch((error) => {
        console.warn("Google sign-in redirect error:", error);
        // Handle error silently but log it for debugging
      });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    loading,
    signIn,
    signUp,
    logout,
    signInWithGoogle,
    signInWithDemo,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
        duration={4000}
      />
    </AuthContext.Provider>
  );
}
