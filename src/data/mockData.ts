import type { Researcher, Dataset, FundingOpportunity, Methodology } from '../utils/matchingEngine.ts';

export interface ProjectWorkspace {
  id: string;
  title: string;
  abstract: string;
  domain: string;
  status: 'In Planning' | 'Active Data Collection' | 'Analysis & Synthesis' | 'Manuscript Drafting' | 'Under Review';
  leadResearcher: string;
  leadInstitution: string;
  createdDate: string;
  targetCompletion: string;
  members: {
    id: string;
    name: string;
    role: string;
    institution: string;
    country: string;
    avatarInitials: string;
  }[];
  methodology: string;
  methodologyDetails: string;
  datasets: string[];
  tools: string[];
  literature: {
    title: string;
    authors: string;
    year: number;
    journal: string;
    doi: string;
  }[];
  milestones: {
    id: string;
    title: string;
    dueDate: string;
    status: 'Completed' | 'In Progress' | 'Upcoming';
    owner: string;
  }[];
  sdgGoals: number[];
}

export interface ResearchCommunity {
  id: string;
  name: string;
  category: string;
  membersCount: number;
  description: string;
  activeDiscussions: number;
  recentTopic: string;
}

export interface ResearchEvent {
  id: string;
  title: string;
  organizer: string;
  date: string;
  time: string;
  location: string;
  isVirtual: boolean;
  registeredCount: number;
  description: string;
}

export interface JournalMatch {
  id: string;
  journalName: string;
  publisher: string;
  impactFactor: number;
  matchPercentage: number;
  openAccess: boolean;
  avgReviewWeeks: number;
  focusAlignment: string;
}

export interface ImpactRecord {
  id: string;
  type: 'Policy Brief' | 'Spin-off / AgTech Pilot' | 'Methodological Package' | 'Capacity Building';
  title: string;
  organizationBeneficiary: string;
  sdgs: number[];
  date: string;
  metrics: string;
  doiOrUrl?: string;
}

