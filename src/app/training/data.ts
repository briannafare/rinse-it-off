export interface Lesson {
  id: string;
  title: string;
  description: string;
  duration: string;
  type: string;
  driveUrl?: string;
  driveId?: string;
}

export type MediaType = 'audio' | 'video' | 'image' | 'pdf';

export interface MediaAsset {
  id: string;
  title: string;
  description?: string;
  type: MediaType;
  driveId: string;
}

export interface TrainingModule {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  week: string;
  icon: string;
  iconBg: string;
  notebookUrl?: string;
  description: string;
  lessons: Lesson[];
  mediaAssets?: MediaAsset[];
}

export interface Resource {
  id: string;
  title: string;
  description: string;
  type: string;
  url?: string;
  driveId?: string;
  icon: string;
}

export const TRAINING_MODULES: TrainingModule[] = [
  {
    id: 'module-1',
    number: '01',
    title: 'Service Operations & Equipment',
    subtitle: 'Know your tools',
    week: 'Week 1',
    icon: '/training/icons/soft-wash.png',
    iconBg: '#EDF7FC',
    notebookUrl: 'https://notebooklm.google.com/notebook/f48bf774-15b9-4dc2-adaf-df615dff4bb6',
    description: 'Master the equipment, rig configuration, and operational procedures that set RIO apart. Hot water systems, soft wash setup, surface cleaners, and the pure water window system.',
    lessons: [
      { id: 'm1-l1', title: 'Equipment & Rig Configuration', description: 'Hydro Tek SS35008HG, soft wash system, surface cleaners, pure water window system', duration: '15 min', type: 'notebook', driveUrl: 'https://notebooklm.google.com/notebook/f48bf774-15b9-4dc2-adaf-df615dff4bb6' },
      { id: 'm1-l2', title: 'Equipment Specs Reference', description: 'Full specs — PSI, GPM, temps, nozzle sizes for every piece of gear', duration: '10 min', type: 'doc', driveId: '1g-ctBVqtcsS3oSmu6s-knU9B0f-QOe_VYwxDZpZXWi4' },
      { id: 'm1-l3', title: 'Industrial Cleaning Equipment Guide', description: 'Visual bento-grid overview of the RIO arsenal', duration: '5 min', type: 'image', driveId: '1zEw0rC-9doCxoatZ--LyCZFi0n71D--a' },
      { id: 'm1-l4', title: 'Employee Field Guide', description: 'Job setup, house washing, concrete, chemical safety, completion checklist', duration: '20 min', type: 'doc', driveId: '1xa-aBm51TNT0AZBoaG9FIHL-kYNnAAhL' },
      { id: 'm1-l5', title: 'Commercial Field Guide', description: 'Commercial standards, hot water degreasing, environmental compliance, parking lots', duration: '20 min', type: 'doc', driveId: '1BFgNS0GKjGeSKo4nB7bU1u3nSsGxyZYh' },
      { id: 'm1-l6', title: 'Daily Truck & Equipment Checklist', description: 'Pre-departure checklist — never skip this step', duration: '5 min', type: 'checklist' },
    ],
    mediaAssets: [
      { id: 'm1-a1', title: 'Built for the Job', description: 'How RIO\'s equipment is purpose-built for commercial exterior work', type: 'video', driveId: '1301_NnYJRK7Vi0aePCgLlvmLLXwQJnmx' },
      { id: 'm1-a2', title: 'Portland vs. The Pacific Northwest', description: 'Why our climate demands a different approach', type: 'video', driveId: '1l_4PO3bGgscRIAvVhXoMHAJ9EkpVKl2E' },
      { id: 'm1-a3', title: 'Why your building is being eaten alive', description: 'The biological growth problem every Portland building faces', type: 'audio', driveId: '1qOo83-TDa_JN-OWXS0Fy4EX5U7S2gKtU' },
      { id: 'm1-a4', title: 'Beating Portland\'s relentless biological growth', description: 'How RIO\'s methodology stops algae, moss, and mildew', type: 'audio', driveId: '1QwwCWTlIkM6zN301fZ1rI-hphjkDBJM3' },
      { id: 'm1-a5', title: 'Portland Biological Growth Cycle', description: 'Visual reference — the year-round growth pattern', type: 'image', driveId: '18FiKLBLU0jBG-whV3wJ6csDRg3DQFoJo' },
      { id: 'm1-a6', title: 'Professional Method-Matching Cleaning Services', description: 'The differentiator visualized', type: 'image', driveId: '1So03kx6BztKAT3IRnzLFga6Hllm4jgbE' },
    ],
  },
  {
    id: 'module-2',
    number: '02',
    title: 'Target Marketing & Sales Comms',
    subtitle: 'Find and reach prospects',
    week: 'Week 1',
    icon: '/training/icons/house-wash.png',
    iconBg: '#F0FFF6',
    notebookUrl: 'https://notebooklm.google.com/notebook/2fd3bedb-5211-44b0-9e52-ed1b375b3848',
    description: "Strategic target identification, market positioning, and how to communicate RIO's value to commercial and residential prospects in the Portland metro.",
    lessons: [
      { id: 'm2-l1', title: 'Strategic Target Marketing', description: 'Who to target, where to find them, and how to position RIO', duration: '18 min', type: 'notebook', driveUrl: 'https://notebooklm.google.com/notebook/2fd3bedb-5211-44b0-9e52-ed1b375b3848' },
      { id: 'm2-l2', title: 'Portland Competitive Landscape', description: 'SNUGS, PDX ProWash, and others — how to position against each', duration: '15 min', type: 'doc', driveId: '1VvekBZb8o9W6XGVwkTsrApET6N4Waf94WJ6tZTMcw-Q' },
      { id: 'm2-l3', title: 'Commercial vs. Residential Sales', description: 'Different approaches for different property types and decision makers', duration: '12 min', type: 'pdf', driveId: '1OHicwS92hajXWZJjP_DwzWNY8VVxIO8u' },
      { id: 'm2-l4', title: 'Brand Voice & Messaging', description: 'Professional. Direct. No-fluff. How to speak the RIO brand.', duration: '8 min', type: 'reference' },
    ],
    mediaAssets: [
      { id: 'm2-a1', title: 'The assessment is the sale', description: 'Why the property walkthrough is your highest-leverage moment', type: 'audio', driveId: '1B0ewsKQhr3Gany-P05zhwMD8tltZ-FdA' },
      { id: 'm2-a2', title: 'Sales Flashcards', description: 'Quick-reference visual — talk tracks and key facts', type: 'image', driveId: '1at3-jGciqybJZ99ZEyC8WvcyZoQpgjOk' },
    ],
  },
  {
    id: 'module-3',
    number: '03',
    title: 'Core Method & Technical Basics',
    subtitle: 'The science behind the clean',
    week: 'Week 1',
    icon: '/training/icons/concrete-deck.png',
    iconBg: '#F5F0FF',
    notebookUrl: 'https://notebooklm.google.com/notebook/d461b604-6959-4b54-92a4-56a2f7cf68ce',
    description: "The Method-Matching Differentiator in detail. Pressure washing vs. soft washing, surface types, chemical application, and the decision tree for every job.",
    lessons: [
      { id: 'm3-l1', title: 'The Method-Matching Differentiator', description: "Every surface assessed before it's cleaned — RIO's core promise", duration: '12 min', type: 'notebook', driveUrl: 'https://notebooklm.google.com/notebook/d461b604-6959-4b54-92a4-56a2f7cf68ce' },
      { id: 'm3-l2', title: 'Surface Cleaning Decision Tree', description: 'Visual flowchart — what method for every surface type', duration: '8 min', type: 'image', driveId: '1rPu7zRwiLLFdjoyEGLlNehnk0RCkSzyw' },
      { id: 'm3-l3', title: 'Surface & Method Matching Reference', description: 'Complete table: PSI, temp, nozzle, chemical by surface type', duration: '10 min', type: 'spreadsheet', driveId: '1wihIBdlTIm6z1IkHT5Ni6u4R0LXRdoTsoF8YQ1OuCNA' },
      { id: 'm3-l4', title: 'Why Pressure Washing Runoff Triggers EPA Fines', description: 'NotebookLM audio deep dive on environmental compliance', duration: '15 min', type: 'audio', driveId: '1QdcCPD-B97Nv4OqCM7m_9U8bMbiOnFC4' },
      { id: 'm3-l5', title: 'Portland Climate & Environmental Compliance', description: 'City Code 17.39, Mobile Washer Discharge Authorization, containment', duration: '10 min', type: 'reference' },
    ],
    mediaAssets: [
      { id: 'm3-a1', title: 'The Physics of Failure', description: 'What goes wrong when pressure, temperature, or chemistry is mismatched', type: 'video', driveId: '1gEC2jhPeVZAuQ5xZL7pcmrwAlfJwk3Lv' },
      { id: 'm3-a2', title: 'Method-matching for commercial exterior cleaning', description: 'Audio deep dive — how to assess and choose the right approach', type: 'audio', driveId: '14w1ruev4cJDqdFx76zShoHfcc1bMetDu' },
      { id: 'm3-a3', title: 'The assessment is the sale', description: 'Pre-cleaning surface evaluation as the close', type: 'audio', driveId: '1C-zU1xsrN5lODVtP4RN4CDJsP6nxw3Hf' },
    ],
  },
  {
    id: 'module-4',
    number: '04',
    title: 'Call Cheat Sheet & Prospecting',
    subtitle: 'Before you pick up the phone',
    week: 'Week 2',
    icon: '/training/icons/gutter-cleaning.png',
    iconBg: '#FFF5F0',
    notebookUrl: 'https://notebooklm.google.com/notebook/c968f26e-e71e-472b-be24-b42c815a665a',
    description: 'Cold call scripts, Google Maps pre-assessment technique, the neighboring contract approach, and CRM documentation requirements.',
    lessons: [
      { id: 'm4-l1', title: 'Call Cheat Sheet & Scripts', description: 'Exact scripts for cold calls, warm leads, and follow-ups', duration: '15 min', type: 'notebook', driveUrl: 'https://notebooklm.google.com/notebook/c968f26e-e71e-472b-be24-b42c815a665a' },
      { id: 'm4-l2', title: 'Google Maps Remote Assessment', description: 'How to pre-assess a property before you ever call or visit', duration: '10 min', type: 'reference' },
      { id: 'm4-l3', title: 'Prospecting & Pipeline Tools', description: 'Neighboring contract approach, CRM documentation, follow-up cadence', duration: '15 min', type: 'pdf', driveId: '1UhdV-ZhWB_eAi5G9w8B3C8s2aMuZEtXp' },
      { id: 'm4-l4', title: 'The 30-Second Elevator Speech', description: 'Soft washing explained cold — memorize this', duration: '5 min', type: 'practice' },
    ],
    mediaAssets: [
      { id: 'm4-a1', title: 'The RIO Psychological Cold Calling Playbook', description: 'Audio playbook on the mindset and script structure that works', type: 'audio', driveId: '1Jeezp41jlRZMh0796H6YZMKYsaGhe-ip' },
      { id: 'm4-a2', title: 'Precision Prospecting', description: 'PDF guide — how to identify and approach high-value targets', type: 'pdf', driveId: '1akWVsLNEB7LbvzMNCtxJeyRBBc0NCeyW' },
      { id: 'm4-a3', title: 'Five-Step Pre-Call Sales Checklist', description: 'Visual checklist for every call', type: 'image', driveId: '1ym7eoy0QWjmZ2jjbWVS0SHWLtEBrmDpx' },
    ],
  },
  {
    id: 'module-5',
    number: '05',
    title: 'Property Assessment',
    subtitle: 'The walkthrough that closes',
    week: 'Week 2',
    icon: '/training/icons/roof-cleaning.png',
    iconBg: '#EDF7FC',
    notebookUrl: 'https://notebooklm.google.com/notebook/7224de8b-1dce-437f-9b15-c3bbe4eb069b',
    description: 'The 5-stage property assessment walkthrough — from arrival to documentation. How to turn a free assessment into a signed contract.',
    lessons: [
      { id: 'm5-l1', title: 'Property Assessment Walkthrough', description: 'The 5-stage process: arrive, walk, document, present, follow up', duration: '20 min', type: 'notebook', driveUrl: 'https://notebooklm.google.com/notebook/7224de8b-1dce-437f-9b15-c3bbe4eb069b' },
      { id: 'm5-l2', title: 'Documentation & Before/After Photos', description: 'What to photograph, how to present findings', duration: '10 min', type: 'reference' },
      { id: 'm5-l3', title: 'Neighboring Contract Script', description: 'The Austin Davis approach adapted for Portland', duration: '8 min', type: 'reference' },
    ],
    mediaAssets: [
      { id: 'm5-a1', title: 'The Property Assessment: Professional Scoping for High-Value Sales', description: 'Video walkthrough — how to run a winning property assessment', type: 'video', driveId: '1decjy29mCgLGuwCArX40TIkzV0hszjgb' },
      { id: 'm5-a2', title: 'Read buildings to win commercial contracts', description: 'Audio — how to read a building like a pro', type: 'audio', driveId: '15q9hGHnVB6fEvWG_OxeZy8_eEjNXtH4p' },
      { id: 'm5-a3', title: 'Property Contamination and Treatment Guide', description: 'Visual reference — common contamination types and the right treatment', type: 'image', driveId: '1iWv297xnsgM01AQTODi8Tnp98COJvzaE' },
      { id: 'm5-a4', title: 'Professional Scoping Reference', description: 'The Property Assessment scoping infographic', type: 'image', driveId: '16_XUghF6VX3pgQrffwpcdPWErLLACeiJ' },
    ],
  },
  {
    id: 'module-6',
    number: '06',
    title: 'Buyer Profiles',
    subtitle: "Know who you're selling to",
    week: 'Week 2',
    icon: '/training/icons/house-wash.png',
    iconBg: '#F0FFF6',
    notebookUrl: 'https://notebooklm.google.com/notebook/3cb78c57-060d-4542-898e-789c44663109',
    description: "Detailed buyer personas — facility managers, property managers, homeowners, HOA boards. Their fears, motivations, and the talk tracks that work.",
    lessons: [
      { id: 'm6-l1', title: 'Buyer Profiles & Personas', description: "Who you're selling to — their role, fears, and decision process", duration: '18 min', type: 'notebook', driveUrl: 'https://notebooklm.google.com/notebook/3cb78c57-060d-4542-898e-789c44663109' },
      { id: 'm6-l2', title: 'Talk Tracks by Buyer Type', description: 'Custom conversation flows for each persona', duration: '12 min', type: 'reference' },
      { id: 'm6-l3', title: 'Commercial Property Manager Track', description: 'The full conversation from intro to close', duration: '10 min', type: 'reference' },
      { id: 'm6-l4', title: 'Residential Homeowner Track', description: 'Approaching homeowners — from first call to signed contract', duration: '10 min', type: 'reference' },
    ],
    mediaAssets: [
      { id: 'm6-a1', title: 'Sell Psychological Relief, Not Exterior Cleaning', description: 'Audio — the emotional sale behind every property cleaning', type: 'audio', driveId: '1t84Q2dxMgWyubUu94Am5r6Q6A4CvaKaR' },
      { id: 'm6-a2', title: 'The Buyer Matrix Infographic', description: 'Visual — all buyer personas at a glance', type: 'image', driveId: '1WRuPg9i8uvN2JjlboERgrZZ_q39dhD9z' },
    ],
  },
  {
    id: 'module-7',
    number: '07',
    title: 'Objection Handling',
    subtitle: 'Every "no" has an answer',
    week: 'Week 3',
    icon: '/training/icons/gutter-guard.png',
    iconBg: '#F5F0FF',
    notebookUrl: 'https://notebooklm.google.com/notebook/137ffca0-6b97-48bd-bc66-1caf9dee6282',
    description: '"Too expensive," "I\'ll do it myself," "Let me think about it" — every objection with wrong answer, right answer, and the psychology behind it.',
    lessons: [
      { id: 'm7-l1', title: 'Objection Handling Playbook', description: 'Every common objection with wrong/right responses + psychology', duration: '20 min', type: 'notebook', driveUrl: 'https://notebooklm.google.com/notebook/137ffca0-6b97-48bd-bc66-1caf9dee6282' },
      { id: 'm7-l2', title: '"Too Expensive" Responses', description: 'Price objection reframes that actually work', duration: '8 min', type: 'reference' },
      { id: 'm7-l3', title: '"I\'ll Do It Myself" Responses', description: 'DIY objection — equipment, chemicals, and results gap', duration: '8 min', type: 'reference' },
      { id: 'm7-l4', title: 'Tire-Kicker Disqualification', description: 'When to walk away — and how to do it professionally', duration: '5 min', type: 'reference' },
    ],
    mediaAssets: [
      { id: 'm7-a1', title: 'An objection almost never means no', description: 'Audio — reframing objections as buying signals', type: 'audio', driveId: '1Xt3H7XdchnJ81bdiv0J8_hP_dSCm0nPa' },
    ],
  },
  {
    id: 'module-8',
    number: '08',
    title: 'Pricing & Proposals',
    subtitle: 'Close with confidence',
    week: 'Week 3',
    icon: '/training/icons/concrete-deck.png',
    iconBg: '#FFF5F0',
    notebookUrl: 'https://notebooklm.google.com/notebook/f0f39241-b7bf-4c47-be0d-0d9d4b808461',
    description: 'Pricing psychology, benchmark rates, proposal structure, recurring maintenance framing, and the follow-up cadence that closes.',
    lessons: [
      { id: 'm8-l1', title: 'Pricing & Proposal Strategy', description: 'Benchmark rates, price psychology, 3-tier anchoring', duration: '18 min', type: 'notebook', driveUrl: 'https://notebooklm.google.com/notebook/f0f39241-b7bf-4c47-be0d-0d9d4b808461' },
      { id: 'm8-l2', title: 'Recurring Maintenance Programs', description: 'Monthly, quarterly, seasonal — the upsell that retains', duration: '10 min', type: 'reference' },
      { id: 'm8-l3', title: 'Proposal Structure & Templates', description: 'Written proposals that close commercial work', duration: '12 min', type: 'reference' },
      { id: 'm8-l4', title: 'Commission Structure', description: '15% one-time, up to 22% on monthly contracts, bonuses to 35-45%', duration: '5 min', type: 'reference' },
    ],
    mediaAssets: [
      { id: 'm8-a1', title: 'Stop pricing your services from fear', description: 'Audio — pricing psychology and confidence on the close', type: 'audio', driveId: '1KM4CQpO2jO3HKIQuigBwyQyB6DWPmhWz' },
      { id: 'm8-a2', title: 'The X-Ray Proposal Playbook', description: 'PDF — the full proposal framework with templates', type: 'pdf', driveId: '1u1EFmhID_rGPVxFE-cJQ9Sc9taPql6YM' },
    ],
  },
];

