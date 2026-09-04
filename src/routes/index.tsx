import { lazy } from 'react';
import { Navigate, createBrowserRouter } from 'react-router-dom';
import { ADMIN_PATHS, PUBLIC_PATHS } from '@/constants';
import PublicLayout from '@/layouts/PublicLayout';
import AdminLayout from '@/layouts/AdminLayout';
import BlankLayout from '@/layouts/BlankLayout';
import { GuestRoute, ProtectedRoute } from './ProtectedRoute';

/* Public — code-split per route so the first paint ships only the home page. */
const HomePage = lazy(() => import('@/pages/public/Home/HomePage'));
const AboutPage = lazy(() => import('@/pages/public/About/AboutPage'));
const ConferencesPage = lazy(() => import('@/pages/public/Conferences/ConferencesPage'));
const ConferenceDetailsPage = lazy(
  () => import('@/pages/public/ConferenceDetails/ConferenceDetailsPage'),
);
const ReviewsPage = lazy(() => import('@/pages/public/Reviews/ReviewsPage'));
const ContactPage = lazy(() => import('@/pages/public/Contact/ContactPage'));
const LegalPage = lazy(() => import('@/pages/public/Legal/LegalPage'));
const NotFoundPage = lazy(() => import('@/pages/public/NotFound/NotFoundPage'));

/* Admin */
const LoginPage = lazy(() => import('@/pages/admin/Login/LoginPage'));
const ForgotPasswordPage = lazy(() => import('@/pages/admin/Login/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('@/pages/admin/Login/ResetPasswordPage'));
const UnauthorizedPage = lazy(() => import('@/pages/admin/Login/UnauthorizedPage'));
const DashboardPage = lazy(() => import('@/pages/admin/Dashboard/DashboardPage'));
const AdminConferencesPage = lazy(() => import('@/pages/admin/Conferences/AdminConferencesPage'));
const ConferenceBuilderPage = lazy(() => import('@/pages/admin/Conferences/ConferenceBuilderPage'));
const AdminCategoriesPage = lazy(() => import('@/pages/admin/Categories/AdminCategoriesPage'));
const AdminSpeakersPage = lazy(() => import('@/pages/admin/Speakers/AdminSpeakersPage'));
const AdminAgendaPage = lazy(() => import('@/pages/admin/Agenda/AdminAgendaPage'));
const AdminSponsorsPage = lazy(() => import('@/pages/admin/Sponsors/AdminSponsorsPage'));
const AdminGalleryPage = lazy(() => import('@/pages/admin/Gallery/AdminGalleryPage'));
const AdminReviewsPage = lazy(() => import('@/pages/admin/Reviews/AdminReviewsPage'));
const AdminRegistrationsPage = lazy(
  () => import('@/pages/admin/Registrations/AdminRegistrationsPage'),
);
const AdminAbstractsPage = lazy(() => import('@/pages/admin/Abstracts/AdminAbstractsPage'));
const AdminPagesPage = lazy(() => import('@/pages/admin/Pages/AdminPagesPage'));
const AdminMediaPage = lazy(() => import('@/pages/admin/Media/AdminMediaPage'));
const AdminUsersPage = lazy(() => import('@/pages/admin/Users/AdminUsersPage'));
const AdminSettingsPage = lazy(() => import('@/pages/admin/Settings/AdminSettingsPage'));

export const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [
      { path: PUBLIC_PATHS.home, element: <HomePage /> },
      { path: PUBLIC_PATHS.about, element: <AboutPage /> },
      { path: PUBLIC_PATHS.conferences, element: <ConferencesPage /> },
      /* One component renders every conference — 10 or 10,000. */
      { path: PUBLIC_PATHS.conferenceDetails(), element: <ConferenceDetailsPage /> },
      { path: PUBLIC_PATHS.reviews, element: <ReviewsPage /> },
      { path: PUBLIC_PATHS.contact, element: <ContactPage /> },
      { path: PUBLIC_PATHS.terms, element: <LegalPage slug="terms-and-conditions" /> },
      { path: PUBLIC_PATHS.privacy, element: <LegalPage slug="privacy-policy" /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
  {
    element: <BlankLayout />,
    children: [
      {
        path: ADMIN_PATHS.login,
        element: (
          <GuestRoute>
            <LoginPage />
          </GuestRoute>
        ),
      },
      { path: ADMIN_PATHS.forgotPassword, element: <ForgotPasswordPage /> },
      { path: ADMIN_PATHS.resetPassword, element: <ResetPasswordPage /> },
      { path: ADMIN_PATHS.unauthorized, element: <UnauthorizedPage /> },
    ],
  },
  {
    path: ADMIN_PATHS.root,
    element: (
      <ProtectedRoute>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to={ADMIN_PATHS.dashboard} replace /> },
      { path: 'dashboard', element: <DashboardPage /> },
      { path: 'conferences', element: <AdminConferencesPage /> },
      { path: 'conferences/new', element: <ConferenceBuilderPage mode="create" /> },
      { path: 'conferences/:id/edit', element: <ConferenceBuilderPage mode="edit" /> },
      { path: 'categories', element: <AdminCategoriesPage /> },
      { path: 'speakers', element: <AdminSpeakersPage /> },
      { path: 'agenda', element: <AdminAgendaPage /> },
      { path: 'sponsors', element: <AdminSponsorsPage /> },
      { path: 'gallery', element: <AdminGalleryPage /> },
      { path: 'reviews', element: <AdminReviewsPage /> },
      { path: 'registrations', element: <AdminRegistrationsPage /> },
      { path: 'abstracts', element: <AdminAbstractsPage /> },
      { path: 'pages', element: <AdminPagesPage /> },
      { path: 'media', element: <AdminMediaPage /> },
      {
        path: 'users',
        element: (
          <ProtectedRoute roles={['admin']}>
            <AdminUsersPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'settings',
        element: (
          <ProtectedRoute roles={['admin']}>
            <AdminSettingsPage />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);
