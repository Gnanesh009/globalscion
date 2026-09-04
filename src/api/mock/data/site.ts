import dayjs from 'dayjs';
import type { AdminUser, MediaAsset, SitePage, SiteSettings } from '@/types';
import { SUBJECT_IMAGES, img, portraitAt } from '../images';

export const users: AdminUser[] = [
  {
    id: 'usr-001',
    email: 'admin@globalscion.com',
    first_name: 'Alexandra',
    last_name: 'Hart',
    role: 'super_admin',
    avatar: portraitAt(18, 200),
    is_active: true,
    last_login: dayjs().subtract(2, 'hour').toISOString(),
    date_joined: '2023-02-14T09:12:00Z',
  },
  {
    id: 'usr-002',
    email: 'programme@globalscion.com',
    first_name: 'Daniel',
    last_name: 'Osei',
    role: 'admin',
    avatar: portraitAt(7, 200),
    is_active: true,
    last_login: dayjs().subtract(1, 'day').toISOString(),
    date_joined: '2023-06-02T11:40:00Z',
  },
  {
    id: 'usr-003',
    email: 'editor@globalscion.com',
    first_name: 'Priya',
    last_name: 'Venkatesan',
    role: 'editor',
    avatar: portraitAt(19, 200),
    is_active: true,
    last_login: dayjs().subtract(5, 'hour').toISOString(),
    date_joined: '2024-01-22T08:05:00Z',
  },
  {
    id: 'usr-004',
    email: 'content@globalscion.com',
    first_name: 'Marek',
    last_name: 'Kowalski',
    role: 'editor',
    avatar: null,
    is_active: true,
    last_login: dayjs().subtract(9, 'day').toISOString(),
    date_joined: '2024-09-11T14:30:00Z',
  },
  {
    id: 'usr-005',
    email: 'operations@globalscion.com',
    first_name: 'Leila',
    last_name: 'Farouk',
    role: 'admin',
    avatar: portraitAt(11, 200),
    is_active: false,
    last_login: dayjs().subtract(74, 'day').toISOString(),
    date_joined: '2023-11-05T10:00:00Z',
  },
];

const MEDIA_SEEDS: [keyof typeof SUBJECT_IMAGES, string, string][] = [
  ['conferenceHall', 'plenary-hall-amsterdam.jpg', 'Delegates seated in the main plenary hall'],
  ['presentation', 'keynote-stage-2026.jpg', 'Keynote speaker addressing the auditorium'],
  ['discussion', 'panel-discussion-berlin.jpg', 'Four panellists in discussion on stage'],
  ['posterSession', 'poster-session-walk.jpg', 'Researchers presenting posters to reviewers'],
  ['workshop', 'methods-workshop.jpg', 'Small group workshop around a shared table'],
  ['networkingBreak', 'networking-break.jpg', 'Delegates networking during a refreshment break'],
  ['laboratory', 'research-laboratory.jpg', 'Scientist working at a laboratory bench'],
  ['microscope', 'microscopy-imaging.jpg', 'Close-up of a research microscope'],
  ['aiHealth', 'clinical-ai-screens.jpg', 'Clinical AI dashboard on a hospital display'],
  ['cardiology', 'cardiac-monitoring.jpg', 'Cardiac monitoring equipment in use'],
  ['oncology', 'oncology-research.jpg', 'Oncology researcher reviewing sample data'],
  ['nutrition', 'nutrition-science.jpg', 'Fresh produce arranged for a nutrition study'],
  ['medicalTeam', 'multidisciplinary-team.jpg', 'Multidisciplinary clinical team in conversation'],
  ['studentAudience', 'young-investigators.jpg', 'Young investigator session audience'],
  ['awards', 'awards-ceremony.jpg', 'Award presentation at the closing ceremony'],
  ['cityscape', 'host-city-skyline.jpg', 'Host city skyline at dusk'],
];

