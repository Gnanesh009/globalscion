import dayjs from 'dayjs';
import { z } from 'zod';
import { DEFAULT_SECTIONS } from '@/api/mock/data/shared';
import type { Conference, ConferenceSectionType, Speaker, Sponsor } from '@/types';

const themeSchema = z.object({
  id: z.string(),
  title: z.string().min(3, 'Give the track a title.'),
  description: z.string().default(''),
  display_order: z.number(),
});

const sessionSchema = z.object({
  id: z.string(),
  time_start: z.string().min(1, 'Start time required.'),
  time_end: z.string().min(1, 'End time required.'),
  title: z.string().min(2, 'Session title required.'),
  description: z.string().default(''),
  session_type: z.enum(['keynote', 'panel', 'workshop', 'break', 'talk', 'poster']),
  speaker_ids: z.array(z.string()).default([]),
  display_order: z.number(),
});

const daySchema = z.object({
  id: z.string(),
  day_number: z.number(),
  date: z.string(),
  title: z.string().default(''),
  sessions: z.array(sessionSchema).default([]),
});

const gallerySchema = z.object({
  id: z.string(),
  image: z.string().min(1),
  caption: z.string().default(''),
  display_order: z.number(),
});

const faqSchema = z.object({
  id: z.string(),
  question: z.string().min(5, 'Enter the question.'),
  answer: z.string().min(5, 'Enter the answer.'),
  display_order: z.number(),
});

const sectionSchema = z.object({
  type: z.string(),
  enabled: z.boolean(),
  order: z.number(),
});

export const conferenceBuilderSchema = z.object({
  /* Step 1 — Basic information */
  title: z.string().min(6, 'Enter the full conference title.'),
  slug: z
    .string()
    .min(3, 'A URL slug is required.')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Use lowercase letters, numbers and hyphens only.'),
  category_id: z.string().min(1, 'Select a category.'),
  kind: z.enum(['conference', 'congress', 'webinar', 'symposium']),
  theme_line: z.string().default(''),
  short_description: z
    .string()
    .min(40, 'Write at least 40 characters — this appears on cards and in search results.')
    .max(320, 'Keep the summary under 320 characters.'),
  description: z.string().min(1, 'Add a description.'),

  /* Step 2 — Event details */
  start_date: z.string().min(1, 'Select a start date.'),
  end_date: z.string().min(1, 'Select an end date.'),
  timezone: z.string().min(1, 'Select a timezone.'),
  venue: z.string().default(''),
  city: z.string().default(''),
  country: z.string().default(''),
  event_format: z.enum(['online', 'physical', 'hybrid']),
  registration_deadline: z.string().default(''),
  abstract_deadline: z.string().default(''),

  /* Step 3 — Hero */
  hero_image: z.string().nullable().default(null),
  card_image: z.string().nullable().default(null),
  hero_subtitle: z.string().default(''),
  hero_cta_label: z.string().min(1, 'The hero needs a call-to-action label.'),
  hero_cta_url: z.string().default(''),
  brochure_url: z.string().nullable().default(null),

  /* Steps 4–9 */
  key_themes: z.array(themeSchema).default([]),
  speaker_ids: z.array(z.string()).default([]),
  agenda: z.array(daySchema).default([]),
  sponsor_ids: z.array(z.string()).default([]),
  gallery: z.array(gallerySchema).default([]),
  faqs: z.array(faqSchema).default([]),
  who_should_attend: z.array(z.string()).default([]),
  why_attend: z.array(z.string()).default([]),

  /* Step 10 — SEO */
  meta_title: z.string().max(70, 'Search engines truncate titles beyond about 60 characters.').default(''),
  meta_description: z
    .string()
    .max(180, 'Search engines truncate descriptions beyond about 160 characters.')
    .default(''),
  og_image: z.string().nullable().default(null),

  /* Step 11 — Page sections */
  sections: z.array(sectionSchema).default([]),

  /* Step 12 — Publishing */
  publish_status: z.enum(['draft', 'published', 'archived']),
  is_featured: z.boolean().default(false),
})
  .refine((values) => !dayjs(values.end_date).isBefore(dayjs(values.start_date), 'day'), {
    message: 'The end date cannot be before the start date.',
    path: ['end_date'],
  });

export type ConferenceFormValues = z.infer<typeof conferenceBuilderSchema>;

/** Fields validated in each step, so "Next" can block on the current step only. */
export const STEP_FIELDS: (keyof ConferenceFormValues)[][] = [
  ['title', 'slug', 'category_id', 'kind', 'short_description', 'description'],
  ['start_date', 'end_date', 'timezone', 'event_format', 'venue', 'city', 'country'],
  ['hero_image', 'hero_subtitle', 'hero_cta_label'],
  ['key_themes'],
  ['speaker_ids'],
  ['agenda'],
  ['sponsor_ids'],
  ['gallery'],
  ['faqs'],
  ['meta_title', 'meta_description'],
  ['sections'],
  ['publish_status'],
];

