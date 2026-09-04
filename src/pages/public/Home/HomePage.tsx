import { Seo } from '@/components/common/Seo';
import { PUBLIC_PATHS } from '@/constants';
import { HeroSection } from './sections/HeroSection';
import { UpcomingConferences } from './sections/UpcomingConferences';
import { FeaturedConference } from './sections/FeaturedConference';
import { WhyGlobalScion } from './sections/WhyGlobalScion';
import { AboutPreview } from './sections/AboutPreview';
import { CategoriesSection } from './sections/CategoriesSection';
import { StatisticsSection } from './sections/StatisticsSection';
import { WhoShouldAttendSection } from './sections/WhoShouldAttendSection';
import { TestimonialsSection } from './sections/TestimonialsSection';
import { HomeFinalCta } from './sections/HomeFinalCta';

export default function HomePage() {
  return (
    <>
      <Seo
        title="GlobalScion | International Scientific & Medical Conferences"
        description="GlobalScion convenes researchers, clinicians and industry leaders across 50+ countries through peer-reviewed international conferences, congresses and webinars."
        canonicalPath={PUBLIC_PATHS.home}
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: 'GlobalScion',
          url: 'https://globalscion.com',
          description:
            'International scientific and medical conference organisation running peer-reviewed congresses, conferences and webinars.',
          sameAs: [
            'https://linkedin.com/company/globalscion',
            'https://x.com/globalscion',
            'https://facebook.com/globalscion',
          ],
        }}
      />

      <HeroSection />
      <UpcomingConferences />
      <FeaturedConference />
      <WhyGlobalScion />
      <AboutPreview />
      <CategoriesSection />
      <StatisticsSection />
      <WhoShouldAttendSection />
      <TestimonialsSection />
      <HomeFinalCta />
    </>
  );
}
