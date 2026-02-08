import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { db } from '@/db/database';
import type { User, AuthState } from '@/types';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Session storage key
const SESSION_KEY = 'auracode_session';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  // Load session from localStorage on mount
  useEffect(() => {
    const loadSession = async () => {
      try {
        const session = localStorage.getItem(SESSION_KEY);
        if (session) {
          const { userId } = JSON.parse(session);
          const user = await db.getById<User>('users', userId);
          if (user) {
            setState({ user, isAuthenticated: true, isLoading: false });
            return;
          }
        }
      } catch (error) {
        console.error('Failed to load session:', error);
      }
      setState({ user: null, isAuthenticated: false, isLoading: false });
    };

    // Wait for DB to be ready
    const checkDb = setInterval(() => {
      if ((db as any).db) {
        clearInterval(checkDb);
        loadSession();
      }
    }, 100);

    // Fallback after 3 seconds
    setTimeout(() => {
      clearInterval(checkDb);
      loadSession();
    }, 3000);

    return () => clearInterval(checkDb);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    // Get all users and find by email
    const users = await db.getAll<User>('users');
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Check password (in production, compare hashed passwords)
    if (user.password !== password) {
      throw new Error('Invalid email or password');
    }

    // Save session
    localStorage.setItem(SESSION_KEY, JSON.stringify({ userId: user.id }));
    setState({ user, isAuthenticated: true, isLoading: false });
  }, []);

  const signup = useCallback(async (email: string, password: string, name: string) => {
    // Check if email already exists
    const users = await db.getAll<User>('users');
    const existingUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (existingUser) {
      throw new Error('Email already registered');
    }

    const newUser: User = {
      id: `user-${Date.now()}`,
      email: email.toLowerCase(),
      password, // In production, hash this
      name,
      role: 'customer',
      avatar: null,
      createdAt: new Date().toISOString(),
    };

    await db.add('users', newUser);
    
    // Auto login after signup
    localStorage.setItem(SESSION_KEY, JSON.stringify({ userId: newUser.id }));
    setState({ user: newUser, isAuthenticated: true, isLoading: false });
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(SESSION_KEY);
    setState({ user: null, isAuthenticated: false, isLoading: false });
  }, []);

  const updateProfile = useCallback(async (updates: Partial<User>) => {
    if (!state.user) return;

    const updatedUser = { ...state.user, ...updates };
    await db.update('users', updatedUser);
    setState({ ...state, user: updatedUser });
  }, [state]);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        signup,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
