import type {
  AbstractStatus,
  ConferenceStatus,
  PublishStatus,
  RegistrationStatus,
} from '@/types';

type Tone = 'default' | 'success' | 'warning' | 'error' | 'info' | 'primary';

export interface StatusMeta {
  label: string;
  tone: Tone;
}

const PUBLISH: Record<PublishStatus, StatusMeta> = {
  draft: { label: 'Draft', tone: 'warning' },
  published: { label: 'Published', tone: 'success' },
  archived: { label: 'Archived', tone: 'default' },
};

const CONFERENCE: Record<ConferenceStatus, StatusMeta> = {
  upcoming: { label: 'Upcoming', tone: 'info' },
  ongoing: { label: 'Live now', tone: 'success' },
  completed: { label: 'Completed', tone: 'default' },
};

const REGISTRATION: Record<RegistrationStatus, StatusMeta> = {
  pending: { label: 'Pending', tone: 'warning' },
  confirmed: { label: 'Confirmed', tone: 'success' },
  cancelled: { label: 'Cancelled', tone: 'error' },
  refunded: { label: 'Refunded', tone: 'default' },
};

const ABSTRACT: Record<AbstractStatus, StatusMeta> = {
  pending: { label: 'Pending', tone: 'warning' },
  under_review: { label: 'Under review', tone: 'info' },
  accepted: { label: 'Accepted', tone: 'success' },
  rejected: { label: 'Rejected', tone: 'error' },
};

export const publishMeta = (s: PublishStatus) => PUBLISH[s] ?? PUBLISH.draft;
export const conferenceMeta = (s: ConferenceStatus) => CONFERENCE[s] ?? CONFERENCE.upcoming;
export const registrationMeta = (s: RegistrationStatus) => REGISTRATION[s] ?? REGISTRATION.pending;
export const abstractMeta = (s: AbstractStatus) => ABSTRACT[s] ?? ABSTRACT.pending;
