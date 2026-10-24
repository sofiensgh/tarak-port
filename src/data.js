export const profile = {
  name: 'Tarek Mazouzi',
  role: 'Telecom Consultant',
  focus: 'RAN & Radio',
  email: 'mazouzi2002@gmail.com',
  phone: '+216 27 119 439',
  phoneHref: '+21627119439',
  location: 'Tunis, Tunisia',
  cv: '/Tarek_Mazouzi_CV.pdf',
  summary:
    'Telecom Consultant specialized in 4G/5G mobile networks and radio performance, with 2+ years of hands-on experience in SSV, VoLTE, inter-operator benchmarking and RF analysis. Completed 600+ SSV site visits across Ericsson and Nokia environments, using Nemo Outdoor and Nemo Analyze for network measurement, post-processing and KPI analysis.',
  rotating: [
    '4G / 5G Site Verification',
    'VoLTE & SRVCC Testing',
    'Inter-Operator Benchmarking',
    'RF Analysis & Optimization',
    'Drive Testing',
  ],
};

export const stats = [
  { value: 600, suffix: '+', label: 'SSV site visits', sub: 'Ericsson & Nokia environments' },
  { value: 2, suffix: '+', label: 'Years in the field', sub: 'RAN & radio performance' },
  { value: 4, suffix: '', label: 'Partner environments', sub: 'Ericsson · Nokia · Ooredoo · TT' },
  { value: 3, suffix: '', label: 'Working languages', sub: 'Arabic · French · English' },
];

export const experience = [
  {
    channel: 'CH-01',
    title: '4G/5G SSV: Ericsson & Nokia',
    role: 'Telecom Consultant, RAN & Radio',
    org: 'Telcotec',
    clients: 'Ericsson, Nokia / Ooredoo',
    period: '07/2024 — Present',
    live: true,
    metrics: [
      { v: '500+', l: 'SSV sites · Ericsson' },
      { v: '100+', l: 'SSV sites · Ooredoo / Nokia' },
    ],
    bullets: [
      'Conducted 500+ SSV site visits nationwide to verify and validate radio and service performance.',
      'Performed 4G/5G field testing and analyzed RF/service KPIs including RSRP, RSRQ, SINR and throughput.',
      'Used Nemo Outdoor for field measurements and Nemo Analyze for post-processing, KPI analysis and anomaly identification.',
      'Conducted 100+ SSV site visits on the Ooredoo network (Nokia) for site validation and performance verification.',
      'Analyzed coverage, quality and performance anomalies and contributed to technical reporting and site acceptance.',
    ],
    tags: ['SSV', 'RSRP', 'RSRQ', 'SINR', 'Throughput', 'Nemo Outdoor', 'Nemo Analyze'],
  },
  {
    channel: 'CH-02',
    title: 'VoLTE Performance & Optimization',
    role: 'Ericsson Project',
    org: 'Telcotec',
    clients: 'Ericsson',
    period: 'Project',
    bullets: [
      'Conducted VoLTE testing covering call setup and accessibility, Drop Call Rate (DCR) and voice service continuity.',
      'Tested 4G-to-4G mobility and handover during active VoLTE calls, identifying mobility-related service interruptions.',
      'Performed SRVCC testing to validate voice continuity during 4G-to-3G/2G mobility.',
      'Assessed voice quality using MOS and correlated service performance with RSRP, RSRQ and SINR.',
      'Analyzed SIP signaling and performed Nemo Analyze post-processing for troubleshooting and radio optimization.',
    ],
    tags: ['VoLTE', 'SRVCC', 'Handover', 'DCR', 'MOS', 'SIP'],
  },
  {
    channel: 'CH-03',
    title: 'Inter-Operator Benchmarking',
    role: 'Tunisie Telecom · Network Benchmarking Project',
    org: 'Telcotec',
    clients: 'Tunisie Telecom',
    period: 'Project',
    bullets: [
      'Conducted 4G/5G drive tests for comparative network performance assessment across operators.',
      'Performed short- and long-call testing, call success rate analysis and MOS evaluation.',
      'Performed HTTP testing and analyzed HTTP Success Rate and related service KPIs.',
      'Collected and analyzed RF/service KPIs using Nemo Outdoor / Nemo Analyze and contributed to technical reporting.',
    ],
    tags: ['Drive Test', 'Benchmarking', 'CSSR', 'MOS', 'HTTP SR'],
  },
  {
    channel: 'CH-04',
    title: 'National Benchmarking',
    role: 'Instance Nationale des Télécommunications (INT)',
    org: 'Telcotec',
    clients: 'INT',
    period: 'Project',
    bullets: [
      'Assessed comparative 4G/5G network performance through inter-operator drive-test campaigns.',
      'Performed short- and long-call testing, call success rate analysis and MOS evaluation.',
      'Performed HTTP, web browsing and video streaming tests, analyzing related KPIs and end-user experience.',
      'Analyzed results and compared operator performance to support assessment and technical reporting.',
    ],
    tags: ['Drive Test', 'Web Browsing', 'Video Streaming', 'QoE'],
  },
  {
    channel: 'CH-05',
    title: 'Telecom Infrastructure Controller',
    role: 'Subcontractor, Ministry of Interior',
    org: 'Telcotec',
    period: '07/2025 — 12/2025',
    bullets: [
      'Audited telecom towers and equipment against national safety and compliance requirements.',
      'Prepared validation and compliance reports and coordinated with field teams to resolve non-compliance issues.',
    ],
    tags: ['Infrastructure Audit', 'Compliance', 'Reporting'],
  },
  {
    channel: 'CH-06',
    title: 'GIS Developer: Network Infrastructures',
    role: 'PFE Internship · National Guard Project',
    org: 'Telcotec',
    period: '02/2024 — 06/2024',
    bullets: [
      'Contributed to a GIS project for managing and monitoring network infrastructure.',
      'Designed and updated geospatial databases and developed visualization and analysis tools.',
    ],
    tags: ['GIS', 'Geospatial DB', 'Data Visualization'],
  },
];

