import type { AdminUser, LoginPayload, LoginResponse } from '@/types';
import { USE_MOCK, apiClient } from './apiClient';
import { mock } from './mock/handlers';

export const authApi = {
  /** Django SimpleJWT: POST /auth/login/ → { access, refresh, user } */
  login(payload: LoginPayload): Promise<LoginResponse> {
    if (USE_MOCK) return mock.login(payload);
    return apiClient.post<LoginResponse>('/auth/login/', payload).then((r) => r.data);
  },
  me(): Promise<AdminUser> {
    if (USE_MOCK) return mock.me();
    return apiClient.get<AdminUser>('/auth/me/').then((r) => r.data);
  },
  refresh(refresh: string): Promise<{ access: string }> {
    if (USE_MOCK) return mock.refresh(refresh);
    return apiClient.post<{ access: string }>('/auth/refresh/', { refresh }).then((r) => r.data);
  },
  logout(refresh: string | null): Promise<void> {
    if (USE_MOCK || !refresh) return Promise.resolve();
    return apiClient.post('/auth/logout/', { refresh }).then(() => undefined);
  },
  forgotPassword(email: string): Promise<{ success: boolean }> {
    if (USE_MOCK) return mock.forgotPassword(email);
    return apiClient.post('/auth/password-reset/', { email }).then((r) => r.data);
  },
  resetPassword(payload: { token: string; uid: string; password: string }): Promise<{ success: boolean }> {
    if (USE_MOCK) return mock.resetPassword(payload.password);
    return apiClient.post('/auth/password-reset/confirm/', payload).then((r) => r.data);
  },
};
