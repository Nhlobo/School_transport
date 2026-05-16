'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { AuthUser } from '@/app/lib/auth-server';

type AuthResult = {
  success: boolean;
  message: string;
};

type AuthResponse = {
  success?: boolean;
  message?: string;
  user?: AuthUser | null;
  authenticated?: boolean;
};

type AuthContextValue = {
  user: AuthUser | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (southAfricanId: string, password: string) => Promise<AuthResult>;
  register: (payload: {
    role: 'parent' | 'driver';
    fullName: string;
    southAfricanId: string;
    phoneNumber: string;
    pdpLicenseNumber?: string;
    password: string;
    confirmPassword: string;
  }) => Promise<AuthResult>;
  logout: () => Promise<AuthResult>;
  refreshSession: () => Promise<void>;
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
  const [user, setUser] = useState<AuthUser | null>(null);
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

  const login = useCallback(async (southAfricanId: string, password: string) => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ southAfricanId, password })
    });

    const data = await parseApiResponse(response);
    if (data.ok) {
      setUser(data.user);
    }

    return { success: data.ok, message: data.message };
  }, []);

  const register = useCallback(async (payload: AuthContextValue['register'] extends (arg: infer T) => Promise<AuthResult> ? T : never) => {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await parseApiResponse(response);
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
      register,
      logout,
      refreshSession
    }),
    [loading, login, logout, refreshSession, register, user]
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
