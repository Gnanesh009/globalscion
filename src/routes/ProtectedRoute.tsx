import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/app/AuthProvider';
import { LoadingScreen } from '@/components/common/States';
import { ADMIN_PATHS } from '@/constants';
import type { UserRole } from '@/types';

interface ProtectedRouteProps {
  children: ReactNode;
  /** Minimum role required. Omit to allow any authenticated admin user. */
  roles?: UserRole[];
}

export function ProtectedRoute({ children, roles }: ProtectedRouteProps) {
  const { isAuthenticated, initialising, hasRole } = useAuth();
  const location = useLocation();

  if (initialising) return <LoadingScreen label="Restoring your session" />;

  if (!isAuthenticated) {
    const next = encodeURIComponent(`${location.pathname}${location.search}`);
    return <Navigate to={`${ADMIN_PATHS.login}?next=${next}`} replace />;
  }

  if (roles && !hasRole(roles)) return <Navigate to={ADMIN_PATHS.unauthorized} replace />;

  return <>{children}</>;
}

/** Keeps signed-in users away from the login screen. */
export function GuestRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, initialising } = useAuth();
  if (initialising) return <LoadingScreen label="Restoring your session" />;
  if (isAuthenticated) return <Navigate to={ADMIN_PATHS.dashboard} replace />;
  return <>{children}</>;
}
