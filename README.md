# GlobalScion

Production-quality React frontend for a global scientific & medical conference
organisation. One Vite workspace, two visually distinct applications:

| Surface | Route prefix | Theme | Audience |
|---|---|---|---|
| **Public website** | `/` | `publicTheme` — editorial, navy/teal | researchers, clinicians, students, industry |
| **Admin portal (CMS)** | `/admin` | `adminTheme` — dense, enterprise slate | Super Admin, Admin, Editor |

## Stack

React 18 · Vite 5 · TypeScript · MUI 6 · React Router 6 · TanStack Query 5 ·
Axios · React Hook Form · Zod · Recharts · TipTap (rich text) · dnd-kit (drag & drop) ·
MUI X DataGrid & Date Pickers · react-helmet-async (SEO).

## Getting started

```bash
npm install
cp .env.example .env      # already present; VITE_USE_MOCK=true by default
npm run dev               # http://localhost:5173
npm run build             # tsc + vite build → dist/
```

### Admin sign-in (mock mode)

`admin@globalscion.com` (Super Admin) · `programme@globalscion.com` (Admin) ·
`editor@globalscion.com` (Editor) — password `globalscion`.

## Architecture

### The conference page is data, not code

There is exactly **one** `ConferenceDetailsPage` at `/conferences/:slug`. Its body
is composed by `ConferenceSectionRenderer`, which reads the conference's
`sections: { type, enabled, order }[]` array, filters/sorts it and maps each
`type` through `SECTION_REGISTRY` (`src/components/conference/sectionRegistry.ts`)
to a section component. No `if/else`, no `switch`, no per-conference component.
Adding a conference is an admin action; adding a *section type* is two lines in
the registry plus one component. Unknown types are ignored, so the backend can
ship a section before the frontend supports it.

The 12-step admin **conference builder** (`/admin/conferences/new`) edits the
same `sections` array in step 11 with drag-and-drop ordering and per-section
enable toggles — what you arrange there is exactly what the public renderer
consumes.

### API layer

`src/api/*Api.ts` — one module per resource, each a thin function object. Every
call branches on `USE_MOCK` (`VITE_USE_MOCK`): true → in-repo mock adapter
(`src/api/mock/`) returning **Django-REST-shaped** payloads (`{ count, next,
previous, results }`, `snake_case`, `YYYY-MM-DD` dates); false → `apiClient`
(Axios) against `VITE_API_BASE_URL`. The request interceptor attaches the JWT;
the response interceptor refreshes once on 401 then emits a session-expired
event. Components never import mock data — they call hooks
(`src/hooks/`) that wrap TanStack Query, so swapping to the real backend is a
`.env` change.

### Folders

```
src/
  api/            apiClient + per-resource modules + mock/ (Django-shaped)
  app/            providers (Query, Auth, Toast, Helmet, date localization)
  components/
    common/       Section, SectionHeading, Seo, states, skeletons, StatusChip…
    layout/       Header (+ MegaMenu, MobileNav), Footer
    conference/   ConferenceCard, ConferenceSectionRenderer, sectionRegistry, sections/
    admin/        AdminSidebar, AdminTopbar, RichTextEditor, SortableList, AgendaBuilder,
                  MediaPickerField, StatCard, AdminPageHeader
    forms/        RHF-bound MUI fields (Text, Select, DatePicker, Switch)
    charts/       Recharts wrappers + validated categorical palette
  constants/      paths, option lists, nav config, section catalogue
  hooks/          queryKeys + typed query/mutation hooks
  layouts/        PublicLayout, AdminLayout, BlankLayout (each owns its theme)
  pages/
    public/       Home, About, Conferences, ConferenceDetails, Reviews, Contact, Legal, NotFound
    admin/        Login, Dashboard, Conferences (+ builder steps/), Categories, Speakers,
                  Agenda, Sponsors, Gallery, Reviews, Registrations, Abstracts, Pages,
                  Media, Users, Settings
  routes/         createBrowserRouter tree + ProtectedRoute / GuestRoute
  theme/          tokens, typography, publicTheme, adminTheme
  types/          shared API/domain types
  utils/          formatting, storage, status metadata
```

### Routing & auth

`createBrowserRouter` with three layout routes. `/admin/*` is wrapped in
`ProtectedRoute` (JWT presence + role rank: `editor < admin < super_admin`);
`/admin/users` and `/admin/settings` additionally require `admin`. Failure →
`/admin/login?next=…` or `/admin/403`. Every page is `React.lazy` + `Suspense`.

### SEO

`<Seo>` (react-helmet-async) sets title, description, canonical, Open Graph and
Twitter tags per page. Conference pages additionally emit `schema.org/Event`
JSON-LD generated from their own fields.

### Loading / error / empty states

Every API-driven view renders a skeleton while pending, an `ErrorState` with a
retry action on failure, and an `EmptyState` when a successful response is empty —
never a blank screen.

## Connecting the Django backend

1. Point `VITE_API_BASE_URL` at the DRF root and set `VITE_USE_MOCK=false`.
2. Match the endpoints referenced in `src/api/*Api.ts` (e.g. `GET
   /conferences/`, `GET /conferences/{slug}/`, `GET /conferences/menu/`,
   `POST /auth/login/`, `POST /auth/refresh/`).
3. Return the envelope shapes in `src/types/` — the mock adapter is the contract.

No component or page changes are required.