export const emptyConference = (): ConferenceFormValues => ({
  title: '',
  slug: '',
  category_id: '',
  kind: 'conference',
  theme_line: '',
  short_description: '',
  description: '',
  start_date: dayjs().add(120, 'day').format('YYYY-MM-DD'),
  end_date: dayjs().add(121, 'day').format('YYYY-MM-DD'),
  timezone: 'UTC',
  venue: '',
  city: '',
  country: '',
  event_format: 'hybrid',
  registration_deadline: '',
  abstract_deadline: '',
  hero_image: null,
  card_image: null,
  hero_subtitle: '',
  hero_cta_label: 'Register now',
  hero_cta_url: '',
  brochure_url: null,
  key_themes: [],
  speaker_ids: [],
  agenda: [],
  sponsor_ids: [],
  gallery: [],
  faqs: [],
  who_should_attend: [],
  why_attend: [],
  meta_title: '',
  meta_description: '',
  og_image: null,
  sections: DEFAULT_SECTIONS.map((section) => ({ ...section })),
  publish_status: 'draft',
  is_featured: false,
});

export const conferenceToForm = (conference: Conference): ConferenceFormValues => ({
  title: conference.title,
  slug: conference.slug,
  category_id: conference.category.id,
  kind: conference.kind,
  theme_line: conference.theme_line,
  short_description: conference.short_description,
  description: conference.description,
  start_date: conference.start_date,
  end_date: conference.end_date,
  timezone: conference.timezone,
  venue: conference.venue,
  city: conference.city,
  country: conference.country,
  event_format: conference.event_format,
  registration_deadline: conference.registration_deadline ?? '',
  abstract_deadline: conference.abstract_deadline ?? '',
  hero_image: conference.hero_image,
  card_image: conference.card_image,
  hero_subtitle: conference.hero_subtitle,
  hero_cta_label: conference.hero_cta_label || 'Register now',
  hero_cta_url: conference.hero_cta_url,
  brochure_url: conference.brochure_url,
  key_themes: conference.key_themes,
  speaker_ids: conference.speakers.map((speaker) => speaker.id),
  agenda: conference.agenda,
  sponsor_ids: conference.sponsors.map((sponsor) => sponsor.id),
  gallery: conference.gallery,
  faqs: conference.faqs,
  who_should_attend: conference.who_should_attend,
  why_attend: conference.why_attend,
  meta_title: conference.seo.meta_title,
  meta_description: conference.seo.meta_description,
  og_image: conference.seo.og_image,
  sections: conference.sections.map((section) => ({ ...section })),
  publish_status: conference.publish_status,
  is_featured: conference.is_featured,
});

interface ToPayloadContext {
  categories: { id: string; name: string; slug: string }[];
  speakers: Speaker[];
  sponsors: Sponsor[];
}

/** Maps builder state onto the Conference payload the API expects. */
export function formToPayload(
  values: ConferenceFormValues,
  { categories, speakers, sponsors }: ToPayloadContext,
): Partial<Conference> {
  const category = categories.find((item) => item.id === values.category_id);

  return {
    title: values.title,
    slug: values.slug,
    short_description: values.short_description,
    description: values.description,
    theme_line: values.theme_line,
    category: category ?? { id: values.category_id, name: '', slug: '' },
    kind: values.kind,
    event_format: values.event_format,
    start_date: values.start_date,
    end_date: values.end_date,
    timezone: values.timezone,
    city: values.city,
    country: values.country,
    venue: values.venue,
    hero_image: values.hero_image,
    card_image: values.card_image ?? values.hero_image,
    hero_subtitle: values.hero_subtitle,
    hero_cta_label: values.hero_cta_label,
    hero_cta_url: values.hero_cta_url,
    brochure_url: values.brochure_url,
    registration_deadline: values.registration_deadline || null,
    abstract_deadline: values.abstract_deadline || null,
    key_themes: values.key_themes,
    speakers: values.speaker_ids
      .map((id) => speakers.find((speaker) => speaker.id === id))
      .filter((speaker): speaker is Speaker => Boolean(speaker)),
    agenda: values.agenda,
    sponsors: values.sponsor_ids
      .map((id) => sponsors.find((sponsor) => sponsor.id === id))
      .filter((sponsor): sponsor is Sponsor => Boolean(sponsor)),
    gallery: values.gallery,
    faqs: values.faqs,
    who_should_attend: values.who_should_attend,
    why_attend: values.why_attend,
    sections: values.sections.map((section) => ({
      type: section.type as ConferenceSectionType,
      enabled: section.enabled,
      order: section.order,
    })),
    seo: {
      meta_title: values.meta_title || values.title,
      meta_description: values.meta_description || values.short_description,
      og_image: values.og_image ?? values.hero_image,
    },
    publish_status: values.publish_status,
    is_featured: values.is_featured,
    speaker_count: values.speaker_ids.length,
  };
}
