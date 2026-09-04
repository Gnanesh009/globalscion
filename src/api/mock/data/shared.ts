import dayjs from 'dayjs';
import type {
  AgendaDay,
  ConferenceSection,
  ConferenceSectionType,
  FaqItem,
  GalleryImage,
  Sponsor,
} from '@/types';
import { SUBJECT_IMAGES, img } from '../images';

export const sponsors: Sponsor[] = [
  {
    id: 'spo-001',
    name: 'Meridian Life Sciences',
    logo: null,
    website: 'https://example.com',
    description: 'Global research reagents and translational science partner.',
    tier: 'platinum',
    status: 'published',
  },
  {
    id: 'spo-002',
    name: 'Northbridge Health Systems',
    logo: null,
    website: 'https://example.com',
    description: 'Integrated hospital network supporting clinical education worldwide.',
    tier: 'platinum',
    status: 'published',
  },
  {
    id: 'spo-003',
    name: 'Helix Diagnostics',
    logo: null,
    website: 'https://example.com',
    description: 'Molecular diagnostics and companion testing platforms.',
    tier: 'gold',
    status: 'published',
  },
  {
    id: 'spo-004',
    name: 'Corvus Medical Devices',
    logo: null,
    website: 'https://example.com',
    description: 'Interventional and monitoring device manufacturer.',
    tier: 'gold',
    status: 'published',
  },
  {
    id: 'spo-005',
    name: 'Atlas Clinical Software',
    logo: null,
    website: 'https://example.com',
    description: 'Clinical trial management and real-world evidence platforms.',
    tier: 'silver',
    status: 'published',
  },
  {
    id: 'spo-006',
    name: 'Lumen Biopharma',
    logo: null,
    website: 'https://example.com',
    description: 'Immuno-oncology and rare disease therapeutics.',
    tier: 'silver',
    status: 'published',
  },
  {
    id: 'spo-007',
    name: 'European Academy of Translational Medicine',
    logo: null,
    website: 'https://example.com',
    description: 'Accrediting body and academic collaborator.',
    tier: 'partner',
    status: 'published',
  },
  {
    id: 'spo-008',
    name: 'Global Health Policy Institute',
    logo: null,
    website: 'https://example.com',
    description: 'Independent policy research organisation.',
    tier: 'partner',
    status: 'published',
  },
  {
    id: 'spo-009',
    name: 'The Clinical Review',
    logo: null,
    website: 'https://example.com',
    description: 'Peer-reviewed journal and official media partner.',
    tier: 'media',
    status: 'published',
  },
  {
    id: 'spo-010',
    name: 'ScienceWire Media',
    logo: null,
    website: 'https://example.com',
    description: 'Scientific news syndication network.',
    tier: 'media',
    status: 'published',
  },
  {
    id: 'spo-011',
    name: 'OpenAccess Research Network',
    logo: null,
    website: 'https://example.com',
    description: 'Open access publishing collaborative.',
    tier: 'media',
    status: 'draft',
  },
];

const GALLERY_SOURCE: [keyof typeof SUBJECT_IMAGES, string][] = [
  ['conferenceHall', 'Opening plenary session'],
  ['presentation', 'Keynote address to the main auditorium'],
  ['discussion', 'Panel discussion on translational priorities'],
  ['posterSession', 'Poster walk with the scientific committee'],
  ['workshop', 'Hands-on methodology workshop'],
  ['networkingBreak', 'Networking break between tracks'],
  ['studentAudience', 'Young investigator session'],
  ['awards', 'Best presentation awards ceremony'],
];

export const buildGallery = (offset = 0): GalleryImage[] =>
  GALLERY_SOURCE.map(([key, caption], index) => ({
    id: `gal-${offset}-${index}`,
    image: img.card(SUBJECT_IMAGES[key], 900),
    caption,
    display_order: index + 1,
  }));

export const commonFaqs: FaqItem[] = [
  {
    id: 'faq-1',
    question: 'How do I register for the conference?',
    answer:
      'Registration is completed online through the Register Now button on this page. You will receive a confirmation email with your invoice and joining instructions within two working days.',
    display_order: 1,
  },
  {
    id: 'faq-2',
    question: 'Will I receive a certificate of participation?',
    answer:
      'Yes. All delegates, speakers and poster presenters receive an electronic certificate of participation issued by the GlobalScion scientific committee within seven days of the closing session.',
    display_order: 2,
  },
  {
    id: 'faq-3',
    question: 'Can I attend remotely if I cannot travel?',
    answer:
      'Hybrid and online editions stream every plenary and parallel track live, with moderated Q&A and on-demand access to recordings for thirty days after the event.',
    display_order: 3,
  },
  {
    id: 'faq-4',
    question: 'What is the abstract review process?',
    answer:
      'Abstracts are double-blind reviewed by at least two members of the scientific committee against relevance, methodology and clarity. Outcomes are communicated within three weeks of submission.',
    display_order: 4,
  },
  {
    id: 'faq-5',
    question: 'Do you provide visa invitation letters?',
    answer:
      'An official invitation letter is issued to registered delegates on request. Please allow at least ninety days before the event for consular processing.',
    display_order: 5,
  },
  {
    id: 'faq-6',
    question: 'Are group and student rates available?',
    answer:
      'Groups of five or more receive a discounted rate, and verified students and early-career researchers are eligible for a reduced registration fee. Contact the secretariat for details.',
    display_order: 6,
  },
];

