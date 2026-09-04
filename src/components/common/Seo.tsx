import { Helmet } from 'react-helmet-async';
import { SITE_URL } from '@/api/apiClient';

interface SeoProps {
  title: string;
  description?: string;
  /** Path only (e.g. `/conferences/autism-research`) — resolved against VITE_SITE_URL. */
  canonicalPath?: string;
  image?: string | null;
  type?: 'website' | 'article' | 'event';
  keywords?: string[];
  noIndex?: boolean;
  /** JSON-LD payload, e.g. schema.org/Event for conference pages. */
  jsonLd?: Record<string, unknown>;
}

const SITE_NAME = 'GlobalScion';

export function Seo({
  title,
  description,
  canonicalPath,
  image,
  type = 'website',
  keywords,
  noIndex,
  jsonLd,
}: SeoProps) {
  const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;
  const canonical = canonicalPath ? `${SITE_URL.replace(/\/$/, '')}${canonicalPath}` : undefined;

  return (
    <Helmet prioritizeSeoTags>
      <title>{fullTitle}</title>
      {description && <meta name="description" content={description} />}
      {keywords?.length ? <meta name="keywords" content={keywords.join(', ')} /> : null}
      {canonical && <link rel="canonical" href={canonical} />}
      {noIndex && <meta name="robots" content="noindex, nofollow" />}

      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:type" content={type === 'event' ? 'article' : type} />
      <meta property="og:title" content={fullTitle} />
      {description && <meta property="og:description" content={description} />}
      {canonical && <meta property="og:url" content={canonical} />}
      {image && <meta property="og:image" content={image} />}

      <meta name="twitter:card" content={image ? 'summary_large_image' : 'summary'} />
      <meta name="twitter:title" content={fullTitle} />
      {description && <meta name="twitter:description" content={description} />}
      {image && <meta name="twitter:image" content={image} />}

      {jsonLd && <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>}
    </Helmet>
  );
}
