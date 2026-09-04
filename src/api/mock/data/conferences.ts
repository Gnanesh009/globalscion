import dayjs from 'dayjs';
import type {
  Conference,
  ConferenceKind,
  ConferenceStatus,
  EventFormat,
  PublishStatus,
} from '@/types';
import { SUBJECT_IMAGES, img } from '../images';
import { categories } from './categories';
import { speakers } from './speakers';
import {
  DEFAULT_SECTIONS,
  DEFAULT_WHY_ATTEND,
  buildAgenda,
  buildGallery,
  commonFaqs,
  sponsors,
} from './shared';

interface ConferenceSeed {
  slug: string;
  title: string;
  themeLine: string;
  categorySlug: string;
  kind: ConferenceKind;
  format: EventFormat;
  start: string;
  end: string;
  timezone: string;
  city: string;
  country: string;
  venue: string;
  image: keyof typeof SUBJECT_IMAGES;
  short: string;
  intro: string;
  themes: [string, string][];
  audience: string[];
  speakerIndexes: number[];
  featured?: boolean;
  publishStatus?: PublishStatus;
  disabledSections?: string[];
}

const seeds: ConferenceSeed[] = [
  {
    slug: 'autism-research-innovations',
    title: 'International Conference on Autism Research and Innovations',
    themeLine: 'Next-Generation Autism Research: Science, Technology and Care',
    categorySlug: 'neuroscience',
    kind: 'conference',
    format: 'online',
    start: '2026-09-17',
    end: '2026-09-18',
    timezone: 'Europe/Madrid',
    city: 'Madrid',
    country: 'Spain',
    venue: 'Virtual auditorium — GlobalScion live platform',
    image: 'neuroscience',
    short:
      'Two days on early identification, assistive technology and lifespan support, convening researchers, clinicians, educators and autistic self-advocates.',
    intro:
      'Autism research is moving faster than the services built around it. This conference brings the evidence and the practice into the same room — from biomarkers and early screening through to education, employment and adult care.',
    themes: [
      ['Early identification and diagnostic pathways', 'Screening instruments, age of diagnosis and the persistent gaps for girls, adults and under-served communities.'],
      ['Neurobiology and developmental mechanisms', 'Genetic architecture, neuroimaging findings and what mechanistic work can realistically deliver to clinics.'],
      ['Evidence-based interventions', 'Naturalistic developmental behavioural interventions, speech and occupational therapy, and how outcomes are measured.'],
      ['Assistive and augmentative technology', 'AAC devices, sensory tools and the design principles that make technology genuinely usable.'],
      ['Education and inclusive classrooms', 'Curriculum adaptation, teacher training and whole-school approaches to inclusion.'],
      ['Sensory processing and environments', 'Designing clinical, educational and public spaces around sensory difference.'],
      ['Autism across the lifespan', 'Transition to adulthood, employment, ageing and the near-absence of adult services.'],
      ['Family and caregiver support', 'Parent-mediated intervention, caregiver mental health and respite provision.'],
      ['Co-occurring conditions', 'Epilepsy, gastrointestinal, sleep and mental health comorbidities in autistic people.'],
      ['Neurodiversity and participatory research', 'Community priority-setting and co-produced research design.'],
      ['Policy, rights and access to services', 'Legal frameworks, funding models and international comparisons.'],
      ['Global and low-resource contexts', 'Task-shifting, cultural adaptation and scaling care where specialists are scarce.'],
    ],
    audience: [
      'Autism researchers and doctoral candidates',
      'Developmental paediatricians and child psychiatrists',
      'Speech, language and occupational therapists',
      'Special educators and inclusion coordinators',
      'Clinical and educational psychologists',
      'Assistive technology designers and engineers',
      'Policy makers and commissioners of services',
      'Advocacy organisations and non-profit leaders',
      'Parents, caregivers and autistic self-advocates',
    ],
    speakerIndexes: [0, 7, 14, 12, 6, 9],
    featured: true,
  },
  {
    slug: 'autism-neurodiversity-brain-health',
    title: 'World Congress on Autism Research, Neurodiversity & Brain Health',
    themeLine: 'From Deficit to Difference: Rethinking Brain Health',
    categorySlug: 'neuroscience',
    kind: 'congress',
    format: 'hybrid',
    start: '2026-10-12',
    end: '2026-10-14',
    timezone: 'Europe/Amsterdam',
    city: 'Amsterdam',
    country: 'Netherlands',
    venue: 'RAI Amsterdam Convention Centre',
    image: 'brainScan',
    short:
      'A three-day congress placing the neurodiversity paradigm alongside neuroscience, clinical practice and lifespan outcomes research.',
    intro:
      'The neurodiversity paradigm has changed how clinicians, researchers and educators talk about difference. This congress tests that shift against the evidence base and asks what it means for services, funding and research design.',
    themes: [
      ['The neurodiversity paradigm in clinical practice', 'What changes at the bedside when difference replaces deficit as the framing.'],
      ['Adult diagnosis and late identification', 'The rapidly growing adult referral population and the services that do not yet exist for them.'],
      ['Cognitive profiles and strengths-based assessment', 'Moving assessment beyond impairment scoring.'],
      ['Brain health across the lifespan', 'Ageing, dementia risk and long-term outcomes in neurodivergent populations.'],
      ['ADHD, autism and diagnostic overlap', 'Co-occurrence, differential diagnosis and combined presentations.'],
      ['Mental health in neurodivergent people', 'Anxiety, depression, burnout and suicide prevention.'],
      ['Workplace inclusion and neurodiversity at work', 'Recruitment, accommodation and retention in practice.'],
      ['Participatory and co-produced research', 'Governance models that give the community real authority.'],
      ['Imaging and biomarker research', 'What neuroimaging can and cannot tell us about neurodevelopment.'],
      ['Education systems and universal design', 'Designing for the range rather than retrofitting for the exception.'],
    ],
    audience: [
      'Neuroscientists and neuroimaging researchers',
      'Adult and child psychiatrists',
      'Neuropsychologists and diagnosticians',
      'Occupational health and workplace inclusion leads',
      'Higher education disability services',
      'Neurodivergent researchers and advocates',
      'Health service commissioners',
      'Postgraduate students in neuroscience and psychology',
    ],
    speakerIndexes: [14, 0, 7, 12, 9, 16],
    featured: true,
  },
  {
    slug: 'heart-cardiovascular-diseases',
    title: 'World Congress on Heart & Cardiovascular Diseases',
    themeLine: 'Prevention, Precision and Global Cardiovascular Equity',
    categorySlug: 'cardiology',
    kind: 'congress',
    format: 'physical',
    start: '2026-11-05',
    end: '2026-11-07',
    timezone: 'Europe/Berlin',
    city: 'Berlin',
    country: 'Germany',
    venue: 'Estrel Congress Center, Berlin',
    image: 'cardiology',
    short:
      'Three days covering interventional cardiology, heart failure, prevention science and the widening global gap in cardiovascular outcomes.',
    intro:
      'Cardiovascular disease remains the leading cause of death worldwide, yet the tools to prevent it are well established. This congress focuses on the distance between what works and what reaches patients.',
    themes: [
      ['Interventional cardiology and structural heart', 'Transcatheter techniques, imaging guidance and operator training.'],
      ['Heart failure management', 'Guideline-directed therapy, remote monitoring and end-of-life planning.'],
      ['Preventive cardiology and risk stratification', 'Polygenic risk scores, lipid management and population screening.'],
      ['Arrhythmia and electrophysiology', 'Ablation strategy, device therapy and atrial fibrillation screening.'],
      ['Cardiac imaging', 'CT, MRI and AI-assisted echocardiography in routine practice.'],
      ['Rheumatic and congenital heart disease', 'Persistent burden in low- and middle-income settings.'],
      ['Wearables and remote cardiac monitoring', 'Signal quality, alert fatigue and clinical workflow integration.'],
      ['Cardio-oncology and cardio-metabolic overlap', 'Managing the shared risk between specialties.'],
      ['Rehabilitation and secondary prevention', 'Programme design, adherence and digital delivery.'],
      ['Health systems and access to cardiac care', 'Workforce, financing and the geography of outcomes.'],
    ],
    audience: [
      'Cardiologists and cardiac surgeons',
      'Interventional and imaging specialists',
      'Cardiac nurses and rehabilitation teams',
      'Clinical researchers in cardiovascular medicine',
      'Medical device and diagnostics professionals',
      'Public health and prevention specialists',
      'Cardiology trainees and fellows',
    ],
    speakerIndexes: [4, 13, 17, 5, 11],
  },
  {
    slug: 'ai-digital-psychiatry',
    title: 'International Congress on AI & Digital Psychiatry',
    themeLine: 'Algorithms, Ethics and the Future of Mental Health Care',
    categorySlug: 'mental-health',
    kind: 'webinar',
    format: 'online',
    start: '2026-12-03',
    end: '2026-12-04',
    timezone: 'UTC',
    city: 'Online',
    country: 'Global',
    venue: 'GlobalScion live platform',
    image: 'aiHealth',
    short:
      'A focused online congress on conversational agents, digital phenotyping, clinical decision support and the governance questions they raise.',
    intro:
      'Mental health care is where AI reaches patients with the least regulatory scaffolding. This congress examines what the evidence actually supports, and what safeguards clinical services need before deployment.',
    themes: [
      ['Conversational agents and digital therapeutics', 'Efficacy evidence, dropout and the limits of automated therapy.'],
      ['Digital phenotyping and passive sensing', 'Predicting relapse from behavioural signal, and the consent problem.'],
      ['Clinical decision support in psychiatry', 'Risk prediction, triage and the medico-legal position of the clinician.'],
      ['Bias, fairness and representativeness', 'Who is in the training data, and who is harmed when they are not.'],
      ['Regulation and clinical safety', 'Software as a medical device, post-market surveillance and incident reporting.'],
      ['Human-in-the-loop service models', 'Blended care pathways that keep clinicians accountable.'],
      ['Youth digital mental health', 'Engagement, safeguarding and school-based deployment.'],
      ['Privacy, consent and data stewardship', 'Federated approaches and patient-controlled records.'],
    ],
    audience: [
      'Psychiatrists and mental health clinicians',
      'Clinical psychologists and therapists',
      'Digital health product and engineering teams',
      'Health informaticians and data scientists',
      'Regulators and clinical safety officers',
      'Ethicists and health lawyers',
      'Service users and lived-experience advisors',
    ],
    speakerIndexes: [9, 1, 5, 11, 12],
  },
  {
    slug: 'endocrinology-diabetes',
    title: 'International Webinar on Endocrinology & Diabetes',
    themeLine: 'Technology, Access and the Metabolic Decade',
    categorySlug: 'medical-healthcare',
    kind: 'webinar',
    format: 'online',
    start: '2027-01-21',
    end: '2027-01-21',
    timezone: 'UTC',
    city: 'Online',
    country: 'Global',
    venue: 'GlobalScion live platform',
    image: 'laboratory',
    short:
      'A single-day webinar on diabetes technology, obesity pharmacotherapy and endocrine care in resource-constrained systems.',
    intro:
      'Closed-loop systems and incretin therapies have changed metabolic medicine faster than health systems can absorb them. This webinar looks at evidence, cost and equity together.',
    themes: [
      ['Automated insulin delivery', 'Closed-loop outcomes in adolescents, adults and pregnancy.'],
      ['Continuous glucose monitoring in practice', 'Interpretation, funding and use beyond type 1 diabetes.'],
      ['Incretin therapies and obesity medicine', 'Durability, discontinuation and the supply problem.'],
      ['Thyroid and adrenal disorders', 'Diagnostic pitfalls and overtreatment.'],
      ['Diabetes in low-resource settings', 'Insulin access, supply chains and task-shifted care.'],
      ['Metabolic surgery', 'Patient selection and long-term follow-up.'],
    ],
    audience: [
      'Endocrinologists and diabetologists',
      'Primary care physicians',
      'Diabetes specialist nurses and educators',
      'Dietitians and metabolic health practitioners',
      'Pharmacists and formulary decision makers',
      'Health economists and policy analysts',
    ],
    speakerIndexes: [8, 3, 15, 6],
    disabledSections: ['gallery'],
  },
  {
    slug: 'healthcare-innovation-precision-medicine-ai',
    title: 'World Congress on Healthcare Innovation, Precision Medicine and Artificial Intelligence',
    themeLine: 'Evidence, Infrastructure and Trust in the Age of Clinical AI',
    categorySlug: 'ai-healthcare',
    kind: 'congress',
    format: 'hybrid',
    start: '2027-02-18',
    end: '2027-02-20',
    timezone: 'Asia/Dubai',
    city: 'Dubai',
    country: 'United Arab Emirates',
    venue: 'Madinat Jumeirah Conference Centre',
    image: 'dataScience',
    short:
      'The flagship GlobalScion congress on clinical AI, genomics-informed care and the infrastructure that makes precision medicine deliverable.',
    intro:
      'Precision medicine and clinical AI share a bottleneck: neither works without data infrastructure, validated evidence and clinician trust. Three days on all three.',
    themes: [
      ['Foundation models in clinical medicine', 'Validation, drift and the evaluation methods that regulators will accept.'],
      ['Genomics-informed care pathways', 'Pharmacogenomics, rare disease diagnosis and population sequencing programmes.'],
      ['Federated learning and data governance', 'Training across institutions without moving patient data.'],
      ['Clinical decision support and workflow', 'Alert design, automation bias and measurable outcome change.'],
      ['Diagnostic imaging AI', 'Radiology, pathology and ophthalmology deployments at scale.'],
      ['Real-world evidence and registries', 'Turning routine data into regulatory-grade evidence.'],
      ['Health equity in algorithmic medicine', 'Performance across populations and the audit obligation.'],
      ['Digital infrastructure and interoperability', 'Standards, procurement and the cost of technical debt.'],
      ['Regulation, liability and clinical governance', 'Who is accountable when the model is wrong.'],
      ['Implementation science', 'Why validated tools still fail at the point of care.'],
    ],
    audience: [
      'Chief medical and chief information officers',
      'Clinical AI researchers and data scientists',
      'Genomic medicine specialists',
      'Health system innovation and transformation leads',
      'Regulators and health technology assessors',
      'Digital health founders and investors',
      'Clinical informaticians and bioinformaticians',
    ],
    speakerIndexes: [5, 11, 2, 16, 6, 1],
    featured: true,
  },
  {
    slug: 'mental-health-psychiatry',
    title: 'International Conference on Mental Health & Psychiatry',
    themeLine: 'Closing the Gap Between Evidence, Access and Lived Experience',
    categorySlug: 'mental-health',
    kind: 'conference',
    format: 'physical',
    start: '2027-03-22',
    end: '2027-03-24',
    timezone: 'Europe/London',
    city: 'London',
    country: 'United Kingdom',
    venue: 'Queen Elizabeth II Centre, Westminster',
    image: 'mentalHealth',
    short:
      'Three days spanning clinical psychiatry, psychological therapies, public mental health and service design, with lived experience embedded throughout.',
    intro:
      'The treatment gap in mental health is not primarily a knowledge gap. This conference deliberately places clinical science, service design and lived experience on the same programme.',
    themes: [
      ['Severe mental illness and early intervention', 'Psychosis pathways, duration of untreated illness and outcomes.'],
      ['Depression and anxiety at scale', 'Stepped care, IAPT-style models and what happens after treatment.'],
      ['Child and adolescent mental health', 'Rising demand, school-based provision and transition to adult services.'],
      ['Psychological therapies and workforce', 'Training, supervision and therapist retention.'],
      ['Suicide prevention', 'Means restriction, safety planning and real-time surveillance.'],
      ['Substance use and dual diagnosis', 'Integrated treatment models.'],
      ['Perinatal and maternal mental health', 'Detection and specialist pathway design.'],
      ['Culture, migration and mental health', 'Adaptation, interpretation and refugee mental health.'],
      ['Stigma, rights and coercion', 'Community treatment orders and the reduction of restrictive practice.'],
      ['Lived experience leadership', 'Co-production in service design and research governance.'],
    ],
    audience: [
      'Consultant and trainee psychiatrists',
      'Clinical and counselling psychologists',
      'Mental health nurses and social workers',
      'Public health and commissioning teams',
      'Third-sector and advocacy organisations',
      'Researchers in psychiatry and behavioural science',
      'Experts by experience',
    ],
    speakerIndexes: [1, 12, 9, 6, 16],
  },
  {
    slug: 'food-nutrition-wellness',
    title: 'International Conference on Food, Nutrition & Wellness',
    themeLine: 'From Molecule to Menu: Nutrition Science that Reaches People',
    categorySlug: 'nutrition',
    kind: 'conference',
    format: 'hybrid',
    start: '2027-04-15',
    end: '2027-04-16',
    timezone: 'Europe/Rome',
    city: 'Rome',
    country: 'Italy',
    venue: 'Auditorium della Tecnica, Rome',
    image: 'nutrition',
    short:
      'Two days connecting nutritional biochemistry, clinical dietetics, food policy and the behavioural science of eating.',
    intro:
      'Nutrition science generates strong evidence and weak implementation. This conference pairs mechanistic and clinical research with the policy and behavioural work that determines whether any of it changes what people eat.',
    themes: [
      ['Ultra-processed food and metabolic health', 'Causal evidence, mechanisms and regulatory responses.'],
      ['Clinical nutrition and malnutrition screening', 'Hospital nutrition, sarcopenia and perioperative care.'],
      ['The gut microbiome', 'What is established, what is promising and what is oversold.'],
      ['Precision and personalised nutrition', 'Glycaemic response prediction and the commercial claims around it.'],
      ['Food policy and population interventions', 'Taxation, reformulation and front-of-pack labelling.'],
      ['Sustainable diets and planetary health', 'Nutritional adequacy within environmental limits.'],
      ['Behavioural science of eating', 'Environment, defaults and the limits of individual advice.'],
      ['Nutrition in humanitarian settings', 'Acute malnutrition, food security and displaced populations.'],
    ],
    audience: [
      'Dietitians and clinical nutritionists',
      'Food scientists and technologists',
      'Public health nutrition specialists',
      'Gastroenterologists and metabolic physicians',
      'Food policy and regulatory professionals',
      'Behavioural scientists',
      'Postgraduate nutrition researchers',
    ],
    speakerIndexes: [3, 15, 6, 8],
  },
  {
    slug: 'oncology-research-ai',
    title: 'World Congress on Oncology Research & AI Innovations',
    themeLine: 'Precision Oncology at Population Scale',
    categorySlug: 'oncology',
    kind: 'congress',
    format: 'hybrid',
    start: '2027-06-09',
    end: '2027-06-11',
    timezone: 'Asia/Singapore',
    city: 'Singapore',
    country: 'Singapore',
    venue: 'Suntec Singapore Convention Centre',
    image: 'oncology',
    short:
      'Three days on cancer biology, immunotherapy, computational pathology and the delivery of precision oncology beyond well-funded centres.',
    intro:
      'Precision oncology works — for the minority of patients who reach a molecular tumour board. This congress focuses equally on the science and on the delivery problem.',
    themes: [
      ['Immuno-oncology and resistance mechanisms', 'Checkpoint blockade, cellular therapy and the non-responder problem.'],
      ['Computational pathology', 'Whole-slide imaging, model validation and laboratory workflow.'],
      ['Liquid biopsy and early detection', 'Multi-cancer screening tests and the overdiagnosis question.'],
      ['Molecular tumour boards', 'Governance, evidence thresholds and access outside major centres.'],
      ['Radiotherapy innovation', 'Adaptive planning and AI-assisted contouring.'],
      ['Cancer in low- and middle-income countries', 'Diagnostic delay, workforce and essential medicines.'],
      ['Survivorship and supportive care', 'Late effects, return to work and psycho-oncology.'],
      ['Clinical trial design and decentralisation', 'Adaptive designs and remote participation.'],
      ['Cancer prevention and screening programmes', 'Uptake, equity and programme evaluation.'],
    ],
    audience: [
      'Medical, surgical and radiation oncologists',
      'Cancer biologists and translational researchers',
      'Pathologists and molecular diagnostics teams',
      'Clinical trialists and regulatory professionals',
      'Oncology nurses and supportive care teams',
      'Health system and cancer programme leaders',
      'Biotech and pharmaceutical researchers',
    ],
    speakerIndexes: [2, 10, 11, 5, 17],
    featured: true,
  },
  {
    slug: 'neuroscience-brain-mapping',
    title: 'International Conference on Neuroscience & Brain Mapping',
    themeLine: 'Circuits, Cognition and Clinical Translation',
    categorySlug: 'neuroscience',
    kind: 'conference',
    format: 'physical',
    start: '2026-06-10',
    end: '2026-06-12',
    timezone: 'Asia/Tokyo',
    city: 'Tokyo',
    country: 'Japan',
    venue: 'Tokyo International Forum',
    image: 'microscope',
    short:
      'A completed edition covering connectomics, neuromodulation and the translation of circuit-level neuroscience into clinical practice.',
    intro:
      'The 2026 Tokyo edition brought together 640 delegates from 41 countries across three days of circuit neuroscience, neuromodulation and clinical translation.',
    themes: [
      ['Connectomics and network neuroscience', 'Mapping structural and functional connectivity at scale.'],
      ['Neuromodulation', 'Deep brain stimulation, TMS and closed-loop approaches.'],
      ['Neurodegeneration', 'Biomarkers, disease-modifying therapy and diagnostic timing.'],
      ['Computational neuroscience', 'Modelling, simulation and theory-driven experiment design.'],
      ['Cognitive neuroscience', 'Memory, attention and decision-making.'],
      ['Neuroinflammation', 'Glial biology and immune contributions to brain disease.'],
    ],
    audience: [
      'Neuroscientists and neurologists',
      'Neurosurgeons and neuromodulation specialists',
      'Computational and theoretical neuroscientists',
      'Neuroimaging researchers',
      'Postgraduate and postdoctoral researchers',
    ],
    speakerIndexes: [5, 7, 0, 14],
  },
  {
    slug: 'clinical-nutrition-metabolic-health',
    title: 'International Webinar on Clinical Nutrition & Metabolic Health',
    themeLine: 'Practical Nutrition Science for Clinical Teams',
    categorySlug: 'nutrition',
    kind: 'webinar',
    format: 'online',
    start: '2026-03-05',
    end: '2026-03-05',
    timezone: 'UTC',
    city: 'Online',
    country: 'Global',
    venue: 'GlobalScion live platform',
    image: 'pharmacy',
    short:
      'A completed one-day webinar on nutrition support, metabolic assessment and dietetic practice in acute care.',
    intro:
      'A concise clinical webinar delivered to 1,180 registered participants, focused on what acute-care teams can apply immediately.',
    themes: [
      ['Nutrition support in acute illness', 'Enteral and parenteral decision-making.'],
      ['Malnutrition screening tools', 'Validation and implementation in ward settings.'],
      ['Sarcopenia and frailty', 'Assessment and intervention in older adults.'],
      ['Metabolic assessment', 'Indirect calorimetry and practical alternatives.'],
    ],
    audience: [
      'Clinical dietitians',
      'Intensive care and acute medicine teams',
      'Nutrition support nurses',
      'Pharmacists involved in parenteral nutrition',
    ],
    speakerIndexes: [3, 15],
    disabledSections: ['gallery', 'sponsors'],
  },
  {
    slug: 'precision-oncology-immunotherapy',
    title: 'International Conference on Precision Oncology & Immunotherapy',
    themeLine: 'Targeting the Tumour and the Immune System Together',
    categorySlug: 'oncology',
    kind: 'conference',
    format: 'physical',
    start: '2025-11-20',
    end: '2025-11-21',
    timezone: 'Europe/Paris',
    city: 'Paris',
    country: 'France',
    venue: 'Palais des Congrès de Paris',
    image: 'medicalTeam',
    short:
      'A completed edition on targeted therapy, cellular immunotherapy and biomarker-driven treatment selection.',
    intro:
      'The Paris edition convened 420 delegates across two days of targeted therapy, cellular immunotherapy and biomarker science.',
    themes: [
      ['Cellular therapy', 'CAR-T beyond haematological malignancy.'],
      ['Biomarker-driven selection', 'Companion diagnostics and assay standardisation.'],
      ['Toxicity management', 'Immune-related adverse events in routine practice.'],
      ['Combination strategies', 'Rational design and trial evidence.'],
    ],
    audience: [
      'Medical oncologists',
      'Immunologists and translational scientists',
      'Clinical pharmacologists',
      'Oncology pharmacists and nurses',
    ],
    speakerIndexes: [10, 2, 17],
  },
  {
    slug: 'global-public-health-epidemiology',
    title: 'World Congress on Global Public Health & Epidemiology',
    themeLine: 'Surveillance, Preparedness and Health System Resilience',
    categorySlug: 'medical-healthcare',
    kind: 'congress',
    format: 'hybrid',
    start: '2027-08-11',
    end: '2027-08-13',
    timezone: 'Europe/London',
    city: 'Geneva',
    country: 'Switzerland',
    venue: 'Centre International de Conférences Genève',
    image: 'publicHealth',
    short:
      'A congress in preparation covering epidemiological methods, outbreak preparedness and health system resilience.',
    intro:
      'Programme development is under way. Session leads and the scientific committee will be announced shortly.',
    themes: [
      ['Surveillance systems and early warning', 'Genomic and syndromic surveillance in practice.'],
      ['Outbreak preparedness', 'Stockpiles, workforce and the lessons that were not learned.'],
      ['Non-communicable disease epidemiology', 'Cohort design and causal inference.'],
      ['Climate and health', 'Heat, vector range shift and health system adaptation.'],
    ],
    audience: [
      'Epidemiologists and biostatisticians',
      'Public health physicians',
      'Health security and preparedness professionals',
      'Global health policy makers',
    ],
    speakerIndexes: [6, 16, 1],
    publishStatus: 'draft',
  },
  {
    slug: 'digital-cardiology-wearables',
    title: 'International Webinar on Digital Cardiology & Wearable Technology',
    themeLine: 'Signal, Noise and Clinical Value',
    categorySlug: 'cardiology',
    kind: 'webinar',
    format: 'online',
    start: '2027-09-16',
    end: '2027-09-16',
    timezone: 'UTC',
    city: 'Online',
    country: 'Global',
    venue: 'GlobalScion live platform',
    image: 'aiHealth',
    short:
      'A webinar in preparation on consumer wearables, remote monitoring and their genuine clinical yield.',
    intro: 'Draft programme — speakers and sessions are being confirmed by the scientific committee.',
    themes: [
      ['Consumer wearables in cardiology', 'Atrial fibrillation detection and the incidentaloma problem.'],
      ['Remote heart failure monitoring', 'Which signals actually predict decompensation.'],
      ['Workflow and alert burden', 'Designing services that clinicians can sustain.'],
    ],
    audience: ['Cardiologists', 'Cardiac physiologists', 'Digital health teams'],
    speakerIndexes: [13, 4],
    publishStatus: 'draft',
  },
  {
    slug: 'womens-health-reproductive-medicine',
    title: 'International Conference on Women’s Health & Reproductive Medicine',
    themeLine: 'Evidence and Equity Across the Reproductive Lifespan',
    categorySlug: 'medical-healthcare',
    kind: 'conference',
    format: 'physical',
    start: '2025-05-14',
    end: '2025-05-15',
    timezone: 'Europe/Lisbon',
    city: 'Lisbon',
    country: 'Portugal',
    venue: 'Centro de Congressos de Lisboa',
    image: 'nursing',
    short: 'An archived edition covering reproductive medicine, maternal health and gynaecological practice.',
    intro: 'This edition has been archived. Proceedings remain available to registered delegates.',
    themes: [
      ['Maternal health outcomes', 'Disparities and quality improvement.'],
      ['Fertility and assisted reproduction', 'Evidence and access.'],
      ['Menopause care', 'Guideline change and workforce training.'],
    ],
    audience: ['Obstetricians and gynaecologists', 'Midwives', 'Reproductive endocrinologists'],
    speakerIndexes: [8, 6],
    publishStatus: 'archived',
  },
];

