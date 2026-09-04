import type { Conference, ConferenceSectionType } from '@/types';

/**
 * Every conference section receives exactly this contract. Because the shape is
 * identical for all of them, the renderer can map `type -> component` without
 * knowing anything about an individual section.
 */
export interface ConferenceSectionProps {
  conference: Conference;
  /** Optional per-conference overrides supplied by the API (`section.config`). */
  config?: Record<string, unknown>;
}

export type ConferenceSectionComponent = (props: ConferenceSectionProps) => JSX.Element | null;

export type SectionRegistry = Partial<Record<ConferenceSectionType, ConferenceSectionComponent>>;
