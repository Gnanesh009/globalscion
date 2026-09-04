import type { ContactMessage, SitePage } from '@/types';
import { USE_MOCK, apiClient } from './apiClient';
import { mock } from './mock/handlers';

export const pageApi = {
  list(): Promise<SitePage[]> {
    if (USE_MOCK) return mock.listPages();
    return apiClient.get<SitePage[]>('/pages/').then((r) => r.data);
  },
  get(slug: SitePage['slug']): Promise<SitePage> {
    if (USE_MOCK) return mock.getPage(slug);
    return apiClient.get<SitePage>(`/pages/${slug}/`).then((r) => r.data);
  },
  update(id: string, payload: Partial<SitePage>): Promise<SitePage> {
    if (USE_MOCK) return mock.updatePage(id, payload);
    return apiClient.patch<SitePage>(`/admin/pages/${id}/`, payload).then((r) => r.data);
  },
  submitContact(payload: ContactMessage): Promise<{ success: boolean; message?: string }> {
    if (USE_MOCK) return mock.submitContact(payload);
    return apiClient.post('/contact/', payload).then((r) => r.data);
  },
  subscribe(email: string): Promise<{ success: boolean }> {
    if (USE_MOCK) return mock.subscribe(email);
    return apiClient.post('/newsletter/', { email }).then((r) => r.data);
  },
};
