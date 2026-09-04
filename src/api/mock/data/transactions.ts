import dayjs from 'dayjs';
import type {
  AbstractStatus,
  AbstractSubmission,
  Registration,
  RegistrationStatus,
  RegistrationType,
} from '@/types';
import { conferences } from './conferences';

/** Deterministic pseudo-random generator so the mock dataset is stable across reloads. */
function seededRandom(seed: number) {
  let state = seed;
  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state / 4294967296;
  };
}

const FIRST_NAMES = [
  'Aisha', 'Lucas', 'Mei', 'Omar', 'Sofia', 'Daniel', 'Priya', 'Elena', 'Yusuf', 'Clara',
  'Hiroshi', 'Nadia', 'Thomas', 'Ingrid', 'Rafael', 'Zara', 'Anders', 'Leila', 'Marcus', 'Anika',
  'Chen', 'Fatima', 'Johan', 'Maya', 'Pedro', 'Sinead', 'Tariq', 'Valentina', 'Wei', 'Yara',
];

const LAST_NAMES = [
  'Okafor', 'Almeida', 'Nakamura', 'Haddad', 'Rossi', 'Novak', 'Venkatesan', 'Vasquez', 'Demir',
  'Andersson', 'Tanaka', 'El-Amin', 'Adeyemi', 'Bauer', 'Silva', 'Khan', 'Lindqvist', 'Farouk',
  'Reid', 'Sharma', 'Wu', 'Bennani', 'Mueller', 'Kowalski', 'Costa', 'Murphy', 'Rahman', 'Bianchi',
];

const INSTITUTIONS = [
  'University College London', 'Karolinska Institutet', 'Tata Memorial Centre',
  'Johns Hopkins University', 'National University of Singapore', 'Charité Berlin',
  'Sorbonne Université', 'University of Melbourne', 'University of Cape Town',
  'Cleveland Clinic Abu Dhabi', 'Università di Bologna', 'University of Tokyo',
  'Universidad Autónoma de Madrid', 'Mayo Clinic', 'Champalimaud Foundation',
];

const COUNTRY_POOL = [
  'United Kingdom', 'United States', 'India', 'Germany', 'United Arab Emirates', 'Spain',
  'Italy', 'Japan', 'Singapore', 'France', 'Sweden', 'Australia', 'South Africa', 'Portugal',
];

const REG_TYPES: RegistrationType[] = ['delegate', 'speaker', 'student', 'poster', 'e-poster', 'sponsor'];
const REG_STATUS: RegistrationStatus[] = ['confirmed', 'confirmed', 'confirmed', 'pending', 'pending', 'cancelled', 'refunded'];
const ABS_STATUS: AbstractStatus[] = ['pending', 'under_review', 'under_review', 'accepted', 'accepted', 'rejected'];
const PRESENTATION: AbstractSubmission['presentation_type'][] = ['oral', 'poster', 'e-poster', 'workshop'];

const AMOUNTS: Record<RegistrationType, number> = {
  delegate: 749,
  speaker: 649,
  student: 399,
  poster: 549,
  'e-poster': 299,
  sponsor: 2500,
};

const ABSTRACT_TOPICS = [
  'Longitudinal outcomes of early behavioural intervention in a community cohort',
  'Federated learning for multi-centre diagnostic model training',
  'Sex differences in age at autism diagnosis: a national registry analysis',
  'Cost-effectiveness of closed-loop insulin delivery in adolescent care',
  'Machine learning triage in emergency psychiatric assessment',
  'Ultra-processed food intake and inflammatory markers: a cohort study',
  'Wearable-derived early warning signals in chronic heart failure',
  'Molecular tumour board implementation in a middle-income setting',
  'Participatory design of AAC technology with autistic adults',
  'Task-shifted mental health care in primary settings: an implementation trial',
  'Polygenic risk stratification for premature coronary disease',
  'Computational pathology validation across three laboratory sites',
  'Sensory-adapted clinical environments and procedural anxiety',
  'Digital phenotyping and relapse prediction in bipolar disorder',
  'Nutrition screening compliance after a ward-level intervention',
  'Immune-related adverse events in an unselected treatment population',
  'Telehealth uptake and inequity in rural cardiology follow-up',
  'Genomic surveillance in a regional outbreak response network',
];

const activeConferences = conferences.filter((c) => c.publish_status !== 'archived');

export const registrations: Registration[] = (() => {
  const rand = seededRandom(20260901);
  return Array.from({ length: 148 }, (_, i) => {
    const conf = activeConferences[Math.floor(rand() * activeConferences.length)];
    const type = REG_TYPES[Math.floor(rand() * REG_TYPES.length)];
    const first = FIRST_NAMES[Math.floor(rand() * FIRST_NAMES.length)];
    const last = LAST_NAMES[Math.floor(rand() * LAST_NAMES.length)];
    return {
      id: `reg-${String(i + 1).padStart(4, '0')}`,
      full_name: `${first} ${last}`,
      email: `${first.toLowerCase()}.${last.toLowerCase().replace(/[^a-z]/g, '')}@example.org`,
      phone: `+${Math.floor(rand() * 89 + 10)} ${Math.floor(rand() * 900 + 100)} ${Math.floor(rand() * 9000 + 1000)}`,
      conference: conf.title,
      conference_slug: conf.slug,
      registration_type: type,
      country: COUNTRY_POOL[Math.floor(rand() * COUNTRY_POOL.length)],
      amount: AMOUNTS[type],
      currency: 'USD',
      status: REG_STATUS[Math.floor(rand() * REG_STATUS.length)],
      created_at: dayjs()
        .subtract(Math.floor(rand() * 240), 'day')
        .subtract(Math.floor(rand() * 24), 'hour')
        .toISOString(),
    };
  }).sort((a, b) => b.created_at.localeCompare(a.created_at));
})();

export const abstracts: AbstractSubmission[] = (() => {
  const rand = seededRandom(772026);
  return Array.from({ length: 86 }, (_, i) => {
    const conf = activeConferences[Math.floor(rand() * activeConferences.length)];
    const first = FIRST_NAMES[Math.floor(rand() * FIRST_NAMES.length)];
    const last = LAST_NAMES[Math.floor(rand() * LAST_NAMES.length)];
    return {
      id: `abs-${String(i + 1).padStart(4, '0')}`,
      author_name: `Dr. ${first} ${last}`,
      email: `${first.toLowerCase()}.${last.toLowerCase().replace(/[^a-z]/g, '')}@research.example.org`,
      conference: conf.title,
      conference_slug: conf.slug,
      title: ABSTRACT_TOPICS[Math.floor(rand() * ABSTRACT_TOPICS.length)],
      institution: INSTITUTIONS[Math.floor(rand() * INSTITUTIONS.length)],
      country: COUNTRY_POOL[Math.floor(rand() * COUNTRY_POOL.length)],
      presentation_type: PRESENTATION[Math.floor(rand() * PRESENTATION.length)],
      file_url: `/abstracts/abs-${String(i + 1).padStart(4, '0')}.pdf`,
      status: ABS_STATUS[Math.floor(rand() * ABS_STATUS.length)],
      submitted_at: dayjs()
        .subtract(Math.floor(rand() * 200), 'day')
        .toISOString(),
    };
  }).sort((a, b) => b.submitted_at.localeCompare(a.submitted_at));
})();