/** Default section layout applied to every new conference in the admin builder. */
export const DEFAULT_SECTIONS: ConferenceSection[] = (
  [
    'hero',
    'event-info',
    'overview',
    'themes',
    'speakers',
    'agenda',
    'who-should-attend',
    'why-attend',
    'registration-cta',
    'abstract',
    'sponsors',
    'gallery',
    'faq',
    'final-cta',
  ] as ConferenceSectionType[]
).map((type, index) => ({ type, enabled: true, order: index + 1 }));

interface AgendaTemplateInput {
  startDate: string;
  days: number;
  speakerIds: string[];
  keyTopics: string[];
}

/** Produces a realistic two/three-day programme without hand-writing every row. */
export function buildAgenda({
  startDate,
  days,
  speakerIds,
  keyTopics,
}: AgendaTemplateInput): AgendaDay[] {
  const pick = (i: number) => (speakerIds.length ? [speakerIds[i % speakerIds.length]] : []);

  return Array.from({ length: days }, (_, dayIndex) => {
    const date = dayjs(startDate).add(dayIndex, 'day');
    const isFirst = dayIndex === 0;
    const isLast = dayIndex === days - 1;

    const sessions: AgendaDay['sessions'] = [
      {
        id: `d${dayIndex}-s1`,
        time_start: '08:30',
        time_end: '09:00',
        title: isFirst ? 'Registration and welcome coffee' : 'Morning coffee and networking',
        description: 'Collect your delegate pack and meet the scientific committee.',
        session_type: 'break',
        speaker_ids: [],
        display_order: 1,
      },
      {
        id: `d${dayIndex}-s2`,
        time_start: '09:00',
        time_end: '09:45',
        title: isFirst
          ? 'Opening keynote — setting the global agenda'
          : `Keynote — ${keyTopics[(dayIndex + 1) % keyTopics.length] ?? 'Emerging directions'}`,
        description:
          'A framing address on where the field stands today and the questions that will define the next decade.',
        session_type: 'keynote',
        speaker_ids: pick(dayIndex),
        display_order: 2,
      },
      {
        id: `d${dayIndex}-s3`,
        time_start: '09:45',
        time_end: '11:00',
        title: `Plenary session — ${keyTopics[dayIndex * 2] ?? 'Translational research'}`,
        description: 'Three consecutive invited talks followed by a moderated discussion.',
        session_type: 'talk',
        speaker_ids: pick(dayIndex + 1),
        display_order: 3,
      },
      {
        id: `d${dayIndex}-s4`,
        time_start: '11:00',
        time_end: '11:30',
        title: 'Refreshment break and exhibition',
        description: 'Visit sponsor stands and the poster gallery.',
        session_type: 'break',
        speaker_ids: [],
        display_order: 4,
      },
      {
        id: `d${dayIndex}-s5`,
        time_start: '11:30',
        time_end: '13:00',
        title: `Panel discussion — ${keyTopics[dayIndex * 2 + 1] ?? 'Policy and practice'}`,
        description:
          'A cross-disciplinary panel debating implementation barriers, funding and equity of access.',
        session_type: 'panel',
        speaker_ids: pick(dayIndex + 2).concat(pick(dayIndex + 3)),
        display_order: 5,
      },
      {
        id: `d${dayIndex}-s6`,
        time_start: '13:00',
        time_end: '14:00',
        title: 'Lunch and structured networking',
        description: 'Themed tables hosted by session chairs.',
        session_type: 'break',
        speaker_ids: [],
        display_order: 6,
      },
      {
        id: `d${dayIndex}-s7`,
        time_start: '14:00',
        time_end: '15:30',
        title: 'Parallel workshops and case studies',
        description:
          'Small-group, practice-oriented workshops with pre-circulated case material.',
        session_type: 'workshop',
        speaker_ids: pick(dayIndex + 4),
        display_order: 7,
      },
      {
        id: `d${dayIndex}-s8`,
        time_start: '15:30',
        time_end: '16:45',
        title: isLast ? 'Poster and e-poster presentations' : 'Young investigator oral session',
        description:
          'Early-career researchers present original work to a rotating panel of reviewers.',
        session_type: 'poster',
        speaker_ids: [],
        display_order: 8,
      },
      {
        id: `d${dayIndex}-s9`,
        time_start: '16:45',
        time_end: '17:30',
        title: isLast ? 'Awards, closing remarks and next edition' : 'Day summary and evening reception',
        description: isLast
          ? 'Best presentation awards, committee reflections and an announcement of the next edition.'
          : 'A synthesis of the day followed by an informal drinks reception.',
        session_type: isLast ? 'talk' : 'break',
        speaker_ids: isLast ? pick(dayIndex + 5) : [],
        display_order: 9,
      },
    ];

    return {
      id: `day-${dayIndex + 1}`,
      day_number: dayIndex + 1,
      date: date.format('YYYY-MM-DD'),
      title: `Day ${dayIndex + 1} — ${date.format('dddd, DD MMMM YYYY')}`,
      sessions,
    };
  });
}

export const DEFAULT_WHY_ATTEND = [
  'Hear first-hand from the investigators shaping current practice and policy.',
  'Present your own work to an international, peer-reviewed audience.',
  'Build collaborations across institutions, disciplines and continents.',
  'Earn a certificate of participation recognised by partner academic bodies.',
  'Access every session on demand for thirty days after the closing ceremony.',
  'Meet funders, publishers and industry partners in a single venue.',
];
