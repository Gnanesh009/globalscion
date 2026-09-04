/** Central query-key factory — keeps invalidation predictable across modules. */
export const queryKeys = {
  conferences: {
    all: ['conferences'] as const,
    list: (params: unknown) => ['conferences', 'list', params] as const,
    detail: (slug: string) => ['conferences', 'detail', slug] as const,
    byId: (id: string) => ['conferences', 'id', id] as const,
    featured: ['conferences', 'featured'] as const,
    menu: ['conferences', 'menu'] as const,
    agenda: (id: string) => ['conferences', id, 'agenda'] as const,
    gallery: (id: string) => ['conferences', id, 'gallery'] as const,
  },
  categories: {
    all: ['categories'] as const,
    list: (params: unknown) => ['categories', 'list', params] as const,
  },
  speakers: {
    all: ['speakers'] as const,
    list: (params: unknown) => ['speakers', 'list', params] as const,
    detail: (id: string) => ['speakers', id] as const,
  },
  sponsors: {
    all: ['sponsors'] as const,
    list: (params: unknown) => ['sponsors', 'list', params] as const,
  },
  reviews: {
    all: ['reviews'] as const,
    list: (params: unknown) => ['reviews', 'list', params] as const,
  },
  registrations: {
    all: ['registrations'] as const,
    list: (params: unknown) => ['registrations', 'list', params] as const,
  },
  abstracts: {
    all: ['abstracts'] as const,
    list: (params: unknown) => ['abstracts', 'list', params] as const,
  },
  media: {
    all: ['media'] as const,
    list: (params: unknown) => ['media', 'list', params] as const,
  },
  pages: {
    all: ['pages'] as const,
    detail: (slug: string) => ['pages', slug] as const,
  },
  users: {
    all: ['users'] as const,
    list: (params: unknown) => ['users', 'list', params] as const,
  },
  settings: ['settings'] as const,
  dashboard: ['dashboard'] as const,
};
