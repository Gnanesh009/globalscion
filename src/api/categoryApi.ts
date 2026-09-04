import type { Category, ListParams, Paginated } from '@/types';
import { USE_MOCK, apiClient, cleanParams } from './apiClient';
import { mock } from './mock/handlers';

export const categoryApi = {
  list(params: ListParams = {}): Promise<Paginated<Category>> {
    if (USE_MOCK) return mock.listCategories(params);
    return apiClient
      .get<Paginated<Category>>('/categories/', { params: cleanParams(params) })
      .then((r) => r.data);
  },
  create(payload: Omit<Category, 'id'>): Promise<Category> {
    if (USE_MOCK) return mock.createCategory(payload);
    return apiClient.post<Category>('/admin/categories/', payload).then((r) => r.data);
  },
  update(id: string, payload: Partial<Category>): Promise<Category> {
    if (USE_MOCK) return mock.updateCategory(id, payload);
    return apiClient.patch<Category>(`/admin/categories/${id}/`, payload).then((r) => r.data);
  },
  remove(id: string): Promise<{ success: boolean }> {
    if (USE_MOCK) return mock.deleteCategory(id);
    return apiClient.delete(`/admin/categories/${id}/`).then(() => ({ success: true }));
  },
};
