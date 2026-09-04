import { Link as RouterLink, useParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { Seo } from '@/components/common/Seo';
import { DetailPageSkeleton } from '@/components/common/Skeletons';
import { ErrorState } from '@/components/common/States';
import { ConferenceSectionRenderer } from '@/components/conference/ConferenceSectionRenderer';
import { PUBLIC_PATHS } from '@/constants';
import { useConference } from '@/hooks/useConferences';
import { formatDateRange, stripHtml } from '@/utils/format';
import { RelatedConferences } from './RelatedConferences';

/**
 * The only conference page in the application.
 *
 * Route: /conferences/:slug — the slug is resolved to a record through the API
 * layer, and the page body is composed entirely from that record's `sections`
 * array. Publishing a new conference in the admin portal makes its URL live
 * without touching this file.
 */
export default function ConferenceDetailsPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: conference, isPending, isError, error, refetch } = useConference(slug);

  if (isPending) return <DetailPageSkeleton />;

  if (isError || !conference) {
    const notFound = (error as { status?: number } | null)?.status === 404;
    return (
      <Container sx={{ py: { xs: 8, md: 14 } }}>
        <ErrorState
          error={notFound ? undefined : error}
          title={notFound ? 'This conference could not be found' : 'We couldn’t load this conference'}
          onRetry={notFound ? undefined : () => void refetch()}
        />
        <Box sx={{ textAlign: 'center', mt: 3 }}>
          <Button component={RouterLink} to={PUBLIC_PATHS.conferences} variant="contained">
            Browse all conferences
          </Button>
        </Box>
      </Container>
    );
  }

  const description =
    conference.seo.meta_description || stripHtml(conference.description, 158) || conference.short_description;

  return (
    <>
      <Seo
        title={conference.seo.meta_title || conference.title}
        description={description}
        canonicalPath={PUBLIC_PATHS.conferenceDetails(conference.slug)}
        image={conference.seo.og_image ?? conference.hero_image}
        type="event"
        keywords={conference.seo.keywords}
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'Event',
          name: conference.title,
          description,
          startDate: conference.start_date,
          endDate: conference.end_date,
          eventAttendanceMode:
            conference.event_format === 'online'
              ? 'https://schema.org/OnlineEventAttendanceMode'
              : conference.event_format === 'hybrid'
                ? 'https://schema.org/MixedEventAttendanceMode'
                : 'https://schema.org/OfflineEventAttendanceMode',
          eventStatus: 'https://schema.org/EventScheduled',
          image: conference.hero_image ? [conference.hero_image] : undefined,
          location:
            conference.event_format === 'online'
              ? { '@type': 'VirtualLocation', url: `${PUBLIC_PATHS.conferenceDetails(conference.slug)}` }
              : {
                  '@type': 'Place',
                  name: conference.venue,
                  address: { '@type': 'PostalAddress', addressLocality: conference.city, addressCountry: conference.country },
                },
          organizer: { '@type': 'Organization', name: 'GlobalScion', url: 'https://globalscion.com' },
          performer: conference.speakers.slice(0, 8).map((speaker) => ({
            '@type': 'Person',
            name: speaker.name,
            affiliation: speaker.institution,
          })),
        }}
      />

      {/* Breadcrumb sits above the hero so the page always exposes its position. */}
      <Box sx={{ backgroundColor: 'background.paper', borderBottom: '1px solid', borderColor: 'divider' }}>
        <Container>
          <Breadcrumbs
            separator={<NavigateNextIcon sx={{ fontSize: 15 }} />}
            aria-label="Breadcrumb"
            sx={{ py: 2, fontSize: '0.8125rem' }}
          >
            <Box component={RouterLink} to={PUBLIC_PATHS.home} sx={{ color: 'text.secondary', textDecoration: 'none' }}>
              Home
            </Box>
            <Box
              component={RouterLink}
              to={PUBLIC_PATHS.conferences}
              sx={{ color: 'text.secondary', textDecoration: 'none' }}
            >
              Conferences
            </Box>
            <Box
              component={RouterLink}
              to={`${PUBLIC_PATHS.conferences}?category=${conference.category.slug}`}
              sx={{ color: 'text.secondary', textDecoration: 'none' }}
            >
              {conference.category.name}
            </Box>
            <Typography component="span" sx={{ fontSize: '0.8125rem', color: 'text.primary', fontWeight: 600 }}>
              {formatDateRange(conference.start_date, conference.end_date)}
            </Typography>
          </Breadcrumbs>
        </Container>
      </Box>

      <ConferenceSectionRenderer conference={conference} />

      <RelatedConferences
        categorySlug={conference.category.slug}
        excludeSlug={conference.slug}
      />
    </>
  );
}
