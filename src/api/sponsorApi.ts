import type { ListParams, Paginated, Sponsor } from '@/types';
import { USE_MOCK, apiClient, cleanParams } from './apiClient';
import { mock } from './mock/handlers';

export type SponsorQuery = ListParams & { tier?: string; status?: string };

export const sponsorApi = {
  list(params: SponsorQuery = {}): Promise<Paginated<Sponsor>> {
    if (USE_MOCK) return mock.listSponsors(params);
    return apiClient
      .get<Paginated<Sponsor>>('/sponsors/', { params: cleanParams(params) })
      .then((r) => r.data);
  },
  create(payload: Omit<Sponsor, 'id'>): Promise<Sponsor> {
    if (USE_MOCK) return mock.createSponsor(payload);
    return apiClient.post<Sponsor>('/admin/sponsors/', payload).then((r) => r.data);
  },
  update(id: string, payload: Partial<Sponsor>): Promise<Sponsor> {
    if (USE_MOCK) return mock.updateSponsor(id, payload);
    return apiClient.patch<Sponsor>(`/admin/sponsors/${id}/`, payload).then((r) => r.data);
  },
  remove(id: string): Promise<{ success: boolean }> {
    if (USE_MOCK) return mock.deleteSponsor(id);
    return apiClient.delete(`/admin/sponsors/${id}/`).then(() => ({ success: true }));
  },
};
