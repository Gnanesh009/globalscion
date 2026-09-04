import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { conferenceApi } from '@/api/conferenceApi';
import type { AgendaDay, Conference, ConferenceQuery, PublishStatus } from '@/types';
import { queryKeys } from './queryKeys';

export const useConferences = (query: ConferenceQuery = {}) =>
  useQuery({
    queryKey: queryKeys.conferences.list(query),
    queryFn: () => conferenceApi.list(query),
    placeholderData: (previous) => previous,
  });

export const useConference = (slug: string | undefined) =>
  useQuery({
    queryKey: queryKeys.conferences.detail(slug ?? ''),
    queryFn: () => conferenceApi.getBySlug(slug!),
    enabled: Boolean(slug),
    retry: (failureCount, error) => {
      const status = (error as { status?: number } | undefined)?.status;
      return status === 404 ? false : failureCount < 2;
    },
  });

export const useConferenceById = (id: string | undefined) =>
  useQuery({
    queryKey: queryKeys.conferences.byId(id ?? ''),
    queryFn: () => conferenceApi.getById(id!),
    enabled: Boolean(id),
  });

export const useFeaturedConference = () =>
  useQuery({ queryKey: queryKeys.conferences.featured, queryFn: conferenceApi.getFeatured });

export const useConferenceMenu = () =>
  useQuery({
    queryKey: queryKeys.conferences.menu,
    queryFn: conferenceApi.getMenuTree,
    staleTime: 10 * 60 * 1000,
  });

export function useConferenceMutations() {
  const qc = useQueryClient();
  const invalidate = () => {
    void qc.invalidateQueries({ queryKey: queryKeys.conferences.all });
    void qc.invalidateQueries({ queryKey: queryKeys.dashboard });
  };

  return {
    create: useMutation({
      mutationFn: (payload: Partial<Conference>) => conferenceApi.create(payload),
      onSuccess: invalidate,
    }),
    update: useMutation({
      mutationFn: ({ id, payload }: { id: string; payload: Partial<Conference> }) =>
        conferenceApi.update(id, payload),
      onSuccess: invalidate,
    }),
    remove: useMutation({ mutationFn: (id: string) => conferenceApi.remove(id), onSuccess: invalidate }),
    duplicate: useMutation({ mutationFn: (id: string) => conferenceApi.duplicate(id), onSuccess: invalidate }),
    setStatus: useMutation({
      mutationFn: ({ id, status }: { id: string; status: PublishStatus }) =>
        conferenceApi.setPublishStatus(id, status),
      onSuccess: invalidate,
    }),
    setFeatured: useMutation({
      mutationFn: ({ id, featured }: { id: string; featured: boolean }) =>
        conferenceApi.setFeatured(id, featured),
      onSuccess: invalidate,
    }),
    saveAgenda: useMutation({
      mutationFn: ({ id, agenda }: { id: string; agenda: AgendaDay[] }) =>
        conferenceApi.saveAgenda(id, agenda),
      onSuccess: invalidate,
    }),
  };
}
