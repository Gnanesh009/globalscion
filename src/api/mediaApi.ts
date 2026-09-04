import type { ListParams, MediaAsset, Paginated } from '@/types';
import { USE_MOCK, apiClient, cleanParams } from './apiClient';
import { mock } from './mock/handlers';

export type MediaQuery = ListParams & { type?: string };

export const mediaApi = {
  list(params: MediaQuery = {}): Promise<Paginated<MediaAsset>> {
    if (USE_MOCK) return mock.listMedia(params);
    return apiClient
      .get<Paginated<MediaAsset>>('/admin/media/', { params: cleanParams(params) })
      .then((r) => r.data);
  },

  /**
   * Uploads through multipart/form-data. Binary never lives in the frontend —
   * the backend stores the file and returns the canonical URL.
   */
  upload(file: File, onProgress?: (percent: number) => void): Promise<MediaAsset> {
    if (USE_MOCK) {
      return mock.uploadMedia({
        name: file.name,
        size: file.size,
        type: file.type,
        previewUrl: URL.createObjectURL(file),
      });
    }
    const form = new FormData();
    form.append('file', file);
    return apiClient
      .post<MediaAsset>('/admin/media/', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (event) => {
          if (onProgress && event.total) onProgress(Math.round((event.loaded / event.total) * 100));
        },
      })
      .then((r) => r.data);
  },

  update(id: string, payload: Partial<MediaAsset>): Promise<MediaAsset> {
    if (USE_MOCK) return mock.updateMedia(id, payload);
    return apiClient.patch<MediaAsset>(`/admin/media/${id}/`, payload).then((r) => r.data);
  },

  remove(id: string): Promise<{ success: boolean }> {
    if (USE_MOCK) return mock.deleteMedia(id);
    return apiClient.delete(`/admin/media/${id}/`).then(() => ({ success: true }));
  },
};
