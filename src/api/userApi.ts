import type { AdminUser, ListParams, Paginated } from '@/types';
import { USE_MOCK, apiClient, cleanParams } from './apiClient';
import { mock } from './mock/handlers';

export type UserQuery = ListParams & { role?: string };

export const userApi = {
  list(params: UserQuery = {}): Promise<Paginated<AdminUser>> {
    if (USE_MOCK) return mock.listUsers(params);
    return apiClient
      .get<Paginated<AdminUser>>('/admin/users/', { params: cleanParams(params) })
      .then((r) => r.data);
  },
  create(payload: Omit<AdminUser, 'id'>): Promise<AdminUser> {
    if (USE_MOCK) return mock.createUser(payload);
    return apiClient.post<AdminUser>('/admin/users/', payload).then((r) => r.data);
  },
  update(id: string, payload: Partial<AdminUser>): Promise<AdminUser> {
    if (USE_MOCK) return mock.updateUser(id, payload);
    return apiClient.patch<AdminUser>(`/admin/users/${id}/`, payload).then((r) => r.data);
  },
  remove(id: string): Promise<{ success: boolean }> {
    if (USE_MOCK) return mock.deleteUser(id);
    return apiClient.delete(`/admin/users/${id}/`).then(() => ({ success: true }));
  },
};