export const INITIAL_RESEARCHERS: Researcher[] = [
  {
    id: 'res-wanjiru',
    name: 'Dr. Wanjiru Karanja',
    title: 'Senior Agricultural Biostatistician & Econometrician',
    institution: 'University of Nairobi',
    country: 'Kenya',
    bio: 'Lead researcher specializing in agricultural credit impact evaluations, econometric modeling with staggered panel data, and rural household survey statistics in East Africa.',
    expertise: ['Agricultural Finance', 'Applied Statistics', 'Econometrics', 'Household Surveys', 'Rural Credit'],
    datasetsUsed: ['Kenya KNBS Agri-Census', 'FinAccess Kenya 2021', 'KALRO Western Soils Panel'],
    methodologies: ['Difference-in-Differences', 'Instrumental Variables', 'Propensity Score Matching'],
    hIndex: 21,
    availableHoursPerWeek: 12,
    acceptingCollaborations: true,
    verified: true
  },
  {
    id: 'res-kwame',
    name: 'Prof. Kwame Mensah',
    title: 'Professor of Climate Adaptation & Resource Economics',
    institution: 'Kwame Nkrumah University of Science and Technology (KNUST)',
    country: 'Ghana',
    bio: 'Over 18 years investigating climatic variability impacts on cocoa and grain yields, agrarian finance risk mitigation, and West African farmer cooperative models.',
    expertise: ['Climate Adaptation', 'Agricultural Economics', 'Risk Finance', 'Cooperative Models'],
    datasetsUsed: ['Ghana Living Standards Survey', 'West Africa Meteorological Grids'],
    methodologies: ['Spatial Econometrics', 'Structural Equation Modeling', 'Randomized Controlled Trials'],
    hIndex: 32,
    availableHoursPerWeek: 8,
    acceptingCollaborations: true,
    verified: true
  },
  {
    id: 'res-elena',
    name: 'Dr. Elena Rostova',
    title: 'Associate Professor in Spatial Epidemiology',
    institution: 'Stellenbosch University',
    country: 'South Africa',
    bio: 'Spatial disease modeling, vector distribution epidemiology, and Bayesian hierarchical geostatistics for sub-Saharan public health interventions.',
    expertise: ['Spatial Epidemiology', 'Biostatistics', 'Bayesian Modeling', 'GIS & Remote Sensing'],
    datasetsUsed: ['WHO Malaria Surveillance Grid', 'SADHS Health Surveys'],
    methodologies: ['Bayesian Spatial CAR Models', 'Point Pattern Analysis'],
    hIndex: 18,
    availableHoursPerWeek: 10,
    acceptingCollaborations: true,
    verified: true
  },
  {
    id: 'res-marcus',
    name: 'Dr. Marcus Vance',
    title: 'Lead Research Scientist in Machine Learning',
    institution: 'Imperial College London',
    country: 'United Kingdom',
    bio: 'Specialist in deep neural architectures, self-supervised representations for biological sequences, and multimodal transformer pipelines.',
    expertise: ['Deep Learning', 'PyTorch', 'Computer Vision', 'Genomics ML'],
    datasetsUsed: ['Allen Brain Observatory', 'Ensembl Genomic Repositories'],
    methodologies: ['Transformer Encoders', 'Graph Neural Networks'],
    hIndex: 27,
    availableHoursPerWeek: 6,
    acceptingCollaborations: false,
    verified: true
  },
  {
    id: 'res-amara',
    name: 'Dr. Amara Okafor',
    title: 'Senior Plant Geneticist & Molecular Biologist',
    institution: 'University of Ibadan',
    country: 'Nigeria',
    bio: 'Pioneering genomics and CRISPR editing for drought-resistant cassava and maize varieties across humid and sub-humid tropical agro-ecologies.',
    expertise: ['Crop Genomics', 'CRISPR Cas9', 'Plant Breeding', 'Molecular Markers'],
    datasetsUsed: ['IITA Germplasm Bank', 'NCBI Crop Genomes'],
    methodologies: ['Genome-Wide Association (GWAS)', 'Marker-Assisted Selection'],
    hIndex: 19,
    availableHoursPerWeek: 15,
    acceptingCollaborations: true,
    verified: true
  },
  {
    id: 'res-brian',
    name: 'Dr. Brian Ochieng',
    title: 'Data Systems Architect & Environmental Economist',
    institution: 'Strathmore University / ILRI',
    country: 'Kenya',
    bio: 'Focuses on mobile money transaction streams, farmer data cooperatives, and digital agriculture platforms in Kenya and Rwanda.',
    expertise: ['Agricultural Finance', 'Data Engineering', 'Mobile Money', 'Applied Econometrics'],
    datasetsUsed: ['Safaricom Agri-Wallet Anonymized', 'KNBS Economic Survey'],
    methodologies: ['Quasi-Experimental Design', 'Time-Series Econometrics'],
    hIndex: 14,
    availableHoursPerWeek: 14,
    acceptingCollaborations: true,
    verified: true
  }
];