export const media: MediaAsset[] = MEDIA_SEEDS.map(([key, fileName, alt], index) => ({
  id: `med-${String(index + 1).padStart(3, '0')}`,
  url: img.card(SUBJECT_IMAGES[key], 1200),
  thumbnail_url: img.card(SUBJECT_IMAGES[key], 400),
  alt_text: alt,
  file_name: fileName,
  mime_type: 'image/jpeg',
  size_bytes: 180_000 + index * 41_337,
  width: 1200,
  height: 792,
  uploaded_at: dayjs().subtract(index * 6 + 2, 'day').toISOString(),
  uploaded_by: users[index % 3].email,
}));

const legalIntro = (title: string) => `
<p>This ${title.toLowerCase()} explains how GlobalScion Conferences Ltd operates its events, its website and its relationship with delegates, speakers, sponsors and partners. It applies to every conference, congress, symposium and webinar organised under the GlobalScion name.</p>
`;

export const pages: SitePage[] = [
  {
    id: 'pg-about',
    slug: 'about',
    title: 'About GlobalScion',
    hero_subtitle: 'A conference organisation built around scientific integrity, not attendance targets.',
    content: `
<p><strong>GlobalScion convenes the researchers, clinicians and industry practitioners who move a field forward — and then gets out of the way.</strong></p>
<p>We were founded on a simple observation: most international conferences are organised around commercial logistics rather than scientific value. Programmes are assembled from invitation lists, sponsors buy speaking slots, and early-career researchers are relegated to a poster board in a corridor. We built GlobalScion to do the opposite.</p>
<h3>How we build a programme</h3>
<p>Every GlobalScion programme starts with an open call for abstracts and a double-blind review by an independent scientific committee. Committee members are appointed for their standing in the field and are explicitly barred from allocating slots to sponsors. Sponsors support the event; they do not shape the science.</p>
<h3>Where we work</h3>
<p>We run events across Europe, the Middle East, Asia-Pacific and North America, and we deliver online editions that reach delegates who cannot travel. Our online programmes are not a downgraded stream of the in-person event — they are designed for remote participation, with moderated discussion and full on-demand access.</p>
<h3>Our commitments</h3>
<ul>
  <li><strong>Quality and rigour.</strong> Independent peer review, published assessment criteria and no pay-to-speak slots.</li>
  <li><strong>Innovation-driven themes.</strong> Programmes shaped by where a field is heading, not by what filled seats last year.</li>
  <li><strong>Inclusivity and accessibility.</strong> Student rates, low- and middle-income country bursaries, captioning and accessible venues as standard.</li>
  <li><strong>A seamless experience.</strong> Punctual sessions, clear signage, responsive support and recordings delivered on time.</li>
</ul>
<h3>Who we work with</h3>
<p>Our delegates are academic researchers, hospital clinicians, allied health professionals, doctoral and postdoctoral scientists, policy makers, and research-focused teams in industry. Our partners include universities, learned societies, hospital networks, publishers and funding bodies across more than fifty countries.</p>
`.trim(),
    seo: {
      meta_title: 'About GlobalScion | International Scientific & Medical Conferences',
      meta_description:
        'GlobalScion organises peer-reviewed international scientific and medical conferences across 50+ countries, built on independent programme review and open abstract submission.',
      og_image: null,
    },
    status: 'published',
    updated_at: dayjs().subtract(6, 'day').toISOString(),
  },
  {
    id: 'pg-contact',
    slug: 'contact',
    title: 'Contact GlobalScion',
    hero_subtitle: 'Speak to the conference secretariat — we answer every enquiry within one working day.',
    content: `
<p>Whether you are submitting an abstract, arranging group registration, exploring a sponsorship or partnership, or need help with visa documentation, the secretariat can help.</p>
<p>Our offices operate across five time zones, so there is always a team on shift during standard business hours somewhere in our network.</p>
`.trim(),
    seo: {
      meta_title: 'Contact Us | GlobalScion Conferences',
      meta_description:
        'Contact the GlobalScion conference secretariat for registration, abstracts, sponsorship, partnerships and delegate support. Offices in the UK, US, India, Germany and the UAE.',
      og_image: null,
    },
    status: 'published',
    updated_at: dayjs().subtract(14, 'day').toISOString(),
  },
  {
    id: 'pg-terms',
    slug: 'terms-and-conditions',
    title: 'Terms & Conditions',
    hero_subtitle: 'The terms governing registration, participation and use of this website.',
    content: `${legalIntro('Terms & Conditions')}
<h3>1. Registration and payment</h3>
<p>Registration is confirmed only on receipt of full payment. Fees are quoted in US dollars unless stated otherwise and exclude any local taxes, bank charges or currency conversion costs applied by your payment provider. A confirmation email and invoice are issued within two working days of a successful payment.</p>
<h3>2. Cancellation and refunds</h3>
<p>Cancellations received more than sixty days before the first day of the event are refunded in full less a processing fee. Cancellations received between sixty and thirty days before the event are refunded at fifty per cent. No refund is available within thirty days of the event, although a registration may be transferred to a named colleague at no charge, or credited in full against the next edition.</p>
<h3>3. Substitution and transfer</h3>
<p>Registered delegates may nominate a substitute in writing at any point up to seventy-two hours before the opening session. Transfers to a different GlobalScion event are permitted once per registration.</p>
<h3>4. Programme changes</h3>
<p>The scientific programme is published in good faith. GlobalScion reserves the right to alter speakers, session order, venue or format where circumstances require it. Where an event is changed to an online format, delegates may choose a partial refund reflecting the difference in registration tier or transfer to a future edition.</p>
<h3>5. Abstracts and intellectual property</h3>
<p>Authors retain copyright in their abstracts and presentation materials. By submitting an abstract you grant GlobalScion a non-exclusive licence to publish it in the book of abstracts and associated conference materials. Recording of sessions by delegates is not permitted without prior written consent.</p>
<h3>6. Conduct</h3>
<p>All participants are expected to observe the GlobalScion code of conduct. Harassment, discrimination and disruptive behaviour will result in removal from the event without refund.</p>
<h3>7. Visas and travel</h3>
<p>Delegates are responsible for obtaining their own travel documentation. GlobalScion issues invitation letters to registered delegates on request but cannot influence consular decisions, and visa refusal is not grounds for a refund outside the cancellation terms above.</p>
<h3>8. Liability</h3>
<p>GlobalScion accepts no liability for personal injury, loss or damage to property, or for travel and accommodation costs incurred where an event is cancelled or postponed due to circumstances beyond its reasonable control. Delegates are strongly advised to hold appropriate travel insurance.</p>
<h3>9. Governing law</h3>
<p>These terms are governed by the laws of England and Wales, and the courts of England and Wales have exclusive jurisdiction over any dispute arising from them.</p>
`,
    seo: {
      meta_title: 'Terms & Conditions | GlobalScion Conferences',
      meta_description:
        'Registration, cancellation, refund, abstract and liability terms for GlobalScion international conferences and webinars.',
      og_image: null,
    },
    status: 'published',
    updated_at: dayjs().subtract(31, 'day').toISOString(),
  },
  {
    id: 'pg-privacy',
    slug: 'privacy-policy',
    title: 'Global Privacy Policy',
    hero_subtitle: 'How we collect, use, store and protect your personal data.',
    content: `${legalIntro('Privacy Policy')}
<h3>1. Who we are</h3>
<p>GlobalScion Conferences Ltd is the data controller for personal data collected through this website and through conference registration. Enquiries about this policy should be directed to our data protection contact at privacy@globalscion.com.</p>
<h3>2. What we collect</h3>
<p>We collect the information you provide when you register for an event, submit an abstract, subscribe to programme announcements or contact the secretariat. This typically includes your name, professional title, institution, country, email address, telephone number and any dietary or accessibility requirements you disclose. Payment details are processed by our payment provider and are never stored on our systems.</p>
<h3>3. Why we process it</h3>
<p>We process your data to administer your registration, review submitted abstracts, issue certificates and invoices, provide delegate support and — where you have consented — notify you about future programmes in your field. We also process aggregated, non-identifying data to plan capacity and improve our events.</p>
<h3>4. Lawful basis</h3>
<p>Our lawful bases are contract performance (delivering the event you registered for), legitimate interests (operating and improving our events) and consent (marketing communications, which you may withdraw at any time using the unsubscribe link in any email).</p>
<h3>5. Sharing</h3>
<p>We share data with service providers who host our platforms, process payments and print delegate materials, always under a written data processing agreement. We do not sell personal data. Sponsor organisations receive only aggregated attendance statistics unless you explicitly opt in to sharing your details at their stand.</p>
<h3>6. International transfers</h3>
<p>Because we operate globally, your data may be processed outside your country of residence. Where data leaves the UK or European Economic Area we rely on adequacy decisions or standard contractual clauses.</p>
<h3>7. Retention</h3>
<p>Registration and financial records are retained for seven years to meet accounting obligations. Marketing contact data is retained until you withdraw consent or after three years of inactivity, whichever comes first.</p>
<h3>8. Your rights</h3>
<p>You have the right to access, correct, erase, restrict or object to the processing of your personal data, and the right to data portability. To exercise any of these rights, contact privacy@globalscion.com. You may also complain to your national supervisory authority.</p>
<h3>9. Cookies</h3>
<p>We use strictly necessary cookies to operate the site and, with your consent, analytics cookies to understand how the site is used. You can manage your preferences at any time through the cookie settings link in the footer.</p>
`,
    seo: {
      meta_title: 'Global Privacy Policy | GlobalScion Conferences',
      meta_description:
        'How GlobalScion collects, uses, stores and protects personal data for delegates, speakers and website visitors, including your rights and our retention periods.',
      og_image: null,
    },
    status: 'published',
    updated_at: dayjs().subtract(31, 'day').toISOString(),
  },
];