const deriveStatus = (start: string, end: string): ConferenceStatus => {
  const today = dayjs();
  if (today.isAfter(dayjs(end), 'day')) return 'completed';
  if (today.isBefore(dayjs(start), 'day')) return 'upcoming';
  return 'ongoing';
};

function buildDescription(seed: ConferenceSeed): string {
  return `
<p><strong>${seed.intro}</strong></p>
<p>The ${seed.kind === 'webinar' ? 'webinar' : 'programme'} is organised around plenary keynotes, focused parallel tracks, practice-oriented workshops and dedicated poster sessions. Every session is chaired by a member of the international scientific committee, and questions from ${seed.format === 'physical' ? 'the floor' : 'the online audience'} are moderated into each discussion rather than left to the final five minutes.</p>
<h3>What makes this edition different</h3>
<p>GlobalScion builds each programme from an open call and a blinded review process rather than from an invitation list. That produces a scientific programme where early-career researchers present alongside established investigators, and where negative and replication findings are given the same platform as headline results.</p>
<ul>
  <li>A scientific committee drawn from ${seed.audience.length} professional constituencies</li>
  <li>Double-blind abstract review with published assessment criteria</li>
  <li>Structured networking rather than unstructured coffee breaks</li>
  <li>On-demand access to every recorded session for thirty days</li>
</ul>
<p>Delegates leave with a certificate of participation, the full book of abstracts, and — for accepted presenters — a citable abstract record.</p>
`.trim();
}