export const INITIAL_DATASETS: Dataset[] = [
  {
    id: 'ds-knbs-agri',
    title: 'KNBS Kenya Agricultural & Microfinance Survey 2024',
    publisher: 'Kenya National Bureau of Statistics (KNBS)',
    countryOrRegion: 'Kenya',
    domain: 'Agricultural Economics',
    license: 'Open Data / CC-BY-4.0',
    description: 'Comprehensive cross-sectional microdata covering 12,400 rural households across 47 Kenyan counties, tracking formal credit uptake, mobile agri-loans, and crop yield outcomes.',
    tags: ['Kenya', 'Agriculture', 'Finance', 'Credit Access', 'Microfinance', 'Crop Yields'],
    recordCount: 12400
  },
  {
    id: 'ds-kalro-soil',
    title: 'KALRO Western Kenya Soil Nutrient & Yield Longitudinal Panel (2018–2024)',
    publisher: 'Kenya Agricultural and Livestock Research Organization (KALRO)',
    countryOrRegion: 'Kenya',
    domain: 'Agronomy & Soil Science',
    license: 'Academic Research License',
    description: 'Six-year repeated measurement panel of soil pH, nitrogen-phosphorus indices, fertilizer subsidy adoption, and harvest outputs in Bungoma, Kakamega, and Kisumu.',
    tags: ['Kenya', 'Soil Science', 'Longitudinal Panel', 'Fertilizer Subsidies', 'Maize'],
    recordCount: 3820
  },
  {
    id: 'ds-finaccess-2021',
    title: 'FinAccess National Financial Inclusion Survey 2021 Microdata',
    publisher: 'Central Bank of Kenya & FSD Kenya',
    countryOrRegion: 'Kenya',
    domain: 'Development Finance',
    license: 'Public Domain',
    description: 'Nationally representative survey analyzing financial health, digital credit resilience, and informal saving groups among smallholder farming households.',
    tags: ['Kenya', 'Financial Inclusion', 'Mobile Money', 'Rural Credit'],
    recordCount: 8660
  },
  {
    id: 'ds-cgiar-climate',
    title: 'CGIAR East Africa Agro-Climatic Spatial Grid (1km Resolution)',
    publisher: 'CGIAR Research Program on Climate Change',
    countryOrRegion: 'East Africa',
    domain: 'Climatology & Agronomy',
    license: 'CC-BY-4.0',
    description: 'Gridded historical and projected precipitation, temperature anomaly, and drought index metrics covering Kenya, Uganda, and Tanzania from 1990 to 2026.',
    tags: ['East Africa', 'Agro-Climate', 'Precipitation', 'Spatial Grid'],
    recordCount: 450000
  }
];

export const INITIAL_FUNDING: FundingOpportunity[] = [
  {
    id: 'fund-gates-agri',
    title: 'Sub-Saharan Smallholder Financial Resilience & Data Systems Grant',
    funder: 'Bill & Melinda Gates Foundation',
    amount: '$450,000 USD',
    deadline: 'November 30, 2026',
    eligibleRegions: ['Kenya', 'Uganda', 'Tanzania', 'Sub-Saharan Africa'],
    domains: ['Agricultural Finance', 'Applied Statistics', 'Rural Development'],
    summary: 'Multi-institutional funding stream dedicated to rigorous empirical evaluation of digital financial tools and credit mechanisms for smallholder farmer climate adaptation.',
    originUrl: 'https://www.gatesfoundation.org/ideas/grant-opportunities/sub-saharan-smallholder-financial-resilience-2026',
    originPlatform: 'Gates Foundation Grants Gateway',
    originPlatformDomain: 'gatesfoundation.org',
    verificationHash: 'sha256:7f9c8b21a0d4e33918f6c4d7e2b109ca8817b3ef651048a609d9451a37c09e3a',
    verifiedAt: '2026-11-03T04:00:15Z',
    trustScore: 99,
    callStatus: 'Active',
    sourceType: 'crawler',
    grantType: 'Project Grant',
    archiveSnapshotUrl: 'https://archive.org/web/gates-smallholder-rfp-20261103.html'
  },
  {
    id: 'fund-idrc-ai4d',
    title: 'Artificial Intelligence for Development in Africa (AI4D) Challenge',
    funder: 'IDRC Canada & Sida',
    amount: '$300,000 CAD',
    deadline: 'December 15, 2026',
    eligibleRegions: ['Sub-Saharan Africa', 'Kenya', 'Ghana', 'Nigeria'],
    domains: ['Data Science', 'Agriculture', 'Public Policy'],
    summary: 'Supports collaborative consortia linking African universities with local datasets to address food security and agricultural productivity through data intelligence.',
    originUrl: 'https://idrc-crdi.ca/en/funding/ai4d-africa-call-collaborative-data-science-2026',
    originPlatform: 'IDRC Official Funding Portal',
    originPlatformDomain: 'idrc-crdi.ca',
    verificationHash: 'sha256:4b22e11893a7c504da102f9e47bb3cd85012a97cf1e7798363a0bb2189dd5490',
    verifiedAt: '2026-11-03T04:00:28Z',
    trustScore: 98,
    callStatus: 'Active',
    sourceType: 'crawler',
    grantType: 'Consortium / Challenge',
    archiveSnapshotUrl: 'https://archive.org/web/idrc-ai4d-rfp-20261103.html'
  },
  {
    id: 'fund-wellcome-climate',
    title: 'Climate Adaptation & Health Discovery Partnership',
    funder: 'Wellcome Trust',
    amount: '$800,000 GBP',
    deadline: 'January 20, 2027',
    eligibleRegions: ['Global', 'Sub-Saharan Africa'],
    domains: ['Spatial Epidemiology', 'Climate Economics', 'Public Health'],
    summary: 'Large-scale exploratory research grant supporting transdisciplinary teams investigating environmental impacts on community livelihoods and health outcomes.',
    originUrl: 'https://wellcome.org/grant-funding/schemes/climate-adaptation-health-discovery-2027',
    originPlatform: 'Wellcome Trust Grants Directory',
    originPlatformDomain: 'wellcome.org',
    verificationHash: 'sha256:91ef23c049d5aa721903e481b764c4890a5b23d9a117ce4208a38541c7b3e201',
    verifiedAt: '2026-11-03T04:00:44Z',
    trustScore: 100,
    callStatus: 'Active',
    sourceType: 'crawler',
    grantType: 'Project Grant',
    archiveSnapshotUrl: 'https://archive.org/web/wellcome-climate-rfp-20261103.html'
  }
];

