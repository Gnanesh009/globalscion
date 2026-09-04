import type { ListParams, Paginated, Speaker } from '@/types';
import { USE_MOCK, apiClient, cleanParams } from './apiClient';
import { mock } from './mock/handlers';

export type SpeakerQuery = ListParams & { status?: string; country?: string };

export const speakerApi = {
  list(params: SpeakerQuery = {}): Promise<Paginated<Speaker>> {
    if (USE_MOCK) return mock.listSpeakers(params);
    return apiClient
      .get<Paginated<Speaker>>('/speakers/', { params: cleanParams(params) })
      .then((r) => r.data);
  },
  get(id: string): Promise<Speaker> {
    if (USE_MOCK) return mock.getSpeaker(id);
    return apiClient.get<Speaker>(`/speakers/${id}/`).then((r) => r.data);
  },
  create(payload: Omit<Speaker, 'id'>): Promise<Speaker> {
    if (USE_MOCK) return mock.createSpeaker(payload);
    return apiClient.post<Speaker>('/admin/speakers/', payload).then((r) => r.data);
  },
  update(id: string, payload: Partial<Speaker>): Promise<Speaker> {
    if (USE_MOCK) return mock.updateSpeaker(id, payload);
    return apiClient.patch<Speaker>(`/admin/speakers/${id}/`, payload).then((r) => r.data);
  },
  remove(id: string): Promise<{ success: boolean }> {
    if (USE_MOCK) return mock.deleteSpeaker(id);
    return apiClient.delete(`/admin/speakers/${id}/`).then(() => ({ success: true }));
  },
};