export const skillBands = [
  { id: 'net', label: 'Mobile Networks', freq: '700 – 3800 MHz', items: ['2G', '3G', '4G LTE', '5G NR', 'VoLTE'] },
  { id: 'kpi', label: 'RF / Service KPIs', freq: 'KPI band', items: ['RSRP', 'RSRQ', 'SINR', 'Throughput', 'MOS', 'DCR', 'HTTP SR'] },
  { id: 'mob', label: 'VoLTE / Mobility', freq: 'IMS band', items: ['Call Setup', 'Accessibility', 'Handover', '4G Mobility', 'SRVCC', 'SIP'] },
  { id: 'act', label: 'Activities', freq: 'Field band', items: ['Drive Test', 'SSV', 'RF Benchmark', 'Radio Optim.', 'Infra Audit'] },
  { id: 'dev', label: 'Development', freq: 'Dev band', items: ['MERN Stack', 'Flutter', 'MySQL', 'SQL', 'Python', 'Git', 'GIS'] },
];

export const radarTargets = [
  { label: 'Ericsson', angle: 20, r: 0.72, kind: 'vendor' },
  { label: 'Nokia', angle: 95, r: 0.55, kind: 'vendor' },
  { label: 'Ooredoo', angle: 150, r: 0.8, kind: 'operator' },
  { label: 'Tunisie Telecom', angle: 215, r: 0.62, kind: 'operator' },
  { label: 'INT', angle: 265, r: 0.42, kind: 'operator' },
  { label: 'Nemo Outdoor', angle: 315, r: 0.78, kind: 'tool' },
  { label: 'Nemo Analyze', angle: 55, r: 0.36, kind: 'tool' },
  { label: 'Atol', angle: 185, r: 0.3, kind: 'tool' },
];

export const education = {
  degree: "Bachelor's Degree in Information Systems Development",
  school: 'ISET Gafsa: Institut Supérieur des Études Technologiques de Gafsa',
  period: '2021 — 2024',
  note: 'Applied technical training in software development and network systems.',
};

export const languages = [
  { name: 'Arabic', level: 'Native', bars: 5 },
  { name: 'French', level: 'Professional working', bars: 4 },
  { name: 'English', level: 'Professional working', bars: 4 },
];

export const leadership = {
  title: 'Project Manager & Event Manager',
  org: 'Associative Projects · Gafsa',
  period: '2021 — 2024',
  bullets: [
    'Led 3 associative projects from planning through delivery.',
    'Organized events and coordinated teams of 10+ members.',
    'Managed project budgets and resources for efficient delivery.',
  ],
};
