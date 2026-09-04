import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { authApi } from '@/api/authApi';
import { SESSION_EXPIRED_EVENT } from '@/api/apiClient';
import { STORAGE_KEYS } from '@/constants';
import type { AdminUser, LoginPayload, UserRole } from '@/types';
import { storage } from '@/utils/storage';

interface AuthContextValue {
  user: AdminUser | null;
  isAuthenticated: boolean;
  /** True while the persisted session is being restored on first paint. */
  initialising: boolean;
  sessionExpired: boolean;
  login: (payload: LoginPayload) => Promise<AdminUser>;
  logout: () => void;
  dismissSessionExpiry: () => void;
  hasRole: (roles: UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

/** Role hierarchy — a super admin satisfies every lower requirement. */
const ROLE_RANK: Record<UserRole, number> = { editor: 1, admin: 2, super_admin: 3 };

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(() =>
    storage.get<AdminUser | null>(STORAGE_KEYS.user, null),
  );
  const [initialising, setInitialising] = useState(true);
  const [sessionExpired, setSessionExpired] = useState(false);

  useEffect(() => {
    const token = storage.get<string | null>(STORAGE_KEYS.accessToken, null);
    if (!token) setUser(null);
    setInitialising(false);
  }, []);

  useEffect(() => {
    const onExpired = () => {
      setSessionExpired(true);
      setUser(null);
      storage.remove(STORAGE_KEYS.user);
    };
    window.addEventListener(SESSION_EXPIRED_EVENT, onExpired);
    return () => window.removeEventListener(SESSION_EXPIRED_EVENT, onExpired);
  }, []);

  const login = useCallback(async (payload: LoginPayload) => {
    const response = await authApi.login(payload);
    storage.set(STORAGE_KEYS.accessToken, response.access);
    storage.set(STORAGE_KEYS.refreshToken, response.refresh);
    storage.set(STORAGE_KEYS.user, response.user);
    setUser(response.user);
    setSessionExpired(false);
    return response.user;
  }, []);

  const logout = useCallback(() => {
    void authApi.logout(storage.get<string | null>(STORAGE_KEYS.refreshToken, null));
    storage.remove(STORAGE_KEYS.accessToken);
    storage.remove(STORAGE_KEYS.refreshToken);
    storage.remove(STORAGE_KEYS.user);
    setUser(null);
  }, []);

  const hasRole = useCallback(
    (roles: UserRole[]) => {
      if (!user) return false;
      if (!roles.length) return true;
      const required = Math.min(...roles.map((role) => ROLE_RANK[role]));
      return ROLE_RANK[user.role] >= required;
    },
    [user],
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      initialising,
      sessionExpired,
      login,
      logout,
      dismissSessionExpiry: () => setSessionExpired(false),
      hasRole,
    }),
    [user, initialising, sessionExpired, login, logout, hasRole],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside <AuthProvider>.');
  return context;
}
