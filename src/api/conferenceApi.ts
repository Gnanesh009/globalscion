import type {
  AgendaDay,
  Category,
  Conference,
  ConferenceListItem,
  ConferenceQuery,
  GalleryImage,
  Paginated,
  PublishStatus,
} from '@/types';
import { USE_MOCK, apiClient, cleanParams } from './apiClient';
import { mock } from './mock/handlers';

export interface MenuGroup {
  category: Category;
  conferences: ConferenceListItem[];
}

export const conferenceApi = {
  list(query: ConferenceQuery = {}): Promise<Paginated<ConferenceListItem>> {
    if (USE_MOCK) return mock.listConferences(query);
    return apiClient
      .get<Paginated<ConferenceListItem>>('/conferences/', { params: cleanParams(query) })
      .then((r) => r.data);
  },

  getBySlug(slug: string): Promise<Conference> {
    if (USE_MOCK) return mock.getConferenceBySlug(slug);
    return apiClient.get<Conference>(`/conferences/${slug}/`).then((r) => r.data);
  },

  getById(id: string): Promise<Conference> {
    if (USE_MOCK) return mock.getConferenceById(id);
    return apiClient.get<Conference>(`/admin/conferences/${id}/`).then((r) => r.data);
  },

  getFeatured(): Promise<Conference | null> {
    if (USE_MOCK) return mock.getFeaturedConference();
    return apiClient.get<Conference | null>('/conferences/featured/').then((r) => r.data);
  },

  getMenuTree(): Promise<MenuGroup[]> {
    if (USE_MOCK) return mock.getMenuTree();
    return apiClient.get<MenuGroup[]>('/conferences/menu/').then((r) => r.data);
  },

  create(payload: Partial<Conference>): Promise<Conference> {
    if (USE_MOCK) return mock.createConference(payload);
    return apiClient.post<Conference>('/admin/conferences/', payload).then((r) => r.data);
  },

  update(id: string, payload: Partial<Conference>): Promise<Conference> {
    if (USE_MOCK) return mock.updateConference(id, payload);
    return apiClient.patch<Conference>(`/admin/conferences/${id}/`, payload).then((r) => r.data);
  },

  remove(id: string): Promise<{ success: boolean }> {
    if (USE_MOCK) return mock.deleteConference(id);
    return apiClient.delete(`/admin/conferences/${id}/`).then(() => ({ success: true }));
  },

  duplicate(id: string): Promise<Conference> {
    if (USE_MOCK) return mock.duplicateConference(id);
    return apiClient.post<Conference>(`/admin/conferences/${id}/duplicate/`).then((r) => r.data);
  },

  setPublishStatus(id: string, publish_status: PublishStatus): Promise<Conference> {
    if (USE_MOCK) return mock.setConferencePublishStatus(id, publish_status);
    return apiClient
      .patch<Conference>(`/admin/conferences/${id}/status/`, { publish_status })
      .then((r) => r.data);
  },

  setFeatured(id: string, is_featured: boolean): Promise<Conference> {
    if (USE_MOCK) return mock.toggleConferenceFeatured(id, is_featured);
    return apiClient
      .patch<Conference>(`/admin/conferences/${id}/featured/`, { is_featured })
      .then((r) => r.data);
  },

  getAgenda(conferenceId: string): Promise<AgendaDay[]> {
    if (USE_MOCK) return mock.getAgenda(conferenceId);
    return apiClient.get<AgendaDay[]>(`/admin/conferences/${conferenceId}/agenda/`).then((r) => r.data);
  },

  saveAgenda(conferenceId: string, agenda: AgendaDay[]): Promise<AgendaDay[]> {
    if (USE_MOCK) return mock.saveAgenda(conferenceId, agenda);
    return apiClient
      .put<AgendaDay[]>(`/admin/conferences/${conferenceId}/agenda/`, agenda)
      .then((r) => r.data);
  },

  getGallery(conferenceId: string): Promise<GalleryImage[]> {
    if (USE_MOCK) return mock.getGallery(conferenceId);
    return apiClient.get<GalleryImage[]>(`/admin/conferences/${conferenceId}/gallery/`).then((r) => r.data);
  },

  saveGallery(conferenceId: string, gallery: GalleryImage[]): Promise<GalleryImage[]> {
    if (USE_MOCK) return mock.saveGallery(conferenceId, gallery);
    return apiClient
      .put<GalleryImage[]>(`/admin/conferences/${conferenceId}/gallery/`, gallery)
      .then((r) => r.data);
  },
};
