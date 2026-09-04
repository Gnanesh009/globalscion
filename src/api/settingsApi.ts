import type { DashboardResponse, SiteSettings } from '@/types';
import { USE_MOCK, apiClient } from './apiClient';
import { mock } from './mock/handlers';

export const settingsApi = {
  get(): Promise<SiteSettings> {
    if (USE_MOCK) return mock.getSettings();
    return apiClient.get<SiteSettings>('/settings/').then((r) => r.data);
  },
  update(payload: Partial<SiteSettings>): Promise<SiteSettings> {
    if (USE_MOCK) return mock.updateSettings(payload);
    return apiClient.patch<SiteSettings>('/admin/settings/', payload).then((r) => r.data);
  },
  dashboard(): Promise<DashboardResponse> {
    if (USE_MOCK) return mock.getDashboard();
    return apiClient.get<DashboardResponse>('/admin/dashboard/').then((r) => r.data);
  },
};
