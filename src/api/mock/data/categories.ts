import type { Category } from '@/types';

export const categories: Category[] = [
  {
    id: 'cat-medical',
    name: 'Medical & Healthcare',
    slug: 'medical-healthcare',
    description:
      'Clinical practice, health systems, precision medicine and translational research across the medical specialties.',
    icon: 'LocalHospital',
    color: '#0B1F3A',
    conference_count: 2,
    display_order: 1,
    status: 'published',
  },
  {
    id: 'cat-mental-health',
    name: 'Mental Health',
    slug: 'mental-health',
    description:
      'Psychiatry, psychology, behavioural science and the policy frameworks that shape mental health care worldwide.',
    icon: 'Psychology',
    color: '#0E7C86',
    conference_count: 2,
    display_order: 2,
    status: 'published',
  },
  {
    id: 'cat-neuroscience',
    name: 'Neuroscience',
    slug: 'neuroscience',
    description:
      'Brain health, neurodevelopment, neurodiversity and the translational neurosciences from bench to bedside.',
    icon: 'Biotech',
    color: '#2563EB',
    conference_count: 3,
    display_order: 3,
    status: 'published',
  },
  {
    id: 'cat-ai-healthcare',
    name: 'AI & Healthcare',
    slug: 'ai-healthcare',
    description:
      'Artificial intelligence, digital health, clinical informatics and the governance of algorithmic medicine.',
    icon: 'Memory',
    color: '#1D4ED8',
    conference_count: 2,
    display_order: 4,
    status: 'published',
  },
  {
    id: 'cat-nutrition',
    name: 'Nutrition',
    slug: 'nutrition',
    description:
      'Clinical nutrition, food science, metabolic health and population-level wellness interventions.',
    icon: 'Restaurant',
    color: '#047857',
    conference_count: 2,
    display_order: 5,
    status: 'published',
  },
  {
    id: 'cat-cardiology',
    name: 'Cardiology',
    slug: 'cardiology',
    description:
      'Cardiovascular medicine, interventional cardiology, heart failure and preventive cardiology.',
    icon: 'MonitorHeart',
    color: '#B91C1C',
    conference_count: 2,
    display_order: 6,
    status: 'published',
  },
  {
    id: 'cat-oncology',
    name: 'Oncology',
    slug: 'oncology',
    description:
      'Cancer biology, precision oncology, immunotherapy and multidisciplinary cancer care.',
    icon: 'Science',
    color: '#7C3AED',
    conference_count: 2,
    display_order: 7,
    status: 'published',
  },
];

export const categoryById = (id: string) => categories.find((c) => c.id === id);
