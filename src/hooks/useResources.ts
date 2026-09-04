import { useMutation, useQuery, useQueryClient, type QueryKey } from '@tanstack/react-query';
import { abstractApi, type AbstractQuery } from '@/api/abstractApi';
import { categoryApi } from '@/api/categoryApi';
import { mediaApi, type MediaQuery } from '@/api/mediaApi';
import { pageApi } from '@/api/pageApi';
import { registrationApi, type RegistrationQuery } from '@/api/registrationApi';
import { reviewApi, type ReviewQuery } from '@/api/reviewApi';
import { settingsApi } from '@/api/settingsApi';
import { speakerApi, type SpeakerQuery } from '@/api/speakerApi';
import { sponsorApi, type SponsorQuery } from '@/api/sponsorApi';
import { userApi, type UserQuery } from '@/api/userApi';
import type {
  AbstractStatus,
  AdminUser,
  Category,
  ListParams,
  RegistrationStatus,
  Review,
  SitePage,
  SiteSettings,
  Speaker,
  Sponsor,
} from '@/types';
import { queryKeys } from './queryKeys';

/** Shared invalidation helper so every mutation refreshes its own list + dashboard. */
function useInvalidate(keys: QueryKey[]) {
  const qc = useQueryClient();
  return () => {
    keys.forEach((key) => void qc.invalidateQueries({ queryKey: key }));
    void qc.invalidateQueries({ queryKey: queryKeys.dashboard });
  };
}

/* --- Categories ----------------------------------------------------- */
export const useCategories = (params: ListParams = {}) =>
  useQuery({
    queryKey: queryKeys.categories.list(params),
    queryFn: () => categoryApi.list(params),
    staleTime: 5 * 60 * 1000,
  });

export function useCategoryMutations() {
  const invalidate = useInvalidate([queryKeys.categories.all, queryKeys.conferences.all]);
  return {
    create: useMutation({ mutationFn: (p: Omit<Category, 'id'>) => categoryApi.create(p), onSuccess: invalidate }),
    update: useMutation({
      mutationFn: ({ id, payload }: { id: string; payload: Partial<Category> }) => categoryApi.update(id, payload),
      onSuccess: invalidate,
    }),
    remove: useMutation({ mutationFn: (id: string) => categoryApi.remove(id), onSuccess: invalidate }),
  };
}

/* --- Speakers -------------------------------------------------------- */
export const useSpeakers = (params: SpeakerQuery = {}) =>
  useQuery({
    queryKey: queryKeys.speakers.list(params),
    queryFn: () => speakerApi.list(params),
    placeholderData: (previous) => previous,
  });

export function useSpeakerMutations() {
  const invalidate = useInvalidate([queryKeys.speakers.all, queryKeys.conferences.all]);
  return {
    create: useMutation({ mutationFn: (p: Omit<Speaker, 'id'>) => speakerApi.create(p), onSuccess: invalidate }),
    update: useMutation({
      mutationFn: ({ id, payload }: { id: string; payload: Partial<Speaker> }) => speakerApi.update(id, payload),
      onSuccess: invalidate,
    }),
    remove: useMutation({ mutationFn: (id: string) => speakerApi.remove(id), onSuccess: invalidate }),
  };
}

/* --- Sponsors --------------------------------------------------------- */
export const useSponsors = (params: SponsorQuery = {}) =>
  useQuery({
    queryKey: queryKeys.sponsors.list(params),
    queryFn: () => sponsorApi.list(params),
    placeholderData: (previous) => previous,
  });

export function useSponsorMutations() {
  const invalidate = useInvalidate([queryKeys.sponsors.all, queryKeys.conferences.all]);
  return {
    create: useMutation({ mutationFn: (p: Omit<Sponsor, 'id'>) => sponsorApi.create(p), onSuccess: invalidate }),
    update: useMutation({
      mutationFn: ({ id, payload }: { id: string; payload: Partial<Sponsor> }) => sponsorApi.update(id, payload),
      onSuccess: invalidate,
    }),
    remove: useMutation({ mutationFn: (id: string) => sponsorApi.remove(id), onSuccess: invalidate }),
  };
}

/* --- Reviews ---------------------------------------------------------- */
export const useReviews = (params: ReviewQuery = {}) =>
  useQuery({
    queryKey: queryKeys.reviews.list(params),
    queryFn: () => reviewApi.list(params),
    placeholderData: (previous) => previous,
  });

