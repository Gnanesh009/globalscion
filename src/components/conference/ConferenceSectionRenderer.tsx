import { Fragment, useMemo } from 'react';
import type { Conference, ConferenceSection } from '@/types';
import { SECTION_REGISTRY } from './sectionRegistry';

interface ConferenceSectionRendererProps {
  conference: Conference;
  /** Override the conference's own section list — used by the admin live preview. */
  sections?: ConferenceSection[];
}

/**
 * Renders a conference page from data.
 *
 * Enabled sections are sorted by `order` and mapped through the component
 * registry. There is no per-conference component, no if/else ladder and no
 * switch statement — which is what allows one page to serve 10 or 10,000
 * conferences, each with its own section layout configured in the admin portal.
 */
export function ConferenceSectionRenderer({ conference, sections }: ConferenceSectionRendererProps) {
  const visible = useMemo(() => {
    const source = sections ?? conference.sections ?? [];
    return source
      .filter((section) => section.enabled && SECTION_REGISTRY[section.type])
      .sort((a, b) => a.order - b.order);
  }, [conference.sections, sections]);

  return (
    <>
      {visible.map((section) => {
        const SectionComponent = SECTION_REGISTRY[section.type]!;
        return (
          <Fragment key={`${section.type}-${section.order}`}>
            <SectionComponent conference={conference} config={section.config} />
          </Fragment>
        );
      })}
    </>
  );
}
