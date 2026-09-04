import dayjs from 'dayjs';
import type {
  AbstractStatus,
  AbstractSubmission,
  ActivityEntry,
  AdminUser,
  Category,
  Conference,
  ConferenceListItem,
  ConferenceQuery,
  ContactMessage,
  DashboardResponse,
  ListParams,
  LoginPayload,
  LoginResponse,
  MediaAsset,
  Paginated,
  Registration,
  RegistrationStatus,
  Review,
  SitePage,
  SiteSettings,
  Speaker,
  Sponsor,
} from '@/types';
import { slugify } from '@/utils/format';
import { DEFAULT_SECTIONS } from './data/shared';
import { db, nextId } from './db';
import { matchesSearch, paginate, reject, respond, sortBy } from './helpers';

/* ------------------------------------------------------------------ */
/* Conferences                                                         */
/* ------------------------------------------------------------------ */

const toListItem = (c: Conference): ConferenceListItem => ({
  id: c.id,
  slug: c.slug,
  title: c.title,
  short_description: c.short_description,
  category: c.category,
  kind: c.kind,
  event_format: c.event_format,
  start_date: c.start_date,
  end_date: c.end_date,
  timezone: c.timezone,
  city: c.city,
  country: c.country,
  venue: c.venue,
  hero_image: c.hero_image,
  card_image: c.card_image,
  status: c.status,
  publish_status: c.publish_status,
  is_featured: c.is_featured,
  speaker_count: c.speakers.length,
  updated_at: c.updated_at,
});

function filterConferences(query: ConferenceQuery = {}): Conference[] {
  const {
    search,
    category,
    status = 'all',
    kind = 'all',
    format = 'all',
    publish_status = 'published',
    date_from,
    date_to,
    featured,
  } = query;

  const filtered = db.conferences.filter((c) => {
    if (publish_status !== 'all' && c.publish_status !== publish_status) return false;
    if (status !== 'all' && c.status !== status) return false;
    if (kind !== 'all' && c.kind !== kind) return false;
    if (format !== 'all' && c.event_format !== format) return false;
    if (category && category !== 'all' && c.category.slug !== category && c.category.id !== category) return false;
    if (featured !== undefined && c.is_featured !== featured) return false;
    if (date_from && dayjs(c.end_date).isBefore(dayjs(date_from), 'day')) return false;
    if (date_to && dayjs(c.start_date).isAfter(dayjs(date_to), 'day')) return false;
    return matchesSearch(search, c.title, c.short_description, c.city, c.country, c.category.name, c.theme_line);
  });

  if (query.ordering) return sortBy(filtered, query.ordering);

  // Default: soonest upcoming first, completed events last.
  return [...filtered].sort((a, b) => {
    const rank = (c: Conference) => (c.status === 'completed' ? 1 : 0);
    if (rank(a) !== rank(b)) return rank(a) - rank(b);
    return rank(a) === 1
      ? b.start_date.localeCompare(a.start_date)
      : a.start_date.localeCompare(b.start_date);
  });
}

const touch = (c: Conference) => {
  c.updated_at = new Date().toISOString();
  return c;
};

function pushActivity(entry: Omit<ActivityEntry, 'id' | 'created_at'>) {
  activityLog.unshift({ ...entry, id: nextId('act'), created_at: new Date().toISOString() });
  activityLog.splice(40);
}

/* ------------------------------------------------------------------ */
/* Activity feed                                                       */
/* ------------------------------------------------------------------ */

const activityLog: ActivityEntry[] = [
  { id: 'act-1', actor: 'Alexandra Hart', action: 'published', target: 'World Congress on Autism Research, Neurodiversity & Brain Health', target_type: 'conference', created_at: dayjs().subtract(3, 'hour').toISOString() },
  { id: 'act-2', actor: 'Priya Venkatesan', action: 'updated the agenda for', target: 'International Conference on Autism Research and Innovations', target_type: 'conference', created_at: dayjs().subtract(7, 'hour').toISOString() },
  { id: 'act-3', actor: 'Daniel Osei', action: 'approved abstract', target: 'Federated learning for multi-centre diagnostic model training', target_type: 'abstract', created_at: dayjs().subtract(11, 'hour').toISOString() },
  { id: 'act-4', actor: 'Marek Kowalski', action: 'added speaker', target: 'Prof. Anneke van der Berg', target_type: 'speaker', created_at: dayjs().subtract(1, 'day').toISOString() },
  { id: 'act-5', actor: 'Alexandra Hart', action: 'published review from', target: 'Dr. Marion Kessler', target_type: 'review', created_at: dayjs().subtract(1, 'day').subtract(4, 'hour').toISOString() },
  { id: 'act-6', actor: 'Priya Venkatesan', action: 'created draft', target: 'World Congress on Global Public Health & Epidemiology', target_type: 'conference', created_at: dayjs().subtract(2, 'day').toISOString() },
  { id: 'act-7', actor: 'Daniel Osei', action: 'confirmed registration for', target: 'Aisha Okafor', target_type: 'registration', created_at: dayjs().subtract(2, 'day').subtract(5, 'hour').toISOString() },
  { id: 'act-8', actor: 'Alexandra Hart', action: 'updated', target: 'Global Privacy Policy', target_type: 'page', created_at: dayjs().subtract(3, 'day').toISOString() },
];