export function useReviewMutations() {
  const invalidate = useInvalidate([queryKeys.reviews.all]);
  return {
    create: useMutation({ mutationFn: (p: Omit<Review, 'id'>) => reviewApi.create(p), onSuccess: invalidate }),
    update: useMutation({
      mutationFn: ({ id, payload }: { id: string; payload: Partial<Review> }) => reviewApi.update(id, payload),
      onSuccess: invalidate,
    }),
    remove: useMutation({ mutationFn: (id: string) => reviewApi.remove(id), onSuccess: invalidate }),
  };
}

/* --- Registrations ------------------------------------------------------ */
export const useRegistrations = (params: RegistrationQuery = {}) =>
  useQuery({
    queryKey: queryKeys.registrations.list(params),
    queryFn: () => registrationApi.list(params),
    placeholderData: (previous) => previous,
  });

export function useRegistrationMutations() {
  const invalidate = useInvalidate([queryKeys.registrations.all]);
  return {
    updateStatus: useMutation({
      mutationFn: ({ id, status }: { id: string; status: RegistrationStatus }) =>
        registrationApi.updateStatus(id, status),
      onSuccess: invalidate,
    }),
    remove: useMutation({ mutationFn: (id: string) => registrationApi.remove(id), onSuccess: invalidate }),
  };
}

/* --- Abstracts ----------------------------------------------------------- */
export const useAbstracts = (params: AbstractQuery = {}) =>
  useQuery({
    queryKey: queryKeys.abstracts.list(params),
    queryFn: () => abstractApi.list(params),
    placeholderData: (previous) => previous,
  });

export function useAbstractMutations() {
  const invalidate = useInvalidate([queryKeys.abstracts.all]);
  return {
    updateStatus: useMutation({
      mutationFn: ({ id, status }: { id: string; status: AbstractStatus }) =>
        abstractApi.updateStatus(id, status),
      onSuccess: invalidate,
    }),
    remove: useMutation({ mutationFn: (id: string) => abstractApi.remove(id), onSuccess: invalidate }),
  };
}

/* --- Media ---------------------------------------------------------------- */
export const useMediaLibrary = (params: MediaQuery = {}) =>
  useQuery({
    queryKey: queryKeys.media.list(params),
    queryFn: () => mediaApi.list(params),
    placeholderData: (previous) => previous,
  });

export function useMediaMutations() {
  const invalidate = useInvalidate([queryKeys.media.all]);
  return {
    upload: useMutation({ mutationFn: (file: File) => mediaApi.upload(file), onSuccess: invalidate }),
    remove: useMutation({ mutationFn: (id: string) => mediaApi.remove(id), onSuccess: invalidate }),
  };
}

/* --- Pages ----------------------------------------------------------------- */
export const usePages = () => useQuery({ queryKey: queryKeys.pages.all, queryFn: pageApi.list });

export const usePage = (slug: SitePage['slug']) =>
  useQuery({ queryKey: queryKeys.pages.detail(slug), queryFn: () => pageApi.get(slug) });

export function usePageMutations() {
  const invalidate = useInvalidate([queryKeys.pages.all]);
  return {
    update: useMutation({
      mutationFn: ({ id, payload }: { id: string; payload: Partial<SitePage> }) => pageApi.update(id, payload),
      onSuccess: invalidate,
    }),
  };
}

/* --- Users ------------------------------------------------------------------ */
export const useUsers = (params: UserQuery = {}) =>
  useQuery({
    queryKey: queryKeys.users.list(params),
    queryFn: () => userApi.list(params),
    placeholderData: (previous) => previous,
  });

export function useUserMutations() {
  const invalidate = useInvalidate([queryKeys.users.all]);
  return {
    create: useMutation({ mutationFn: (p: Omit<AdminUser, 'id'>) => userApi.create(p), onSuccess: invalidate }),
    update: useMutation({
      mutationFn: ({ id, payload }: { id: string; payload: Partial<AdminUser> }) => userApi.update(id, payload),
      onSuccess: invalidate,
    }),
    remove: useMutation({ mutationFn: (id: string) => userApi.remove(id), onSuccess: invalidate }),
  };
}

/* --- Settings & dashboard ---------------------------------------------------- */
export const useSettings = () =>
  useQuery({ queryKey: queryKeys.settings, queryFn: settingsApi.get, staleTime: 15 * 60 * 1000 });

export function useSettingsMutation() {
  const invalidate = useInvalidate([queryKeys.settings]);
  return useMutation({ mutationFn: (p: Partial<SiteSettings>) => settingsApi.update(p), onSuccess: invalidate });
}

export const useDashboard = () =>
  useQuery({ queryKey: queryKeys.dashboard, queryFn: settingsApi.dashboard });
