import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AuthService from '../api/authService.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authView, setAuthView] = useState('signin'); // 'signin' | 'signup' | 'forgot'
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    const existing = AuthService.getCurrentUser();
    if (existing) {
      setUser(existing);
    }
  }, []);

  const openAuthModal = useCallback((view = 'signin') => {
    setAuthView(view);
    setAuthError(null);
    setIsAuthModalOpen(true);
  }, []);

  const closeAuthModal = useCallback(() => {
    setIsAuthModalOpen(false);
    setAuthError(null);
  }, []);

  const signIn = useCallback(async (email, password) => {
    setIsLoading(true);
    setAuthError(null);
    try {
      const loggedUser = await AuthService.signIn(email, password);
      setUser(loggedUser);
      closeAuthModal();
      return loggedUser;
    } catch (err) {
      setAuthError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [closeAuthModal]);

  const signUp = useCallback(async (name, email, password) => {
    setIsLoading(true);
    setAuthError(null);
    try {
      const registeredUser = await AuthService.signUp(name, email, password);
      setUser(registeredUser);
      closeAuthModal();
      return registeredUser;
    } catch (err) {
      setAuthError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [closeAuthModal]);

  const sendPasswordReset = useCallback(async (email) => {
    setIsLoading(true);
    setAuthError(null);
    try {
      const res = await AuthService.sendPasswordReset(email);
      return res;
    } catch (err) {
      setAuthError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signOut = useCallback(async () => {
    await AuthService.signOut();
    setUser(null);
  }, []);

  const value = {
    user,
    isAuthenticated: !!user,
    isAuthModalOpen,
    authView,
    setAuthView,
    isLoading,
    authError,
    openAuthModal,
    closeAuthModal,
    signIn,
    signUp,
    sendPasswordReset,
    signOut
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
