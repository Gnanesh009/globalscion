import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid2';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { HERO_IMAGES, img } from '@/api/mock/images';
import { PageHero } from '@/components/common/PageHero';
import { Section } from '@/components/common/Section';
import { Seo } from '@/components/common/Seo';
import { ConferenceGridSkeleton } from '@/components/common/Skeletons';
import { EmptyState, ErrorState } from '@/components/common/States';
import { ConferenceCard } from '@/components/conference/ConferenceCard';
import { DEFAULT_PAGE_SIZE, PUBLIC_PATHS } from '@/constants';
import { useConferences } from '@/hooks/useConferences';
import { useCategories } from '@/hooks/useResources';
import { useDebounced } from '@/hooks/useUi';
import type { ConferenceQuery } from '@/types';
import { ConferenceFilters, type ConferenceFilterState } from './ConferenceFilters';

type TabKey = 'all' | 'upcoming' | 'completed' | 'webinars';

const TABS: { key: TabKey; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'upcoming', label: 'Upcoming' },
  { key: 'completed', label: 'Completed' },
  { key: 'webinars', label: 'Webinars' },
];

const EMPTY_FILTERS: ConferenceFilterState = {
  search: '',
  category: 'all',
  kind: 'all',
  format: 'all',
  dateFrom: '',
  dateTo: '',
};

export default function ConferencesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: categoryData } = useCategories();

  const [tab, setTab] = useState<TabKey>(() => {
    const status = searchParams.get('status');
    return TABS.some((t) => t.key === status) ? (status as TabKey) : 'all';
  });
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<ConferenceFilterState>(() => ({
    ...EMPTY_FILTERS,
    search: searchParams.get('q') ?? '',
    category: searchParams.get('category') ?? 'all',
  }));

  const debouncedSearch = useDebounced(filters.search, 400);

  // Keep the URL shareable: category, search and tab round-trip through query params.
  useEffect(() => {
    const next = new URLSearchParams();
    if (debouncedSearch) next.set('q', debouncedSearch);
    if (filters.category !== 'all') next.set('category', filters.category);
    if (tab !== 'all') next.set('status', tab);
    setSearchParams(next, { replace: true });
  }, [debouncedSearch, filters.category, tab, setSearchParams]);

  const query = useMemo<ConferenceQuery>(() => {
    const base: ConferenceQuery = {
      page,
      page_size: DEFAULT_PAGE_SIZE,
      search: debouncedSearch || undefined,
      category: filters.category,
      format: filters.format as ConferenceQuery['format'],
      kind: filters.kind as ConferenceQuery['kind'],
      date_from: filters.dateFrom || undefined,
      date_to: filters.dateTo || undefined,
    };

    if (tab === 'upcoming') base.status = 'upcoming';
    if (tab === 'completed') base.status = 'completed';
    if (tab === 'webinars') base.kind = 'webinar';

    return base;
  }, [page, debouncedSearch, filters, tab]);

  const { data, isPending, isFetching, isError, error, refetch } = useConferences(query);

  const pageCount = Math.ceil((data?.count ?? 0) / DEFAULT_PAGE_SIZE);
  const results = data?.results ?? [];

  const patchFilters = (patch: Partial<ConferenceFilterState>) => {
    setFilters((prev) => ({ ...prev, ...patch }));
    setPage(1);
  };

  return (
    <>
      <Seo
        title="Conferences & Webinars"
        description="Browse GlobalScion's international scientific and medical conferences, congresses and webinars — filter by discipline, format and date."
        canonicalPath={PUBLIC_PATHS.conferences}
      />

      <PageHero
        eyebrow="Programme"
        title="Conferences & webinars"
        description="Every GlobalScion programme, past and upcoming. Filter by discipline, format or date to find the edition relevant to your work."
        image={img.wide(HERO_IMAGES.auditorium, 1800)}
        breadcrumb={[{ label: 'Conferences' }]}
      />

      <Section>
        <Tabs
          value={tab}
          onChange={(_, value: TabKey) => {
            setTab(value);
            setPage(1);
          }}
          aria-label="Filter conferences by status"
          sx={{ borderBottom: '1px solid', borderColor: 'divider', mb: 4 }}
        >
          {TABS.map((item) => (
            <Tab key={item.key} value={item.key} label={item.label} />
          ))}
        </Tabs>

        <ConferenceFilters
          value={filters}
          categories={categoryData?.results ?? []}
          onChange={patchFilters}
          onReset={() => {
            setFilters(EMPTY_FILTERS);
            setPage(1);
          }}
          resultCount={data?.count}
        />

        <Box sx={{ mt: 5, opacity: isFetching && !isPending ? 0.6 : 1, transition: 'opacity 200ms' }}>
          {isPending && <ConferenceGridSkeleton count={6} />}

          {isError && <ErrorState error={error} onRetry={() => void refetch()} />}

          {!isPending && !isError && results.length === 0 && (
            <EmptyState
              title="No conferences match these filters"
              description="Try broadening your search, clearing a filter, or switching to the All tab."
              action={
                <Button
                  variant="outlined"
                  onClick={() => {
                    setFilters(EMPTY_FILTERS);
                    setTab('all');
                    setPage(1);
                  }}
                >
                  Reset filters
                </Button>
              }
            />
          )}

          {!isPending && !isError && results.length > 0 && (
            <Grid container spacing={{ xs: 3, md: 4 }}>
              {results.map((conference) => (
                <Grid key={conference.id} size={{ xs: 12, md: 6, lg: 4 }}>
                  <ConferenceCard conference={conference} />
                </Grid>
              ))}
            </Grid>
          )}
        </Box>

        {pageCount > 1 && (
          <Stack alignItems="center" sx={{ mt: 7 }}>
            <Pagination
              count={pageCount}
              page={page}
              onChange={(_, value) => {
                setPage(value);
                window.scrollTo({ top: 320, behavior: 'smooth' });
              }}
              color="primary"
              shape="rounded"
              siblingCount={1}
              getItemAriaLabel={(type, pageNumber) =>
                type === 'page' ? `Go to page ${pageNumber}` : `Go to ${type} page`
              }
            />
          </Stack>
        )}
      </Section>
    </>
  );
}