export const settings: SiteSettings = {
  website_name: 'GlobalScion',
  tagline: 'Where Ideas Meet Action — Globally',
  logo: null,
  favicon: null,
  contact_email: 'info@globalscion.com',
  support_email: 'support@globalscion.com',
  phone: '+44 20 3993 4471',
  address: '30 Churchill Place, Canary Wharf, London E14 5RE, United Kingdom',
  offices: [
    { country: 'United Kingdom', address: '30 Churchill Place, Canary Wharf, London E14 5RE' },
    { country: 'United States', address: '1201 Orange Street, Suite 600, Wilmington, DE 19801' },
    { country: 'India', address: 'Level 8, Vega Block, Salarpuria Sattva Knowledge City, Hyderabad 500081' },
    { country: 'Germany', address: 'Friedrichstraße 68, 10117 Berlin' },
    { country: 'United Arab Emirates', address: 'Office 1904, Burlington Tower, Business Bay, Dubai' },
  ],
  social: {
    facebook: 'https://facebook.com/globalscion',
    twitter: 'https://x.com/globalscion',
    instagram: 'https://instagram.com/globalscion',
    linkedin: 'https://linkedin.com/company/globalscion',
    youtube: 'https://youtube.com/@globalscion',
  },
  footer_description:
    'GlobalScion convenes researchers, clinicians and industry leaders through peer-reviewed international conferences, congresses and webinars across the medical and life sciences.',
  default_seo: {
    meta_title: 'GlobalScion | International Scientific & Medical Conferences',
    meta_description:
      'Peer-reviewed international scientific and medical conferences, congresses and webinars connecting researchers and clinicians across 50+ countries.',
    og_image: null,
  },
};
