import axios, { AxiosError, type AxiosInstance, type InternalAxiosRequestConfig } from 'axios';
import type { ApiError, ApiFieldErrors } from '@/types';
import { STORAGE_KEYS } from '@/constants';
import { storage } from '@/utils/storage';

export const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false';
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api/v1';
export const SITE_URL = import.meta.env.VITE_SITE_URL ?? window.location.origin;

/** Broadcast when the refresh token is rejected, so the auth layer can sign out. */
export const SESSION_EXPIRED_EVENT = 'globalscion:session-expired';

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 20_000,
  headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
});

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = storage.get<string | null>(STORAGE_KEYS.accessToken, null);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

let refreshPromise: Promise<string> | null = null;

async function refreshAccessToken(): Promise<string> {
  const refresh = storage.get<string | null>(STORAGE_KEYS.refreshToken, null);
  if (!refresh) throw new Error('No refresh token');
  const { data } = await axios.post<{ access: string }>(`${API_BASE_URL}/auth/refresh/`, { refresh });
  storage.set(STORAGE_KEYS.accessToken, data.access);
  return data.access;
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as InternalAxiosRequestConfig & { _retried?: boolean };
    const isAuthEndpoint = original?.url?.includes('/auth/');

    if (error.response?.status === 401 && original && !original._retried && !isAuthEndpoint) {
      original._retried = true;
      try {
        refreshPromise = refreshPromise ?? refreshAccessToken().finally(() => (refreshPromise = null));
        const token = await refreshPromise;
        original.headers.Authorization = `Bearer ${token}`;
        return apiClient(original);
      } catch {
        storage.remove(STORAGE_KEYS.accessToken);
        storage.remove(STORAGE_KEYS.refreshToken);
        window.dispatchEvent(new CustomEvent(SESSION_EXPIRED_EVENT));
      }
    }
    return Promise.reject(error);
  },
);

/** Normalises axios errors and mock errors into one shape the UI can render. */
export function toApiError(error: unknown): ApiError {
  if (error && typeof error === 'object' && 'status' in error && 'message' in error) {
    const mockError = error as { status: number; message: string; fieldErrors?: ApiFieldErrors };
    if (typeof mockError.status === 'number') {
      return { status: mockError.status, message: mockError.message, fieldErrors: mockError.fieldErrors };
    }
  }

  if (axios.isAxiosError(error)) {
    const data = error.response?.data as Record<string, unknown> | undefined;
    const detail =
      (typeof data?.detail === 'string' && data.detail) ||
      (typeof data?.message === 'string' && data.message) ||
      undefined;

    const fieldErrors: ApiFieldErrors = {};
    if (data && !detail) {
      for (const [key, value] of Object.entries(data)) {
        if (Array.isArray(value)) fieldErrors[key] = value.map(String);
      }
    }

    return {
      status: error.response?.status ?? 0,
      message:
        detail ??
        (error.code === 'ECONNABORTED'
          ? 'The request timed out. Please try again.'
          : error.response
            ? 'Something went wrong while contacting the server.'
            : 'Unable to reach the server. Check your connection and try again.'),
      fieldErrors: Object.keys(fieldErrors).length ? fieldErrors : undefined,
    };
  }

  return { status: 0, message: error instanceof Error ? error.message : 'An unexpected error occurred.' };
}

export const getErrorMessage = (error: unknown) => toApiError(error).message;

/** Strips undefined values so axios never serialises `?status=undefined`. */
export const cleanParams = <T extends object>(params: T) =>
  Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== undefined && value !== '' && value !== 'all'),
  );