export const INITIAL_METHODOLOGIES: Methodology[] = [
  {
    id: 'meth-did',
    name: 'Difference-in-Differences with Staggered Rollout',
    category: 'Quantitative',
    description: 'Modern econometric estimator (Callaway & Sant’Anna / Sun & Abraham) identifying treatment effects in the presence of heterogeneous timing across county rollouts.',
    recommendedTools: ['R fixest / did package', 'Python pyfixest', 'Stata reghdfe'],
    bestSuitedFor: ['agricultural finance', 'policy evaluation', 'panel data', 'Kenyan datasets']
  },
  {
    id: 'meth-spatial',
    name: 'Spatial Durbin & Geostatistical Autoregressive Modeling',
    category: 'Quantitative',
    description: 'Accounts for spatial lag and error autocorrelation among neighboring agricultural wards and climatic shocks.',
    recommendedTools: ['R spdep / INLA', 'GeoDa', 'Python PySAL / libpysal'],
    bestSuitedFor: ['yield spillovers', 'climate adaptation', 'regional survey data']
  },
  {
    id: 'meth-mixed',
    name: 'Mixed-Methods Sequential Explanatory Design',
    category: 'Mixed Methods',
    description: 'Pairs quantitative econometric survey estimation with qualitative focus group discussions to probe behavioral adoption mechanisms.',
    recommendedTools: ['NVivo', 'MAXQDA', 'Dedoose'],
    bestSuitedFor: ['credit uptake behavior', 'farmer cooperative governance']
  }
];

