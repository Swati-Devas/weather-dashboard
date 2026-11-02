import React, { createContext, useContext, useState, useEffect } from 'react';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { auth, googleProvider, isFirebaseConfigured } from '../services/firebase';

const AuthContext = createContext({
  user: null,
  loading: true,
  authError: null,
  isLoginModalOpen: false,
  isProfileOpen: false,
  isFirebaseConfigured: false,
  openLoginModal: () => {},
  closeLoginModal: () => {},
  openProfile: () => {},
  closeProfile: () => {},
  loginWithGoogle: async () => {},
  logout: async () => {},
  clearAuthError: () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // Subscribe to Firebase auth state changes on mount
  useEffect(() => {
    if (!auth || !isFirebaseConfigured) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(
      auth,
      (currentUser) => {
        setUser(currentUser);
        setLoading(false);
      },
      (error) => {
        console.error('Firebase Auth state error:', error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const openLoginModal = () => {
    setAuthError(null);
    setIsLoginModalOpen(true);
  };

  const closeLoginModal = () => {
    setIsLoginModalOpen(false);
    setAuthError(null);
  };

  const openProfile = () => setIsProfileOpen(true);
  const closeProfile = () => setIsProfileOpen(false);
  const clearAuthError = () => setAuthError(null);

  /**
   * Sign in with Google using Firebase Authentication
   */
  const loginWithGoogle = async () => {
    setAuthError(null);

    if (!isFirebaseConfigured || !auth || !googleProvider) {
      setAuthError(
        'Firebase credentials are not yet configured in your environment. Please add your VITE_FIREBASE_* keys to .env or Vercel.'
      );
      return;
    }

    setIsAuthenticating(true);

    try {
      const result = await signInWithPopup(auth, googleProvider);
      setUser(result.user);
      setIsLoginModalOpen(false);
    } catch (err) {
      console.error('Google Sign-in failed:', err);
      let errorMsg = 'Failed to sign in with Google. Please try again.';

      if (err.code === 'auth/popup-closed-by-user') {
        errorMsg = 'Sign-in was closed before completing. Please try again.';
      } else if (err.code === 'auth/popup-blocked') {
        errorMsg = 'Pop-up was blocked by your browser. Please allow pop-ups for this site.';
      } else if (err.code === 'auth/cancelled-popup-request') {
        errorMsg = 'Only one sign-in window can be open at a time.';
      } else if (err.code === 'auth/network-request-failed') {
        errorMsg = 'Network connection failed. Please check your internet connection.';
      } else if (err.code === 'auth/unauthorized-domain') {
        errorMsg = 'This domain is not authorized in Firebase Console. Please add it to Authorized Domains in Firebase Authentication Settings.';
      } else if (err.message) {
        errorMsg = err.message;
      }

      setAuthError(errorMsg);
    } finally {
      setIsAuthenticating(false);
    }
  };

  /**
   * Sign out using Firebase Authentication
   */
  const logout = async () => {
    try {
      if (auth && isFirebaseConfigured) {
        await signOut(auth);
      }
      setUser(null);
      setIsProfileOpen(false);
    } catch (err) {
      console.error('Sign-out failed:', err);
    }
  };

  const value = {
    user,
    loading,
    authError,
    isAuthenticating,
    isLoginModalOpen,
    isProfileOpen,
    isFirebaseConfigured,
    openLoginModal,
    closeLoginModal,
    openProfile,
    closeProfile,
    loginWithGoogle,
    logout,
    clearAuthError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

