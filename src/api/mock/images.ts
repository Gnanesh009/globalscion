/**
 * Image URLs only — no binaries live in the frontend bundle.
 * In production these strings are replaced verbatim by URLs served from the
 * Django media library, so nothing downstream needs to change.
 */
const CDN = 'https://images.unsplash.com';

const build = (id: string, w: number, h: number) =>
  `${CDN}/${id}?auto=format&fit=crop&w=${w}&h=${h}&q=80`;

export const img = {
  /** Wide editorial/hero imagery */
  wide: (id: string, w = 1600) => build(id, w, Math.round(w * 0.5625)),
  /** 3:2 card imagery */
  card: (id: string, w = 800) => build(id, w, Math.round(w * 0.66)),
  /** Square portraits */
  portrait: (id: string, w = 480) => build(id, w, w),
};

export const HERO_IMAGES = {
  globalCollaboration: 'photo-1523240795612-9a054b0db644',
  auditorium: 'photo-1540575467063-178a50c2df87',
  handshake: 'photo-1559757148-5c350d0d3c56',
  lecture: 'photo-1517048676732-d65bc937f952',
  panel: 'photo-1505373877841-8d25f7d46678',
  networking: 'photo-1511578314322-379afb476865',
} as const;

export const SUBJECT_IMAGES = {
  laboratory: 'photo-1576091160550-2173dba999ef',
  microscope: 'photo-1582719508461-905c673771fd',
  neuroscience: 'photo-1559757148-5c350d0d3c56',
  brainScan: 'photo-1559757175-0eb30cd8c063',
  medicalTeam: 'photo-1516321318423-f06f85e504b3',
  aiHealth: 'photo-1581091226825-a6a2a5aee158',
  dataScience: 'photo-1551288049-bebda4e38f71',
  nutrition: 'photo-1512069772995-ec65ed45afd6',
  cardiology: 'photo-1628595351029-c2bf17511435',
  oncology: 'photo-1579154204601-01588f351e67',
  publicHealth: 'photo-1532094349884-543bc11b234d',
  pharmacy: 'photo-1550751827-4bd374c3f58b',
  dentistry: 'photo-1606811841689-23dfddce3e95',
  nursing: 'photo-1587825140708-dfaf72ae4b04',
  mentalHealth: 'photo-1499209974431-9dddcece7f88',
  studentAudience: 'photo-1531482615713-2afd69097998',
  conferenceHall: 'photo-1487958449943-2429e8be8625',
  cityscape: 'photo-1454165804606-c3d57bc86b40',
  workshop: 'photo-1573164713988-8665fc963095',
  discussion: 'photo-1543269865-cbf427effbad',
  presentation: 'photo-1524178232363-1fb2b075b655',
  networkingBreak: 'photo-1524995997946-a1c2e315a42f',
  posterSession: 'photo-1497366216548-37526070297c',
  awards: 'photo-1431540015161-0bf868a2d407',
  team: 'photo-1497366754035-f200968a6e72',
} as const;

/** Deliberately diverse portrait pool for speakers, reviewers and admin users. */
export const PORTRAITS = [
  'photo-1580489944761-15a19d654956',
  'photo-1573496359142-b8d87734a5a2',
  'photo-1559839734-2b71ea197ec2',
  'photo-1622253692010-333f2da6031d',
  'photo-1537368910025-700350fe46c7',
  'photo-1612349317150-e413f6a5b16d',
  'photo-1594824476967-48c8b964273f',
  'photo-1607990281513-2c110a25bd8c',
  'photo-1582750433449-648ed127bb54',
  'photo-1651008376811-b90baee60c1f',
  'photo-1631217868264-e5b90bb7e133',
  'photo-1584467735815-f778f274e296',
  'photo-1557862921-37829c790f19',
  'photo-1568602471122-7832951cc4c5',
  'photo-1519085360753-af0119f7cbe7',
  'photo-1544005313-94ddf0286df2',
  'photo-1500648767791-00dcc994a43e',
  'photo-1438761681033-6461ffad8d80',
  'photo-1494790108377-be9c29b29330',
  'photo-1507003211169-0a1dd7228f2d',
  'photo-1592621385612-4d7129426394',
  'photo-1551836022-d5d88e9218df',
  'photo-1560250097-0b93528c311a',
  'photo-1573497019940-1c28c88b4f3e',
  'photo-1556157382-97eda2d62296',
  'photo-1580894732444-8ecded7900cd',
  'photo-1521737604893-d14cc237f11d',
  'photo-1517245386807-bb43f82c33c4',
  'photo-1591035897819-f4bdf739f446',
  'photo-1568992687947-868a62a9f521',
] as const;

export const portraitAt = (index: number, size = 480) =>
  img.portrait(PORTRAITS[index % PORTRAITS.length], size);
