import type { Speaker } from '@/types';
import { portraitAt } from '../images';

interface SpeakerSeed {
  name: string;
  designation: string;
  institution: string;
  country: string;
  biography: string;
  keynote?: boolean;
  status?: Speaker['status'];
}

const seeds: SpeakerSeed[] = [
  {
    name: 'Prof. Amara Okonkwo',
    designation: 'Professor of Developmental Neuroscience',
    institution: 'University College London',
    country: 'United Kingdom',
    biography:
      'Leads a translational programme on early neurodevelopmental markers of autism, with more than 140 peer-reviewed publications and a decade of work on community-embedded diagnostic pathways across Europe and West Africa.',
    keynote: true,
  },
  {
    name: 'Dr. Henrik Lindqvist',
    designation: 'Consultant Psychiatrist & Clinical Director',
    institution: 'Karolinska Institutet',
    country: 'Sweden',
    biography:
      'Clinician-scientist working at the intersection of digital phenotyping and severe mental illness. Principal investigator on three multi-site European trials of remote symptom monitoring.',
    keynote: true,
  },
  {
    name: 'Prof. Meera Raghunathan',
    designation: 'Chair, Department of Medical Oncology',
    institution: 'Tata Memorial Centre',
    country: 'India',
    biography:
      'Specialises in precision oncology for low-resource settings. Her group developed a molecular tumour board framework now adopted across 40 hospitals in South Asia.',
    keynote: true,
  },
  {
    name: 'Dr. Sofia Marchetti',
    designation: 'Head of Clinical Nutrition Research',
    institution: 'Università di Bologna',
    country: 'Italy',
    biography:
      'Investigates the metabolic consequences of ultra-processed diets and leads the Mediterranean Metabolic Cohort, following 12,000 participants over fifteen years.',
  },
  {
    name: 'Prof. Daniel Osei-Bonsu',
    designation: 'Professor of Cardiovascular Medicine',
    institution: 'University of Cape Town',
    country: 'South Africa',
    biography:
      'Cardiologist focused on rheumatic heart disease and health-system-scale prevention. Advises the WHO regional office on cardiovascular strategy.',
    keynote: true,
  },
  {
    name: 'Dr. Yuki Tanaka',
    designation: 'Director, Clinical AI Laboratory',
    institution: 'University of Tokyo Hospital',
    country: 'Japan',
    biography:
      'Builds and validates foundation models for diagnostic imaging. Co-author of the Tokyo Principles on clinical algorithm transparency.',
    keynote: true,
  },
  {
    name: 'Prof. Elena Vasquez',
    designation: 'Professor of Public Health & Epidemiology',
    institution: 'Universidad Autónoma de Madrid',
    country: 'Spain',
    biography:
      'Epidemiologist specialising in surveillance systems and outbreak modelling, with field experience across Latin America and the Mediterranean basin.',
  },
  {
    name: 'Dr. Rafael Almeida',
    designation: 'Senior Research Fellow, Neuroimaging',
    institution: 'Champalimaud Foundation',
    country: 'Portugal',
    biography:
      'Uses high-field MRI to map sensory processing differences in autistic adults, working closely with autistic co-researchers under a participatory research model.',
  },
  {
    name: 'Prof. Ingrid Bauer',
    designation: 'Professor of Endocrinology',
    institution: 'Charité — Universitätsmedizin Berlin',
    country: 'Germany',
    biography:
      'Leads a diabetes technology programme evaluating closed-loop insulin delivery in adolescent populations across nine European centres.',
    keynote: true,
  },
  {
    name: 'Dr. Nadia El-Amin',
    designation: 'Consultant in Digital Psychiatry',
    institution: 'Cleveland Clinic Abu Dhabi',
    country: 'United Arab Emirates',
    biography:
      'Designs culturally adapted digital mental health interventions for the Gulf region and chairs a regional working group on AI safety in mental health care.',
  },
  {
    name: 'Prof. James Whitfield',
    designation: 'Professor of Cancer Immunology',
    institution: 'Johns Hopkins University',
    country: 'United States',
    biography:
      'His laboratory characterises tumour-microenvironment resistance to checkpoint blockade; three of his candidate targets have advanced to first-in-human studies.',
    keynote: true,
  },
  {
    name: 'Dr. Priya Venkatesan',
    designation: 'Head of Health Informatics',
    institution: 'National University of Singapore',
    country: 'Singapore',
    biography:
      'Works on federated learning architectures that let hospitals train shared diagnostic models without moving patient data across borders.',
  },
  {
    name: 'Prof. Claire Dubois',
    designation: 'Professor of Behavioural Science',
    institution: 'Sorbonne Université',
    country: 'France',
    biography:
      'Studies stigma reduction and help-seeking behaviour in adolescent mental health, advising the French national youth wellbeing programme.',
  },
  {
    name: 'Dr. Thomas Adeyemi',
    designation: 'Interventional Cardiologist',
    institution: 'Mayo Clinic',
    country: 'United States',
    biography:
      'Clinical lead for structural heart interventions, with a research interest in wearable-derived early warning signals for decompensation.',
  },
  {
    name: 'Prof. Anneke van der Berg',
    designation: 'Professor of Neurodiversity Studies',
    institution: 'Universiteit van Amsterdam',
    country: 'Netherlands',
    biography:
      'Champions the neurodiversity paradigm in clinical training curricula and co-directs a lifespan cohort of autistic adults aged 30–70.',
    keynote: true,
  },
  {
    name: 'Dr. Laila Haddad',
    designation: 'Clinical Dietitian & Programme Lead',
    institution: 'American University of Beirut Medical Center',
    country: 'United Arab Emirates',
    biography:
      'Develops community nutrition programmes for displaced populations and researches food security as a determinant of metabolic outcomes.',
  },
  {
    name: 'Prof. Marcus Reid',
    designation: 'Professor of Health Policy',
    institution: 'University of Melbourne',
    country: 'Australia',
    biography:
      'Health economist evaluating the cost-effectiveness of digital-first care models within publicly funded health systems.',
    status: 'draft',
  },
  {
    name: 'Dr. Chen Wei',
    designation: 'Principal Investigator, Genomic Medicine',
    institution: 'Peking Union Medical College',
    country: 'Singapore',
    biography:
      'Focuses on polygenic risk stratification for early-onset cardiovascular disease in East Asian populations.',
  },
];

export const speakers: Speaker[] = seeds.map((seed, index) => ({
  id: `spk-${String(index + 1).padStart(3, '0')}`,
  name: seed.name,
  photo: portraitAt(index),
  designation: seed.designation,
  institution: seed.institution,
  country: seed.country,
  biography: seed.biography,
  website: index % 3 === 0 ? 'https://example.org/profile' : null,
  linkedin: index % 2 === 0 ? 'https://www.linkedin.com/in/globalscion-speaker' : null,
  status: seed.status ?? 'published',
  is_keynote: Boolean(seed.keynote),
}));

export const speakersByIds = (ids: string[]) =>
  ids.map((id) => speakers.find((s) => s.id === id)).filter((s): s is Speaker => Boolean(s));