export const INITIAL_PROJECT_WORKSPACE: ProjectWorkspace = {
  id: 'proj-agri-kenya-01',
  title: 'Agricultural Microfinance & Climate-Resilient Crop Yields in Western Kenya',
  abstract: 'A quasi-experimental empirical investigation evaluating how mobile-enabled micro-credit facilities interact with fertilizer voucher adoption to stabilize maize and legume yields during erratic rainfall seasons across Bungoma, Kakamega, and Kisumu counties.',
  domain: 'Agricultural Economics & Rural Finance',
  status: 'Active Data Collection',
  leadResearcher: 'Dr. Joseph Juma (You)',
  leadInstitution: 'Nairobi Agricultural Institute / Research Saturday Fellow',
  createdDate: '2026-08-10',
  targetCompletion: '2027-04-30',
  members: [
    {
      id: 'mem-1',
      name: 'Dr. Joseph Juma',
      role: 'Principal Investigator',
      institution: 'Nairobi Agricultural Institute',
      country: 'Kenya',
      avatarInitials: 'JJ'
    },
    {
      id: 'mem-2',
      name: 'Dr. Wanjiru Karanja',
      role: 'Lead Econometrician & Biostatistician',
      institution: 'University of Nairobi',
      country: 'Kenya',
      avatarInitials: 'WK'
    },
    {
      id: 'mem-3',
      name: 'Dr. Brian Ochieng',
      role: 'Data Pipeline Specialist',
      institution: 'Strathmore University',
      country: 'Kenya',
      avatarInitials: 'BO'
    },
    {
      id: 'mem-4',
      name: 'Amina Mwangi, MSc',
      role: 'Field Coordinator & Survey Lead',
      institution: 'KALRO Kakamega Station',
      country: 'Kenya',
      avatarInitials: 'AM'
    }
  ],
  methodology: 'Difference-in-Differences with Callaway-Sant’Anna Staggered Timing Estimator',
  methodologyDetails: 'Exploiting 3 staggered county rollout waves of the agricultural credit scheme to estimate local average treatment effects without contamination from negative weights.',
  datasets: [
    'KNBS Kenya Agricultural Survey 2024',
    'KALRO Western Kenya Soil Longitudinal Panel',
    'CGIAR East Africa Precipitation Grids'
  ],
  tools: ['R fixest', 'Python Pandas/pyfixest', 'KoboToolbox Mobile Surveys', 'QGIS Spatial Mapping', 'Overleaf Quarto'],
  literature: [
    {
      title: 'Difference-in-Differences with Multiple Time Periods',
      authors: 'Callaway, B., & Sant’Anna, P. H.',
      year: 2021,
      journal: 'Journal of Econometrics',
      doi: '10.1016/j.jeconom.2020.12.001'
    },
    {
      title: 'Mobile Banking and Agricultural Credit Uptake in Sub-Saharan Africa',
      authors: 'Suri, T., & Jack, W.',
      year: 2022,
      journal: 'American Economic Review: Insights',
      doi: '10.1257/aeri.20210340'
    },
    {
      title: 'Soil Nutrient Deficiencies and Smallholder Crop Yield Gaps in East Africa',
      authors: 'Vanlauwe, B., et al.',
      year: 2023,
      journal: 'Nature Food',
      doi: '10.1038/s43016-023-00712-4'
    }
  ],
  milestones: [
    {
      id: 'm1',
      title: 'Literature Synthesis & Conceptual Econometric Model',
      dueDate: '2026-09-15',
      status: 'Completed',
      owner: 'Dr. Joseph Juma'
    },
    {
      id: 'm2',
      title: 'Institutional Review Board (IRB) Ethics Approval & Data Access Protocols',
      dueDate: '2026-10-05',
      status: 'Completed',
      owner: 'Dr. Wanjiru Karanja'
    },
    {
      id: 'm3',
      title: 'Field Household Survey Data Collection (Wave 2 - 1,200 Households)',
      dueDate: '2026-11-20',
      status: 'In Progress',
      owner: 'Amina Mwangi, MSc'
    },
    {
      id: 'm4',
      title: 'Staggered DiD Panel Econometric Estimations & Robustness Checks',
      dueDate: '2027-01-15',
      status: 'Upcoming',
      owner: 'Dr. Wanjiru Karanja'
    },
    {
      id: 'm5',
      title: 'Policy Brief Delivery to Kenya Ministry of Agriculture & Draft Submission',
      dueDate: '2027-03-30',
      status: 'Upcoming',
      owner: 'Dr. Joseph Juma'
    }
  ],
  sdgGoals: [1, 2, 8, 13]
};