export const conferences: Conference[] = seeds.map((seed, index) => {
  const category = categories.find((c) => c.slug === seed.categorySlug)!;
  const speakerIds = seed.speakerIndexes.map((i) => speakers[i].id);
  const days = dayjs(seed.end).diff(dayjs(seed.start), 'day') + 1;
  const publishStatus = seed.publishStatus ?? 'published';
  const disabled = new Set(seed.disabledSections ?? []);

  return {
    id: `conf-${String(index + 1).padStart(3, '0')}`,
    slug: seed.slug,
    title: seed.title,
    short_description: seed.short,
    description: buildDescription(seed),
    theme_line: seed.themeLine,
    category: { id: category.id, name: category.name, slug: category.slug },
    kind: seed.kind,
    event_format: seed.format,
    start_date: seed.start,
    end_date: seed.end,
    timezone: seed.timezone,
    city: seed.city,
    country: seed.country,
    venue: seed.venue,
    hero_image: img.wide(SUBJECT_IMAGES[seed.image], 1920),
    card_image: img.card(SUBJECT_IMAGES[seed.image], 800),
    hero_subtitle: seed.themeLine,
    hero_cta_label: 'Register now',
    hero_cta_url: `/conferences/${seed.slug}#registration`,
    brochure_url: publishStatus === 'published' ? `/brochures/${seed.slug}.pdf` : null,
    registration_url: `/conferences/${seed.slug}#registration`,
    abstract_deadline: dayjs(seed.start).subtract(60, 'day').format('YYYY-MM-DD'),
    registration_deadline: dayjs(seed.start).subtract(14, 'day').format('YYYY-MM-DD'),
    status: deriveStatus(seed.start, seed.end),
    publish_status: publishStatus,
    is_featured: Boolean(seed.featured),
    speaker_count: speakerIds.length,
    updated_at: dayjs().subtract(index * 3 + 1, 'day').toISOString(),
    key_themes: seed.themes.map(([title, description], i) => ({
      id: `${seed.slug}-theme-${i + 1}`,
      title,
      description,
      display_order: i + 1,
    })),
    speakers: speakerIds
      .map((id) => speakers.find((s) => s.id === id)!)
      .filter(Boolean),
    agenda: buildAgenda({
      startDate: seed.start,
      days,
      speakerIds,
      keyTopics: seed.themes.map(([title]) => title),
    }),
    sponsors: disabled.has('sponsors') ? [] : sponsors.filter((s) => s.status === 'published'),
    gallery: disabled.has('gallery') ? [] : buildGallery(index),
    faqs: commonFaqs,
    who_should_attend: seed.audience,
    why_attend: DEFAULT_WHY_ATTEND,
    sections: DEFAULT_SECTIONS.map((section) => ({
      ...section,
      enabled: section.enabled && !disabled.has(section.type),
    })),
    seo: {
      meta_title: `${seed.title} | ${dayjs(seed.start).format('MMMM YYYY')} | GlobalScion`,
      meta_description: seed.short.slice(0, 158),
      og_image: img.wide(SUBJECT_IMAGES[seed.image], 1200),
      canonical_url: `/conferences/${seed.slug}`,
      keywords: [category.name, seed.city, seed.kind, ...seed.themes.slice(0, 3).map(([t]) => t)],
    },
  };
});

export const conferenceBySlug = (slug: string) => conferences.find((c) => c.slug === slug);
