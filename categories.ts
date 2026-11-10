import type { Category } from './types';

export const CATEGORIES: Category[] = [
  { handle: 'markers', title: 'Markers', short: 'Reflective markers, 1.5 mm to 25.4 mm',
    blurb: 'Retroreflective hard, soft and facial markers from 1.5 mm to 25.4 mm — threaded, on bases or self-adhesive.', art: 'marker' },
  { handle: 'suits-gloves', title: 'Suits & Gloves', short: 'Mocap SX and PEX suits, gloves and IDs',
    blurb: 'Professional motion capture suits, gloves, boots and colour ID patches for performers of every size.', art: 'suit' },
  { handle: 'kits', title: 'Kits & Bundles', short: 'Everything for a session in one case',
    blurb: 'Field-specific accessory kits for life sciences, VFX, tracking and facial capture.', art: 'kit' },
  { handle: 'bases-bands-joints', title: 'Bases, Bands & Joints', short: 'Attach markers to people',
    blurb: 'Neoprene bases, joint packs, threaded adaptors and bands to attach markers securely to subjects.', art: 'joint' },
  { handle: 'rigid-bodies-straps', title: 'Rigid Bodies & Straps', short: 'Track objects and limbs as one unit',
    blurb: 'Fixed marker plates, hand and foot straps and spares so an object or limb tracks as a single rigid body.', art: 'rigid' },
  { handle: 'active-vr-tracking', title: 'Active & VR Tracking', short: 'LED clusters and stereo glasses frames',
    blurb: 'Active LED tracking with Pulsar clusters and Nova Active Strand, plus clip-on frames for stereo glasses.', art: 'active' },
  { handle: 'tape-adhesives', title: 'Tape & Adhesives', short: 'Double-sided, micropore and Velcro',
    blurb: 'Double-sided, micropore, kinesiology and retroreflective tape plus Velcro hooks and loops.', art: 'tape' },
  { handle: 'software-licences', title: 'Software Licences', short: 'Nexus, Shōgun and Tracker',
    blurb: 'Subscription licences for Vicon software, delivered digitally — no shipping required.', art: 'licence' },
];

export const getCategory = (handle: string) => CATEGORIES.find((c) => c.handle === handle);
