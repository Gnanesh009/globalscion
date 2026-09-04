import type { ListParams, Paginated, Registration, RegistrationStatus } from '@/types';
import { USE_MOCK, apiClient, cleanParams } from './apiClient';
import { mock } from './mock/handlers';

export type RegistrationQuery = ListParams & {
  status?: string;
  conference?: string;
  type?: string;
};

export const registrationApi = {
  list(params: RegistrationQuery = {}): Promise<Paginated<Registration>> {
    if (USE_MOCK) return mock.listRegistrations(params);
    return apiClient
      .get<Paginated<Registration>>('/admin/registrations/', { params: cleanParams(params) })
      .then((r) => r.data);
  },
  updateStatus(id: string, status: RegistrationStatus): Promise<Registration> {
    if (USE_MOCK) return mock.updateRegistrationStatus(id, status);
    return apiClient
      .patch<Registration>(`/admin/registrations/${id}/`, { status })
      .then((r) => r.data);
  },
  remove(id: string): Promise<{ success: boolean }> {
    if (USE_MOCK) return mock.deleteRegistration(id);
    return apiClient.delete(`/admin/registrations/${id}/`).then(() => ({ success: true }));
  },
};