export const INITIAL_COMMUNITIES: ResearchCommunity[] = [
  {
    id: 'comm-1',
    name: 'East Africa Data & Econometrics Network',
    category: 'Quantitative Economics',
    membersCount: 1420,
    description: 'Active collective of researchers, statisticians, and policymakers working on survey microdata, panel econometrics, and policy evaluations in the EAC region.',
    activeDiscussions: 34,
    recentTopic: 'Handling attrition in rural household panel datasets using inverse probability weighting'
  },
  {
    id: 'comm-2',
    name: 'African Climate & Agri-Tech Collaborative',
    category: 'Agriculture & Climate Science',
    membersCount: 2150,
    description: 'Connecting agronomists, remote-sensing specialists, and development economists to deploy resilient agricultural technologies across Africa.',
    activeDiscussions: 52,
    recentTopic: 'Integrating 1km CGIAR gridded rainfall data with county-level crop production records'
  },
  {
    id: 'comm-3',
    name: 'Global Health & Spatial Epidemiology Consortium',
    category: 'Public Health',
    membersCount: 980,
    description: 'Working group devoted to infectious disease surveillance, geostatistical modeling, and health equity evaluations in low-resource settings.',
    activeDiscussions: 18,
    recentTopic: 'Zero-inflated Poisson models for county malaria incidence reporting'
  },
  {
    id: 'comm-4',
    name: 'Smallholder Digital Microfinance & FinTech Lab',
    category: 'Financial Inclusion & AgTech',
    membersCount: 1680,
    description: 'Research collective studying algorithmic underwriting, mobile money velocities, and loan default probabilities across informal cooperatives.',
    activeDiscussions: 41,
    recentTopic: 'Evaluating machine learning credit scorecards against psychometric smallholder data'
  },
  {
    id: 'comm-5',
    name: 'East African Soil Health & Agronomic Open Data Working Group',
    category: 'Agronomy & Soil Science',
    membersCount: 890,
    description: 'Agronomists and soil scientists standardizing spatial soil chemistry maps, fertilizer yield curves, and open sensor data across East Africa.',
    activeDiscussions: 27,
    recentTopic: 'Calibrating mid-infrared spectroscopy (MIR) for rapid nitrogen and phosphorus soil assessments'
  },
  {
    id: 'comm-6',
    name: 'African Women in Agricultural Research & Development (AWARD) Circle',
    category: 'Gender & Agricultural Policy',
    membersCount: 1250,
    description: 'Peer network fostering multidisciplinary research collaborations, peer proposal reviews, and mentorship for African women scientists in agriculture.',
    activeDiscussions: 39,
    recentTopic: 'Securing multi-institution consortium grants from Gates Foundation and IDRC'
  }
];

export const INITIAL_EVENTS: ResearchEvent[] = [
  {
    id: 'ev-1',
    title: 'Research Saturday Nexus Bi-Weekly Working Symposium',
    organizer: 'Research Saturday Nexus Secretariat',
    date: 'Saturday, October 24, 2026',
    time: '14:00 - 16:30 EAT (11:00 UTC)',
    location: 'Virtual Nexus Hall + Nairobi Innovation Hub',
    isVirtual: true,
    registeredCount: 312,
    description: 'Live research pitch session: 4 multidisciplinary teams presenting ongoing empirical designs and seeking co-investigators, biostatisticians, and industry partners.'
  },
  {
    id: 'ev-2',
    title: 'AERC Workshop: Causal Inference in African Agricultural Markets',
    organizer: 'African Economic Research Consortium',
    date: 'Thursday, November 12, 2026',
    time: '09:00 - 17:00 EAT',
    location: 'Nairobi Safari Club & Streaming',
    isVirtual: true,
    registeredCount: 184,
    description: 'Advanced hands-on econometric clinic exploring synthetic controls, staggered difference-in-differences, and spatial regression discontinuities.'
  },
  {
    id: 'ev-3',
    title: 'CGIAR & ILRI Ag-Data Hackathon & Synthesis Clinic',
    organizer: 'CGIAR Big Data Platform & ILRI Nairobi',
    date: 'Friday, November 27, 2026',
    time: '10:00 - 18:00 EAT',
    location: 'ILRI Campus Addis/Nairobi & Hybrid',
    isVirtual: true,
    registeredCount: 240,
    description: 'Collaborative code sprint on harmonizing smallholder livestock micro-surveys with high-resolution gridded rainfall and NDVI vegetation indices.'
  },
  {
    id: 'ev-4',
    title: 'KIPPRA Young African Scholars Policy Dialogue',
    organizer: 'Kenya Institute for Public Policy Research and Analysis',
    date: 'Wednesday, December 02, 2026',
    time: '13:00 - 16:30 EAT',
    location: 'Bishops Garden Towers, Nairobi & Zoom',
    isVirtual: true,
    registeredCount: 156,
    description: 'Translating empirical econometric findings into actionable policy briefs for county executive committees and parliamentary agricultural caucuses.'
  },
  {
    id: 'ev-5',
    title: 'African Survey Methods & Panel Econometrics Colloquium',
    organizer: 'Tegemeo Institute of Agricultural Policy',
    date: 'Tuesday, December 15, 2026',
    time: '11:00 - 15:30 EAT',
    location: 'Egerton University & Virtual Hall',
    isVirtual: true,
    registeredCount: 210,
    description: 'Methodological deep-dive into survey weighting, attrition correction using inverse probability, and multi-stage cluster variance estimations.'
  },
  {
    id: 'ev-6',
    title: 'FinAccess Microfinance & Smallholder Resilience Round-table',
    organizer: 'FSD Kenya & Central Bank of Kenya',
    date: 'Thursday, January 14, 2027',
    time: '09:30 - 13:00 EAT',
    location: 'CBK Learning Center & Virtual',
    isVirtual: true,
    registeredCount: 295,
    description: 'Unpacking 10-year FinAccess panel trends in mobile credit adoption, climate shock coping mechanisms, and repayment dynamics.'
  }
];