export const RESOURCE_LINKS: Resource[] = [
  { id: 'master-kb', title: 'RIO Master Knowledge Base', description: 'Ask any question about RIO — AI-powered reference', type: 'notebook', url: 'https://notebooklm.google.com/notebook/1f6cfdc0-3a1a-45d6-9e05-48e32c8a7265', icon: 'sparkle' },
  { id: 'emp-field-guide', title: 'Employee Field Guide', description: 'Complete residential field operations reference', type: 'doc', driveId: '1xa-aBm51TNT0AZBoaG9FIHL-kYNnAAhL', icon: 'file' },
  { id: 'com-field-guide', title: 'Commercial Field Guide', description: 'Commercial operations, environmental compliance, hot water', type: 'doc', driveId: '1BFgNS0GKjGeSKo4nB7bU1u3nSsGxyZYh', icon: 'file' },
  { id: 'equip-specs', title: 'Equipment Specs', description: 'Full rig configuration and specs', type: 'doc', driveId: '1g-ctBVqtcsS3oSmu6s-knU9B0f-QOe_VYwxDZpZXWi4', icon: 'file' },
  { id: 'comp-landscape', title: 'Portland Competitive Landscape', description: 'Every competitor and how to position against them', type: 'doc', driveId: '1VvekBZb8o9W6XGVwkTsrApET6N4Waf94WJ6tZTMcw-Q', icon: 'file' },
  { id: 'surface-ref', title: 'Surface & Method Reference', description: 'PSI, temp, nozzle, and chemical by surface type', type: 'spreadsheet', driveId: '1wihIBdlTIm6z1IkHT5Ni6u4R0LXRdoTsoF8YQ1OuCNA', icon: 'file' },
  { id: 'decision-tree', title: 'Method Decision Tree', description: 'Visual flowchart for surface cleaning methods', type: 'image', driveId: '1rPu7zRwiLLFdjoyEGLlNehnk0RCkSzyw', icon: 'file' },
];

