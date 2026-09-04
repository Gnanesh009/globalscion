import dayjs from 'dayjs';
import type { Review } from '@/types';
import { portraitAt } from '../images';

interface ReviewSeed {
  name: string;
  designation: string;
  organization: string;
  country: string;
  review: string;
  rating: number;
  conference?: string;
  status?: Review['status'];
}

const seeds: ReviewSeed[] = [
  {
    name: 'Dr. Marion Kessler',
    designation: 'Consultant Neurologist',
    organization: 'Universitätsklinikum Heidelberg',
    country: 'Germany',
    review:
      'The scientific programme was genuinely peer-reviewed rather than sponsor-led, and it showed in the quality of the discussion. I left with two collaborations that have since become funded studies.',
    rating: 5,
    conference: 'World Congress on Autism Research, Neurodiversity & Brain Health',
  },
  {
    name: 'Prof. Ade Balogun',
    designation: 'Professor of Public Health',
    organization: 'University of Lagos',
    country: 'South Africa',
    review:
      'What distinguishes GlobalScion is that speakers from low-resource settings are on the main stage, not confined to a side track. The programme reflected global practice rather than one region’s assumptions.',
    rating: 5,
  },
  {
    name: 'Dr. Hannah Wu',
    designation: 'Postdoctoral Researcher',
    organization: 'ETH Zürich',
    country: 'Switzerland',
    review:
      'As an early-career researcher I was given a full oral slot and a chaired discussion. The feedback I received materially improved the manuscript that came out of it.',
    rating: 5,
    conference: 'International Conference on Neuroscience & Brain Mapping',
  },
  {
    name: 'Dr. Farida Rahman',
    designation: 'Clinical Lead, Diabetes Services',
    organization: 'NHS Greater Manchester',
    country: 'United Kingdom',
    review:
      'The webinar format was tightly run — no overrunning sessions, moderated Q&A throughout and recordings available the same evening. Practical for clinicians who cannot take three days out.',
    rating: 4,
    conference: 'International Webinar on Endocrinology & Diabetes',
  },
  {
    name: 'Prof. Luis Fernández',
    designation: 'Head of Cardiology',
    organization: 'Hospital Clínic Barcelona',
    country: 'Spain',
    review:
      'A well-curated congress with a serious scientific committee. The structured networking sessions were far more useful than the usual scramble at the coffee stand.',
    rating: 5,
  },
  {
    name: 'Ms. Chiara Rossi',
    designation: 'Senior Clinical Dietitian',
    organization: 'Ospedale San Raffaele',
    country: 'Italy',
    review:
      'Content pitched correctly for practising clinicians rather than only for academics. I applied two of the screening protocols within a fortnight of returning.',
    rating: 5,
    conference: 'International Conference on Food, Nutrition & Wellness',
  },
  {
    name: 'Dr. Kwame Mensah',
    designation: 'Medical Oncologist',
    organization: 'Korle Bu Teaching Hospital',
    country: 'United States',
    review:
      'The molecular tumour board workshop was the single most useful session I have attended in five years of conferences. Concrete, reproducible and honest about resource constraints.',
    rating: 5,
    conference: 'World Congress on Oncology Research & AI Innovations',
  },
  {
    name: 'Dr. Sarah Lindgren',
    designation: 'Digital Health Researcher',
    organization: 'Aalborg University',
    country: 'Sweden',
    review:
      'Excellent balance between enthusiasm and scepticism about clinical AI. Speakers were pressed on validation and generalisability rather than allowed to present marketing material.',
    rating: 4,
  },
  {
    name: 'Mr. Ravi Deshpande',
    designation: 'PhD Candidate, Behavioural Science',
    organization: 'Indian Institute of Technology Bombay',
    country: 'India',
    review:
      'The student rate made attendance possible and the mentorship session paired me with a reviewer who has stayed in touch since. Genuinely supportive of early-career researchers.',
    rating: 5,
  },
  {
    name: 'Dr. Amelia Rousseau',
    designation: 'Consultant Psychiatrist',
    organization: 'Hôpital Sainte-Anne',
    country: 'France',
    review:
      'Lived-experience contributors were on panels as equals, not as a closing-session afterthought. That changed the quality of the conversation considerably.',
    rating: 5,
    conference: 'International Conference on Mental Health & Psychiatry',
  },
  {
    name: 'Prof. Tomás Silva',
    designation: 'Professor of Bioinformatics',
    organization: 'Universidade do Porto',
    country: 'Portugal',
    review:
      'Well organised logistically, though the parallel tracks meant some difficult choices. A published clash-map in advance would help.',
    rating: 4,
  },
  {
    name: 'Ms. Noor Al-Sayed',
    designation: 'Health Policy Analyst',
    organization: 'Ministry of Health',
    country: 'United Arab Emirates',
    review:
      'A rare conference where policy people and clinicians were genuinely in dialogue rather than presenting past one another.',
    rating: 5,
    status: 'draft',
  },
];

export const reviews: Review[] = seeds.map((seed, index) => ({
  id: `rev-${String(index + 1).padStart(3, '0')}`,
  name: seed.name,
  designation: seed.designation,
  organization: seed.organization,
  country: seed.country,
  photo: portraitAt(index + 6),
  review: seed.review,
  rating: seed.rating,
  conference: seed.conference ?? null,
  status: seed.status ?? 'published',
  created_at: dayjs().subtract(index * 11 + 4, 'day').toISOString(),
}));
