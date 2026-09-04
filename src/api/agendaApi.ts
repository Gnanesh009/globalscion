import type { AgendaDay } from '@/types';
import { conferenceApi } from './conferenceApi';

/**
 * The agenda is always scoped to a conference, so this module is a thin,
 * intention-revealing facade over the conference endpoints.
 */
export const agendaApi = {
  get: (conferenceId: string): Promise<AgendaDay[]> => conferenceApi.getAgenda(conferenceId),
  save: (conferenceId: string, agenda: AgendaDay[]): Promise<AgendaDay[]> =>
    conferenceApi.saveAgenda(conferenceId, agenda),
};
