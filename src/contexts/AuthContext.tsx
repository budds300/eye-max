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
        return userCredential;
      },
    );
  }

  function signIn(email: string, password: string) {
    if (!auth) {
      return Promise.reject(new Error("Firebase not initialized"));
    }
    return signInWithEmailAndPassword(auth, email, password);
  }

  function logout() {
    // If it's a demo user, just clear the local state
    if (currentUser?.providerId === "demo") {
      setCurrentUser(null);
      setLoading(false);
      return Promise.resolve();
    }
    // For real Firebase users, use Firebase signOut
    if (!auth) {
      return Promise.reject(new Error("Firebase not initialized"));
    }
    return signOut(auth);
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
      resolve();
    });
  }

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    // Handle redirect result for Google sign-in
    getRedirectResult(auth)
      .then((result) => {
        if (result) {
          // User successfully signed in with Google
          // The user will be automatically set by onAuthStateChanged above
          // Redirect to home page after successful Google sign-in
          if (typeof window !== "undefined") {
            // Use router.push instead of window.location for better Next.js integration
            setTimeout(() => {
              window.location.href = "/";
            }, 1000); // Small delay to ensure state is updated
          }
        }
      })
      .catch(() => {
        // Handle error silently
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
    </AuthContext.Provider>
  );
}
