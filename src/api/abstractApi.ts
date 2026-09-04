import type { AbstractStatus, AbstractSubmission, ListParams, Paginated } from '@/types';
import { USE_MOCK, apiClient, cleanParams } from './apiClient';
import { mock } from './mock/handlers';

export type AbstractQuery = ListParams & { status?: string; conference?: string };

export const abstractApi = {
  list(params: AbstractQuery = {}): Promise<Paginated<AbstractSubmission>> {
    if (USE_MOCK) return mock.listAbstracts(params);
    return apiClient
      .get<Paginated<AbstractSubmission>>('/admin/abstracts/', { params: cleanParams(params) })
      .then((r) => r.data);
  },
  updateStatus(id: string, status: AbstractStatus): Promise<AbstractSubmission> {
    if (USE_MOCK) return mock.updateAbstractStatus(id, status);
    return apiClient
      .patch<AbstractSubmission>(`/admin/abstracts/${id}/`, { status })
      .then((r) => r.data);
  },
  remove(id: string): Promise<{ success: boolean }> {
    if (USE_MOCK) return mock.deleteAbstract(id);
    return apiClient.delete(`/admin/abstracts/${id}/`).then(() => ({ success: true }));
  },
  /** Public submission from the conference details page. */
  submit(payload: Partial<AbstractSubmission>): Promise<AbstractSubmission> {
    if (USE_MOCK) return mock.submitAbstract(payload);
    return apiClient.post<AbstractSubmission>('/abstracts/', payload).then((r) => r.data);
  },
};
