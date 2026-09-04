import { ConferenceHero } from './sections/ConferenceHero';
import { EventInformation } from './sections/EventInformation';
import { ConferenceOverview } from './sections/ConferenceOverview';
import { KeyThemes } from './sections/KeyThemes';
import { SpeakersSection } from './sections/SpeakersSection';
import { AgendaSection } from './sections/AgendaSection';
import { WhoShouldAttend } from './sections/WhoShouldAttend';
import { WhyAttend } from './sections/WhyAttend';
import { RegistrationCTA } from './sections/RegistrationCTA';
import { AbstractSubmissionSection } from './sections/AbstractSubmissionSection';
import { SponsorsSection } from './sections/SponsorsSection';
import { GallerySection } from './sections/GallerySection';
import { FaqSection } from './sections/FaqSection';
import { FinalCTA } from './sections/FinalCTA';
import type { SectionRegistry } from './sections/types';

/**
 * The single mapping between an API `section.type` and the component that
 * renders it. Adding a section type is a two-line change here plus one new
 * component — never a modification to the page or a conditional branch.
 *
 * Types absent from this map are ignored by the renderer, which means the
 * backend can introduce a section before the frontend ships support for it
 * without breaking any live conference page.
 */
export const SECTION_REGISTRY: SectionRegistry = {
  hero: ConferenceHero,
  'event-info': EventInformation,
  overview: ConferenceOverview,
  themes: KeyThemes,
  speakers: SpeakersSection,
  agenda: AgendaSection,
  'who-should-attend': WhoShouldAttend,
  'why-attend': WhyAttend,
  'registration-cta': RegistrationCTA,
  abstract: AbstractSubmissionSection,
  sponsors: SponsorsSection,
  gallery: GallerySection,
  faq: FaqSection,
  'final-cta': FinalCTA,
};