/* ------------------------------------------------------------------ */
/* Generic CRUD helper                                                 */
/* ------------------------------------------------------------------ */

function crud<T extends { id: string }>(collection: () => T[], prefix: string) {
  return {
    create: (payload: Omit<T, 'id'>) => {
      const record = { ...payload, id: nextId(prefix) } as T;
      collection().unshift(record);
      return respond(record);
    },
    update: (id: string, payload: Partial<T>) => {
      const index = collection().findIndex((item) => item.id === id);
      if (index === -1) return reject(404, 'Record not found.');
      collection()[index] = { ...collection()[index], ...payload };
      return respond(collection()[index]);
    },
    remove: (id: string) => {
      const index = collection().findIndex((item) => item.id === id);
      if (index === -1) return reject(404, 'Record not found.');
      collection().splice(index, 1);
      return respond({ success: true });
    },
  };
}

/* ------------------------------------------------------------------ */
/* Handlers                                                            */
/* ------------------------------------------------------------------ */

export const mock = {
  /* --- Conferences ------------------------------------------------ */
  listConferences(query: ConferenceQuery = {}): Promise<Paginated<ConferenceListItem>> {
    const filtered = filterConferences(query);
    return respond(paginate(filtered.map(toListItem), query.page ?? 1, query.page_size ?? 9));
  },

  getConferenceBySlug(slug: string): Promise<Conference> {
    const found = db.conferences.find((c) => c.slug === slug);
    if (!found) return reject(404, 'This conference could not be found.');
    return respond(found, 320, 700);
  },

  getConferenceById(id: string): Promise<Conference> {
    const found = db.conferences.find((c) => c.id === id);
    if (!found) return reject(404, 'This conference could not be found.');
    return respond(found);
  },

  getFeaturedConference(): Promise<Conference | null> {
    const featured =
      db.conferences.find((c) => c.is_featured && c.publish_status === 'published' && c.status !== 'completed') ??
      db.conferences.find((c) => c.publish_status === 'published' && c.status === 'upcoming') ??
      null;
    return respond(featured);
  },

  /** Powers the header mega menu: published conferences grouped by category. */
  getMenuTree(): Promise<{ category: Category; conferences: ConferenceListItem[] }[]> {
    const tree = db.categories
      .filter((c) => c.status === 'published')
      .sort((a, b) => a.display_order - b.display_order)
      .map((category) => ({
        category: {
          ...category,
          conference_count: db.conferences.filter(
            (c) => c.category.id === category.id && c.publish_status === 'published',
          ).length,
        },
        conferences: filterConferences({ category: category.slug, publish_status: 'published' })
          .slice(0, 5)
          .map(toListItem),
      }))
      .filter((group) => group.conferences.length > 0);
    return respond(tree, 150, 400);
  },

  createConference(payload: Partial<Conference>): Promise<Conference> {
    const title = payload.title?.trim();
    if (!title) return reject(400, 'Validation failed.', { title: ['Title is required.'] });
    const slug = payload.slug?.trim() || slugify(title);
    if (db.conferences.some((c) => c.slug === slug)) {
      return reject(400, 'Validation failed.', { slug: ['This slug is already in use.'] });
    }
    const category = db.categories.find((c) => c.id === (payload.category?.id ?? '')) ?? db.categories[0];
    const now = new Date().toISOString();
    const record: Conference = {
      slug,
      title,
      short_description: '',
      description: '',
      theme_line: '',
      category: { id: category.id, name: category.name, slug: category.slug },
      kind: 'conference',
      event_format: 'hybrid',
      start_date: dayjs().add(120, 'day').format('YYYY-MM-DD'),
      end_date: dayjs().add(121, 'day').format('YYYY-MM-DD'),
      timezone: 'UTC',
      city: '',
      country: '',
      venue: '',
      hero_image: null,
      card_image: null,
      hero_subtitle: '',
      hero_cta_label: 'Register now',
      hero_cta_url: '',
      brochure_url: null,
      registration_url: null,
      abstract_deadline: null,
      registration_deadline: null,
      status: 'upcoming',
      publish_status: 'draft',
      is_featured: false,
      speaker_count: 0,
      updated_at: now,
      key_themes: [],
      speakers: [],
      agenda: [],
      sponsors: [],
      gallery: [],
      faqs: [],
      who_should_attend: [],
      why_attend: [],
      sections: structuredClone(DEFAULT_SECTIONS),
      seo: { meta_title: title, meta_description: '', og_image: null },
      ...payload,
      id: nextId('conf'),
    };
    db.conferences.unshift(record);
    pushActivity({ actor: 'You', action: 'created', target: record.title, target_type: 'conference' });
    return respond(record);
  },

  updateConference(id: string, payload: Partial<Conference>): Promise<Conference> {
    const index = db.conferences.findIndex((c) => c.id === id);
    if (index === -1) return reject(404, 'This conference could not be found.');
    if (payload.slug && db.conferences.some((c) => c.slug === payload.slug && c.id !== id)) {
      return reject(400, 'Validation failed.', { slug: ['This slug is already in use.'] });
    }
    db.conferences[index] = touch({ ...db.conferences[index], ...payload, id });
    pushActivity({ actor: 'You', action: 'updated', target: db.conferences[index].title, target_type: 'conference' });
    return respond(db.conferences[index]);
  },

  deleteConference(id: string) {
    const index = db.conferences.findIndex((c) => c.id === id);
    if (index === -1) return reject(404, 'This conference could not be found.');
    const [removed] = db.conferences.splice(index, 1);
    pushActivity({ actor: 'You', action: 'deleted', target: removed.title, target_type: 'conference' });
    return respond({ success: true });
  },

  duplicateConference(id: string): Promise<Conference> {
    const source = db.conferences.find((c) => c.id === id);
    if (!source) return reject(404, 'This conference could not be found.');
    let slug = `${source.slug}-copy`;
    let counter = 2;
    while (db.conferences.some((c) => c.slug === slug)) slug = `${source.slug}-copy-${counter++}`;
    const copy: Conference = {
      ...structuredClone(source),
      id: nextId('conf'),
      slug,
      title: `${source.title} (copy)`,
      publish_status: 'draft',
      is_featured: false,
      updated_at: new Date().toISOString(),
    };
    db.conferences.unshift(copy);
    pushActivity({ actor: 'You', action: 'duplicated', target: source.title, target_type: 'conference' });
    return respond(copy);
  },

  setConferencePublishStatus(id: string, publish_status: Conference['publish_status']) {
    return mock.updateConference(id, { publish_status });
  },

  toggleConferenceFeatured(id: string, is_featured: boolean) {
    return mock.updateConference(id, { is_featured });
  },

  /* --- Categories -------------------------------------------------- */
  listCategories(params: ListParams = {}): Promise<Paginated<Category>> {
    const filtered = db.categories
      .filter((c) => matchesSearch(params.search, c.name, c.description))
      .map((c) => ({
        ...c,
        conference_count: db.conferences.filter(
          (conf) => conf.category.id === c.id && conf.publish_status === 'published',
        ).length,
      }))
      .sort((a, b) => a.display_order - b.display_order);
    return respond(paginate(filtered, params.page ?? 1, params.page_size ?? 50));
  },
  createCategory: (payload: Omit<Category, 'id'>) => crud<Category>(() => db.categories, 'cat').create(payload),
  updateCategory: (id: string, payload: Partial<Category>) => crud<Category>(() => db.categories, 'cat').update(id, payload),
  deleteCategory: (id: string) => crud<Category>(() => db.categories, 'cat').remove(id),

  /* --- Speakers ---------------------------------------------------- */
  listSpeakers(params: ListParams & { status?: string; country?: string } = {}): Promise<Paginated<Speaker>> {
    const filtered = db.speakers.filter(
      (s) =>
        (!params.status || params.status === 'all' || s.status === params.status) &&
        (!params.country || params.country === 'all' || s.country === params.country) &&
        matchesSearch(params.search, s.name, s.institution, s.designation, s.country),
    );
    return respond(paginate(sortBy(filtered, params.ordering), params.page ?? 1, params.page_size ?? 10));
  },
  getSpeaker(id: string) {
    const found = db.speakers.find((s) => s.id === id);
    return found ? respond(found) : reject(404, 'Speaker not found.');
  },
  createSpeaker: (payload: Omit<Speaker, 'id'>) => crud<Speaker>(() => db.speakers, 'spk').create(payload),
  updateSpeaker: (id: string, payload: Partial<Speaker>) => crud<Speaker>(() => db.speakers, 'spk').update(id, payload),
  deleteSpeaker: (id: string) => crud<Speaker>(() => db.speakers, 'spk').remove(id),

  /* --- Sponsors ---------------------------------------------------- */
  listSponsors(params: ListParams & { tier?: string; status?: string } = {}): Promise<Paginated<Sponsor>> {
    const filtered = db.sponsors.filter(
      (s) =>
        (!params.tier || params.tier === 'all' || s.tier === params.tier) &&
        (!params.status || params.status === 'all' || s.status === params.status) &&
        matchesSearch(params.search, s.name, s.description),
    );
    return respond(paginate(filtered, params.page ?? 1, params.page_size ?? 12));
  },
  createSponsor: (payload: Omit<Sponsor, 'id'>) => crud<Sponsor>(() => db.sponsors, 'spo').create(payload),
  updateSponsor: (id: string, payload: Partial<Sponsor>) => crud<Sponsor>(() => db.sponsors, 'spo').update(id, payload),
  deleteSponsor: (id: string) => crud<Sponsor>(() => db.sponsors, 'spo').remove(id),

  /* --- Agenda ------------------------------------------------------ */
  getAgenda(conferenceId: string) {
    const conf = db.conferences.find((c) => c.id === conferenceId);
    if (!conf) return reject(404, 'This conference could not be found.');
    return respond(conf.agenda);
  },
  saveAgenda(conferenceId: string, agenda: Conference['agenda']) {
    const conf = db.conferences.find((c) => c.id === conferenceId);
    if (!conf) return reject(404, 'This conference could not be found.');
    conf.agenda = agenda;
    touch(conf);
    return respond(conf.agenda);
  },

  /* --- Gallery ----------------------------------------------------- */
  getGallery(conferenceId: string) {
    const conf = db.conferences.find((c) => c.id === conferenceId);
    if (!conf) return reject(404, 'This conference could not be found.');
    return respond(conf.gallery);
  },
  saveGallery(conferenceId: string, gallery: Conference['gallery']) {
    const conf = db.conferences.find((c) => c.id === conferenceId);
    if (!conf) return reject(404, 'This conference could not be found.');
    conf.gallery = gallery;
    touch(conf);
    return respond(conf.gallery);
  },

  /* --- Reviews ----------------------------------------------------- */
  listReviews(params: ListParams & { status?: string; rating?: number } = {}): Promise<Paginated<Review>> {
    const filtered = db.reviews.filter(
      (r) =>
        (!params.status || params.status === 'all' || r.status === params.status) &&
        (!params.rating || r.rating === params.rating) &&
        matchesSearch(params.search, r.name, r.organization, r.review, r.country),
    );
    return respond(paginate(filtered, params.page ?? 1, params.page_size ?? 12));
  },
  createReview: (payload: Omit<Review, 'id'>) => crud<Review>(() => db.reviews, 'rev').create(payload),
  updateReview: (id: string, payload: Partial<Review>) => crud<Review>(() => db.reviews, 'rev').update(id, payload),
  deleteReview: (id: string) => crud<Review>(() => db.reviews, 'rev').remove(id),

  /* --- Registrations ----------------------------------------------- */
  listRegistrations(
    params: ListParams & { status?: string; conference?: string; type?: string } = {},
  ): Promise<Paginated<Registration>> {
    const filtered = db.registrations.filter(
      (r) =>
        (!params.status || params.status === 'all' || r.status === params.status) &&
        (!params.conference || params.conference === 'all' || r.conference_slug === params.conference) &&
        (!params.type || params.type === 'all' || r.registration_type === params.type) &&
        matchesSearch(params.search, r.full_name, r.email, r.conference, r.country, r.phone),
    );
    return respond(paginate(filtered, params.page ?? 1, params.page_size ?? 10));
  },
  updateRegistrationStatus(id: string, status: RegistrationStatus) {
    return crud<Registration>(() => db.registrations, 'reg').update(id, { status });
  },
  deleteRegistration: (id: string) => crud<Registration>(() => db.registrations, 'reg').remove(id),

  /* --- Abstracts ---------------------------------------------------- */
  listAbstracts(
    params: ListParams & { status?: string; conference?: string } = {},
  ): Promise<Paginated<AbstractSubmission>> {
    const filtered = db.abstracts.filter(
      (a) =>
        (!params.status || params.status === 'all' || a.status === params.status) &&
        (!params.conference || params.conference === 'all' || a.conference_slug === params.conference) &&
        matchesSearch(params.search, a.author_name, a.email, a.title, a.institution, a.country),
    );
    return respond(paginate(filtered, params.page ?? 1, params.page_size ?? 10));
  },
  updateAbstractStatus(id: string, status: AbstractStatus) {
    return crud<AbstractSubmission>(() => db.abstracts, 'abs').update(id, { status });
  },
  deleteAbstract: (id: string) => crud<AbstractSubmission>(() => db.abstracts, 'abs').remove(id),
  submitAbstract(payload: Partial<AbstractSubmission>) {
    const record: AbstractSubmission = {
      id: nextId('abs'),
      author_name: payload.author_name ?? '',
      email: payload.email ?? '',
      conference: payload.conference ?? '',
      conference_slug: payload.conference_slug ?? '',
      title: payload.title ?? '',
      institution: payload.institution ?? '',
      country: payload.country ?? '',
      presentation_type: payload.presentation_type ?? 'oral',
      file_url: payload.file_url ?? null,
      status: 'pending',
      submitted_at: new Date().toISOString(),
    };
    db.abstracts.unshift(record);
    return respond(record, 500, 900);
  },

  /* --- Media -------------------------------------------------------- */
  listMedia(params: ListParams & { type?: string } = {}): Promise<Paginated<MediaAsset>> {
    const filtered = db.media.filter(
      (m) =>
        (!params.type || params.type === 'all' || m.mime_type.startsWith(params.type)) &&
        matchesSearch(params.search, m.file_name, m.alt_text),
    );
    return respond(paginate(filtered, params.page ?? 1, params.page_size ?? 24));
  },
  uploadMedia(file: { name: string; size: number; type: string; previewUrl: string }) {
    const record: MediaAsset = {
      id: nextId('med'),
      url: file.previewUrl,
      thumbnail_url: file.previewUrl,
      alt_text: file.name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' '),
      file_name: file.name,
      mime_type: file.type || 'image/jpeg',
      size_bytes: file.size,
      width: null,
      height: null,
      uploaded_at: new Date().toISOString(),
      uploaded_by: 'You',
    };
    db.media.unshift(record);
    return respond(record, 600, 1100);
  },
  updateMedia: (id: string, payload: Partial<MediaAsset>) => crud<MediaAsset>(() => db.media, 'med').update(id, payload),
  deleteMedia: (id: string) => crud<MediaAsset>(() => db.media, 'med').remove(id),

  /* --- Pages -------------------------------------------------------- */
  listPages(): Promise<SitePage[]> {
    return respond(db.pages);
  },
  getPage(slug: string): Promise<SitePage> {
    const found = db.pages.find((p) => p.slug === slug);
    if (!found) return reject(404, 'Page not found.');
    return respond(found);
  },
  updatePage(id: string, payload: Partial<SitePage>) {
    const index = db.pages.findIndex((p) => p.id === id);
    if (index === -1) return reject(404, 'Page not found.');
    db.pages[index] = { ...db.pages[index], ...payload, updated_at: new Date().toISOString() };
    pushActivity({ actor: 'You', action: 'updated', target: db.pages[index].title, target_type: 'page' });
    return respond(db.pages[index]);
  },

  /* --- Settings ------------------------------------------------------ */
  getSettings: (): Promise<SiteSettings> => respond(db.settings),
  updateSettings(payload: Partial<SiteSettings>) {
    db.settings = { ...db.settings, ...payload };
    return respond(db.settings);
  },

  /* --- Users --------------------------------------------------------- */
  listUsers(params: ListParams & { role?: string } = {}): Promise<Paginated<AdminUser>> {
    const filtered = db.users.filter(
      (u) =>
        (!params.role || params.role === 'all' || u.role === params.role) &&
        matchesSearch(params.search, u.email, u.first_name, u.last_name),
    );
    return respond(paginate(filtered, params.page ?? 1, params.page_size ?? 10));
  },
  createUser: (payload: Omit<AdminUser, 'id'>) => crud<AdminUser>(() => db.users, 'usr').create(payload),
  updateUser: (id: string, payload: Partial<AdminUser>) => crud<AdminUser>(() => db.users, 'usr').update(id, payload),
  deleteUser: (id: string) => crud<AdminUser>(() => db.users, 'usr').remove(id),

  /* --- Dashboard ------------------------------------------------------ */
  getDashboard(): Promise<DashboardResponse> {
    const months = Array.from({ length: 12 }, (_, i) => dayjs().subtract(11 - i, 'month'));
    const trends = months.map((month) => ({
      period: month.format('MMM YY'),
      registrations: db.registrations.filter((r) => dayjs(r.created_at).isSame(month, 'month')).length,
      abstracts: db.abstracts.filter((a) => dayjs(a.submitted_at).isSame(month, 'month')).length,
      conferences: db.conferences.filter((c) => dayjs(c.start_date).isSame(month, 'month')).length,
    }));

    const thisMonth = trends[trends.length - 1];
    const lastMonth = trends[trends.length - 2] ?? thisMonth;
    const delta = (a: number, b: number) => (b === 0 ? (a > 0 ? 100 : 0) : Math.round(((a - b) / b) * 100));

    return respond({
      stats: {
        total_conferences: db.conferences.length,
        published: db.conferences.filter((c) => c.publish_status === 'published').length,
        drafts: db.conferences.filter((c) => c.publish_status === 'draft').length,
        archived: db.conferences.filter((c) => c.publish_status === 'archived').length,
        upcoming: db.conferences.filter((c) => c.status === 'upcoming' && c.publish_status === 'published').length,
        registrations: db.registrations.length,
        abstracts: db.abstracts.length,
        speakers: db.speakers.length,
        registrations_delta: delta(thisMonth.registrations, lastMonth.registrations),
        abstracts_delta: delta(thisMonth.abstracts, lastMonth.abstracts),
        conferences_delta: delta(thisMonth.conferences, lastMonth.conferences),
        speakers_delta: 8,
      },
      trends,
      category_distribution: db.categories.map((category) => ({
        name: category.name,
        value: db.conferences.filter((c) => c.category.id === category.id).length,
      })),
      activity: activityLog.slice(0, 10),
    });
  },

  /* --- Public forms ---------------------------------------------------- */
  submitContact(payload: ContactMessage) {
    if (!payload.email) return reject(400, 'Validation failed.', { email: ['Email is required.'] });
    return respond({ success: true, message: 'Thank you — the secretariat will respond within one working day.' }, 600, 1000);
  },
  subscribe(email: string) {
    if (!email.includes('@')) return reject(400, 'Validation failed.', { email: ['Enter a valid email address.'] });
    return respond({ success: true }, 400, 800);
  },

  /* --- Auth -------------------------------------------------------------- */
  login(payload: LoginPayload): Promise<LoginResponse> {
    const user = db.users.find((u) => u.email.toLowerCase() === payload.email.trim().toLowerCase());
    if (!user || payload.password !== 'globalscion') {
      return reject(401, 'Incorrect email address or password.');
    }
    if (!user.is_active) return reject(403, 'This account has been deactivated.');
    user.last_login = new Date().toISOString();
    return respond(
      {
        access: `mock.access.${btoa(user.id)}.${Date.now()}`,
        refresh: `mock.refresh.${btoa(user.id)}`,
        user,
      },
      450,
      850,
    );
  },
  me(): Promise<AdminUser> {
    return respond(db.users[0]);
  },
  refresh(refresh: string) {
    if (!refresh.startsWith('mock.refresh')) return reject(401, 'Session expired.');
    return respond({ access: `mock.access.refreshed.${Date.now()}` });
  },
  forgotPassword(email: string) {
    if (!email.includes('@')) return reject(400, 'Validation failed.', { email: ['Enter a valid email address.'] });
    return respond({ success: true }, 600, 1000);
  },
  resetPassword(password: string) {
    if (password.length < 8) {
      return reject(400, 'Validation failed.', { password: ['Password must be at least 8 characters.'] });
    }
    return respond({ success: true }, 600, 1000);
  },
};
