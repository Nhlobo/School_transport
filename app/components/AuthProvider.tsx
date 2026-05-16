'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { SessionUser } from '@/app/lib/auth-session';

type AuthResult = {
  success: boolean;
  message: string;
};

type AuthContextValue = {
  user: SessionUser | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<AuthResult>;
  signup: (name: string, email: string, password: string) => Promise<AuthResult>;
  logout: () => Promise<AuthResult>;
  refreshSession: () => Promise<void>;
};

type AuthResponse = {
  success?: boolean;
  message?: string;
  user?: SessionUser | null;
  authenticated?: boolean;
};

const AuthContext = createContext<AuthContextValue | null>(null);

async function parseApiResponse(response: Response) {
  const data = (await response.json().catch(() => ({}))) as AuthResponse;
  return {
    ok: response.ok,
    message: data.message || (response.ok ? 'Request completed successfully.' : 'Request failed.'),
    user: data.user ?? null,
    authenticated: Boolean(data.authenticated)
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshSession = useCallback(async () => {
    try {
      const response = await fetch('/api/auth/session', { cache: 'no-store' });
      const data = await parseApiResponse(response);
      setUser(data.authenticated ? data.user : null);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshSession();
  }, [refreshSession]);

  const login = useCallback(async (email: string, password: string) => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await parseApiResponse(response);
    if (data.ok) {
      setUser(data.user);
    }
    return { success: data.ok, message: data.message };
  }, []);

  const signup = useCallback(async (name: string, email: string, password: string) => {
    const response = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });
    const data = await parseApiResponse(response);
    if (data.ok) {
      setUser(data.user);
    }
    return { success: data.ok, message: data.message };
  }, []);

  const logout = useCallback(async () => {
    const response = await fetch('/api/auth/logout', { method: 'POST' });
    const data = await parseApiResponse(response);
    if (data.ok) {
      setUser(null);
    }
    return { success: data.ok, message: data.message };
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      isAuthenticated: Boolean(user),
      login,
      signup,
      logout,
      refreshSession
    }),
    [loading, login, logout, refreshSession, signup, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
