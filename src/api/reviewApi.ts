import type { ListParams, Paginated, Review } from '@/types';
import { USE_MOCK, apiClient, cleanParams } from './apiClient';
import { mock } from './mock/handlers';

export type ReviewQuery = ListParams & { status?: string; rating?: number };

export const reviewApi = {
  list(params: ReviewQuery = {}): Promise<Paginated<Review>> {
    if (USE_MOCK) return mock.listReviews(params);
    return apiClient
      .get<Paginated<Review>>('/reviews/', { params: cleanParams(params) })
      .then((r) => r.data);
  },
  create(payload: Omit<Review, 'id'>): Promise<Review> {
    if (USE_MOCK) return mock.createReview(payload);
    return apiClient.post<Review>('/admin/reviews/', payload).then((r) => r.data);
  },
  update(id: string, payload: Partial<Review>): Promise<Review> {
    if (USE_MOCK) return mock.updateReview(id, payload);
    return apiClient.patch<Review>(`/admin/reviews/${id}/`, payload).then((r) => r.data);
  },
  remove(id: string): Promise<{ success: boolean }> {
    if (USE_MOCK) return mock.deleteReview(id);
    return apiClient.delete(`/admin/reviews/${id}/`).then(() => ({ success: true }));
  },
};
