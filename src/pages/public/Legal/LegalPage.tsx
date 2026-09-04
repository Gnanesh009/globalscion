import { useMemo } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { PageHero } from '@/components/common/PageHero';
import { RichTextContent } from '@/components/common/RichTextContent';
import { Section } from '@/components/common/Section';
import { Seo } from '@/components/common/Seo';
import { ErrorState } from '@/components/common/States';
import { usePage } from '@/hooks/useResources';
import type { SitePage } from '@/types';
import { formatDate } from '@/utils/format';

interface LegalPageProps {
  slug: Extract<SitePage['slug'], 'terms-and-conditions' | 'privacy-policy'>;
}

/** Both legal pages share one component — content and SEO come from the CMS. */
export default function LegalPage({ slug }: LegalPageProps) {
  const { data: page, isPending, isError, error, refetch } = usePage(slug);

  // Build an in-page contents list from the h3 headings in the CMS content.
  const contents = useMemo(() => {
    if (!page?.content) return [];
    const matches = [...page.content.matchAll(/<h3>(.*?)<\/h3>/g)];
    return matches.map((match) => match[1].replace(/<[^>]*>/g, ''));
  }, [page?.content]);

  return (
    <>
      <Seo
        title={page?.seo.meta_title ?? page?.title ?? 'Legal'}
        description={page?.seo.meta_description}
        canonicalPath={`/${slug}`}
      />

      <PageHero
        eyebrow="Legal"
        title={page?.title ?? (slug === 'privacy-policy' ? 'Global Privacy Policy' : 'Terms & Conditions')}
        description={page?.hero_subtitle}
        breadcrumb={[{ label: page?.title ?? 'Legal' }]}
      />

      <Section>
        <Grid container spacing={{ xs: 4, lg: 8 }}>
          <Grid size={{ xs: 12, lg: 3 }}>
            <Box sx={{ position: { lg: 'sticky' }, top: { lg: 110 } }}>
              <Typography variant="eyebrow" component="h2" sx={{ color: 'text.disabled', mb: 2 }}>
                On this page
              </Typography>
              <Stack component="ol" spacing={1.25} sx={{ listStyle: 'none', p: 0, m: 0 }}>
                {contents.map((heading) => (
                  <Typography
                    key={heading}
                    component="li"
                    variant="body2"
                    sx={{ color: 'text.secondary', lineHeight: 1.5 }}
                  >
                    {heading}
                  </Typography>
                ))}
              </Stack>
              {page && (
                <Typography variant="caption" color="text.disabled" sx={{ display: 'block', mt: 3 }}>
                  Last updated {formatDate(page.updated_at)}
                </Typography>
              )}
            </Box>
          </Grid>

          <Grid size={{ xs: 12, lg: 9 }}>
            {isPending && (
              <Stack spacing={1.5}>
                {Array.from({ length: 16 }).map((_, index) => (
                  <Skeleton key={index} height={20} width={index % 5 === 4 ? '60%' : '100%'} />
                ))}
              </Stack>
            )}
            {isError && <ErrorState error={error} onRetry={() => void refetch()} />}
            {page && <RichTextContent html={page.content} sx={{ maxWidth: 780 }} />}
          </Grid>
        </Grid>
      </Section>
    </>
  );
}