export const ELEVATOR_SPEECH = {
  title: 'The 30-Second Elevator Speech',
  subtitle: 'Soft washing explained cold — memorize this, practice it, own it.',
  script: `We're Rinse It Off — we do commercial and residential exterior cleaning across the Portland metro. Pressure washing, soft washing, roof and gutter cleaning. The difference is we match the method to the surface. Every property gets assessed first, so we're using the right pressure, the right temperature, the right chemistry. No damage, no shortcuts. We're licensed, insured, and we give free property assessments — no pressure, just an honest look at what your building needs.`,
  tips: [
    'Lead with the company name and what you do',
    "Hit \"method-matching\" — it's the differentiator",
    'Mention the free property assessment',
    'Keep it under 30 seconds — time yourself',
    'Make it conversational, not robotic',
    'End with a question: "Does that make sense to talk about?"',
  ],
};

export const QUICK_REFERENCE = {
  company: {
    name: 'Rinse It Off',
    tagline: 'Your property is an asset — we treat it like one.',
    phone: '(503) 704-3755',
    email: 'hello@rinseitoff.com',
    location: 'Tigard, OR 97224',
    ceo: 'Brianna Lindley',
    entity: 'Fresh Rinse, LLC',
    website: 'rinseitoff.com',
  },
  serviceArea: [
    'Portland', 'Beaverton', 'Lake Oswego', 'Tigard',
    'Tualatin', 'West Linn', 'Gresham', 'Milwaukie',
    'Hillsboro', 'Willamette Valley',
  ],
  services: [
    { name: 'Building Washing', desc: 'Commercial exterior, hot & cold water systems' },
    { name: 'Parking Lot Degreasing', desc: 'Hot water for oil, gum, high-traffic surface cleaning' },
    { name: 'Roof & Gutter Cleaning', desc: 'Moss treatment, debris clearing, full flush' },
    { name: 'Soft Washing', desc: 'Low-pressure, biodegradable, delicate surfaces' },
    { name: 'Concrete & Deck', desc: 'Hot-water pressure, oil & moss removal' },
    { name: 'Window Cleaning', desc: 'RO pure water-fed pole system, streak-free' },
    { name: 'Fleet Washing', desc: 'Vehicle fleet exterior maintenance' },
    { name: 'Recurring Maintenance', desc: 'Monthly, quarterly, seasonal plans' },
  ],
  brandVoice: {
    tone: 'Professional. Direct. No-fluff.',
    description: 'Speak to property managers and owners like a trusted operator — facts, methodology, and outcomes. No hype.',
    donts: [
      'Don\'t say "cheap" or "discount"',
      'Don\'t bash competitors by name',
      "Don't promise timelines you can't keep",
      "Don't skip the assessment step",
      'Don\'t pressure — our CTA is "free assessment"',
    ],
  },
  keyFacts: [
    { label: 'Differentiator', value: 'Method-matching: right pressure, temp, chemistry for every surface' },
    { label: 'Chemical Process', value: 'Downstream injection of diluted SH + eco-friendly degreaser + surfactant' },
    { label: 'Hot Water Spec', value: 'Hydro Tek SS35008HG — 3,500 PSI, 8 GPM, 200°F+' },
    { label: 'Soft Wash', value: 'Honda GX200 + Midwest Hydro-Mixer XL proportioning system' },
    { label: 'Window System', value: 'RO pure water, 0-5 ppm TDS, water-fed pole' },
    { label: 'Surface Cleaner', value: 'BE Whirl-A-Way — 28" commercial for parking lots' },
  ],
};