export const INITIAL_JOURNAL_MATCHES: JournalMatch[] = [
  {
    id: 'j-1',
    journalName: 'Journal of Development Economics',
    publisher: 'Elsevier',
    impactFactor: 4.82,
    matchPercentage: 94,
    openAccess: true,
    avgReviewWeeks: 9,
    focusAlignment: 'Top match: Strong preference for rigorous empirical identification of microfinance mechanisms and household welfare in low-income countries.'
  },
  {
    id: 'j-2',
    journalName: 'World Development',
    publisher: 'Elsevier',
    impactFactor: 6.25,
    matchPercentage: 89,
    openAccess: true,
    avgReviewWeeks: 11,
    focusAlignment: 'High match: Multidisciplinary focus on agrarian transformation, rural livelihoods, and systemic development policy impact.'
  },
  {
    id: 'j-3',
    journalName: 'Agricultural Economics',
    publisher: 'Wiley / IAAE',
    impactFactor: 3.48,
    matchPercentage: 86,
    openAccess: false,
    avgReviewWeeks: 8,
    focusAlignment: 'Target match: Official journal of the International Association of Agricultural Economists, high citation on farm credit and input subsidies.'
  }
];

export const INITIAL_IMPACT_RECORDS: ImpactRecord[] = [
  {
    id: 'imp-1',
    type: 'Policy Brief',
    title: 'Policy Note 26/04: Fertilizer Subsidies and Smallholder Repayment Rates in Western Kenya',
    organizationBeneficiary: 'State Department for Crop Development, Kenya Ministry of Agriculture',
    sdgs: [1, 2, 8],
    date: '2026-09-28',
    metrics: 'Formally adopted into the 2027 Western Kenya Smallholder Fertilizer Distribution Guideline',
    doiOrUrl: 'https://doi.org/10.5281/zenodo.948201'
  },
  {
    id: 'imp-2',
    type: 'Spin-off / AgTech Pilot',
    title: 'KilimoYield: Mobile Micro-Credit Risk Scoring Model for Farmer Cooperatives',
    organizationBeneficiary: 'Kenya National Federation of Agricultural Producers (KENFAP)',
    sdgs: [2, 8, 9],
    date: '2026-08-14',
    metrics: 'Active pilot across 14 savings cooperatives; $180,000 in micro-loans scored with 97.4% on-time repayment',
    doiOrUrl: 'https://kilimoyield.nexus-pilot.org'
  },
  {
    id: 'imp-3',
    type: 'Methodological Package',
    title: 'R package `didkenya`: Automated Staggered DiD Diagnostic Tool for KNBS Microdata',
    organizationBeneficiary: 'Open Source African Econometrics Community',
    sdgs: [4, 9],
    date: '2026-10-02',
    metrics: '620 CRAN/GitHub downloads, cited in 4 regional working papers',
    doiOrUrl: 'https://github.com/research-saturday/didkenya'
  }
];
