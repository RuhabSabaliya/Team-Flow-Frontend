'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { apiClient, ApiError } from '@/lib/api';

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (data: { email: string; password: string }) => Promise<void>;
  register: (data: { name: string; email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (name: string) => Promise<User>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const clearError = () => setError(null);

  /**
   * Session Handshake:
   * 1. Try to fetch /auth/me with existing cookie.
   * 2. If 401, try to rotate refresh token via /auth/refresh, then re-fetch /auth/me.
   * 3. If both fail, user is not logged in.
   */
  const checkSession = useCallback(async () => {
    try {
      const profile = await apiClient<User>('/auth/me');
      setUser(profile);
    } catch (err: any) {
      if (err instanceof ApiError && err.status === 401) {
        // Attempt token refresh
        try {
          await apiClient('/auth/refresh', { method: 'POST' });
          const refreshedProfile = await apiClient<User>('/auth/me');
          setUser(refreshedProfile);
        } catch {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  /**
   * Login
   */
  const login = async (data: { email: string; password: string }) => {
    setError(null);
    try {
      const res = await apiClient<{ user: User }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(data)
      });
      setUser(res.user);
    } catch (err: any) {
      const msg = err.message || 'Login failed. Please check your credentials.';
      setError(msg);
      throw err;
    }
  };

  /**
   * Register
   */
  const register = async (data: { name: string; email: string; password: string }) => {
    setError(null);
    try {
      const res = await apiClient<{ user: User }>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(data)
      });
      setUser(res.user);
    } catch (err: any) {
      const msg = err.message || 'Registration failed. Please try again.';
      setError(msg);
      throw err;
    }
  };

  /**
   * Update Profile Details (Name)
   */
  const updateProfile = async (name: string): Promise<User> => {
    const updated = await apiClient<User>('/auth/profile', {
      method: 'PATCH',
      body: JSON.stringify({ name })
    });
    setUser(updated);
    return updated;
  };

  /**
   * Change Password
   */
  const changePassword = async (currentPassword: string, newPassword: string): Promise<void> => {
    await apiClient('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({ currentPassword, newPassword })
    });
  };

  /**
   * Logout
   */
  const logout = async () => {
    try {
      await apiClient('/auth/logout', { method: 'POST' });
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        error,
        login,
        register,
        logout,
        updateProfile,
        changePassword,
        clearError
      }}
    >
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
