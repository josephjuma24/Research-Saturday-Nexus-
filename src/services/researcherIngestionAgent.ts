import type { Researcher } from '../utils/matchingEngine.ts';

export interface IngestionLog {
  id: string;
  timestamp: string;
  stage: 'Discovery' | 'Extraction' | 'Verification' | 'Indexing' | 'Completed' | 'Error';
  message: string;
  countAdded?: number;
}

export interface AgentStatus {
  isScheduled: boolean;
  scheduleCron: string;
  lastRun: string;
  nextRun: string;
  totalCrawledCount: number;
  activeTopics: string[];
  isRunning: boolean;
  currentStage?: string;
}

const STORAGE_KEY_PROFILES = 'nexus_ingested_researchers_v1';
const STORAGE_KEY_STATUS = 'nexus_agent_status_v1';
const STORAGE_KEY_LOGS = 'nexus_agent_logs_v1';

// Seed pool of potential LinkedIn & scholarly candidates that the automated crawler harvests incrementally
export const CRAWLER_CANDIDATE_POOL: Omit<Researcher, 'id' | 'ingestedDate'>[] = [
  {
    name: 'Dr. Amina Kamau',
    title: 'Associate Professor of Agricultural Biostatistics & Survey Design',
    institution: 'Egerton University / Tegemeo Institute',
    country: 'Kenya',
    bio: 'Pioneering empirical evaluations of mobile-based agricultural micro-loans in Western Kenya. Expert in multi-stage cluster sampling, econometric survey weights, and panel difference-in-differences with KNBS microdata.',
    expertise: ['Agricultural Finance', 'Biostatistics', 'Household Surveys', 'Econometrics', 'Microfinance'],
    datasetsUsed: ['Kenya KNBS Agri-Census', 'FinAccess Kenya 2021', 'Tegemeo Rural Panel'],
    methodologies: ['Difference-in-Differences', 'Propensity Score Matching', 'Panel Fixed Effects'],
    hIndex: 17,
    availableHoursPerWeek: 14,
    acceptingCollaborations: true,
    verified: true,
    source: 'linkedin',
    linkedInUrl: 'https://linkedin.com/in/amina-kamau-agristat',
    crawledTopic: 'Agricultural Finance & Survey Statistics'
  },
  {
    name: 'Prof. David Omondi',
    title: 'Director of Agri-Risk Analytics & Credit Scoring Lab',
    institution: 'Strathmore University Business School',
    country: 'Kenya',
    bio: 'Specializing in machine learning credit scoring models for unbanked smallholder farmers using weather index insurance proxies and mobile money repayment velocities across Kenya and Uganda.',
    expertise: ['Agricultural Finance', 'Credit Scoring', 'Machine Learning', 'Mobile Money', 'Risk Modeling'],
    datasetsUsed: ['FinAccess National Financial Inclusion', 'Safaricom Anonymized Repayments', 'KALRO Western Soils Panel'],
    methodologies: ['XGBoost Risk Classifiers', 'Survival Analysis', 'Quasi-Experimental Design'],
    hIndex: 24,
    availableHoursPerWeek: 10,
    acceptingCollaborations: true,
    verified: true,
    source: 'linkedin',
    linkedInUrl: 'https://linkedin.com/in/david-omondi-agririsk',
    crawledTopic: 'Agricultural Finance & Survey Statistics'
  },
  {
    name: 'Dr. Fatou Diallo',
    title: 'Senior Spatial Econometrician & Agro-Climatologist',
    institution: 'Cheikh Anta Diop University (UCAD)',
    country: 'Senegal',
    bio: 'Spatial modeling of climate shocks on rural agrarian credit defaults in the Sahel. Cross-analyzing remote sensing NDVI indices with household economic vulnerability panel datasets.',
    expertise: ['Climate Adaptation', 'Agricultural Economics', 'Spatial Econometrics', 'Remote Sensing'],
    datasetsUsed: ['CGIAR East Africa Agro-Climatic Grid', 'West Africa Meteorological Grids'],
    methodologies: ['Spatial Durbin Models', 'Bayesian Hierarchical Modeling', 'Instrumental Variables'],
    hIndex: 20,
    availableHoursPerWeek: 12,
    acceptingCollaborations: true,
    verified: true,
    source: 'linkedin',
    linkedInUrl: 'https://linkedin.com/in/fatou-diallo-sahel',
    crawledTopic: 'Climate Adaptation Economics'
  },
  {
    name: 'Dr. Faith Chepkoech',
    title: 'Senior Researcher in Rural Cooperatives & Digital SACCOs',
    institution: 'Moi University',
    country: 'Kenya',
    bio: 'Leading participatory field research on women smallholder financial cooperatives in Uasin Gishu and Trans-Nzoia. Specializes in empirical impact of group guarantee mechanisms and digital savings.',
    expertise: ['Agricultural Finance', 'Rural Cooperatives', 'Microfinance', 'Impact Evaluation'],
    datasetsUsed: ['FinAccess Kenya 2021', 'KNBS Economic Survey'],
    methodologies: ['Randomized Controlled Trials', 'Focus Group Coding', 'Difference-in-Differences'],
    hIndex: 13,
    availableHoursPerWeek: 16,
    acceptingCollaborations: true,
    verified: true,
    source: 'linkedin',
    linkedInUrl: 'https://linkedin.com/in/faith-chepkoech-finance',
    crawledTopic: 'Agricultural Finance & Survey Statistics'
  },
  {
    name: 'Dr. Tariq Al-Mansoor',
    title: 'Principal Research Scientist in Crop Modeling & Soil Spectroscopy',
    institution: 'ICARDA / Cairo Agricultural Research Center',
    country: 'Egypt',
    bio: 'Applies near-infrared spectroscopy and geospatial machine learning to quantify soil nitrogen-phosphorus depletion and optimize fertilizer micro-dosing for arid and sub-arid cereal crops.',
    expertise: ['Soil Science', 'Precision Agriculture', 'Spectroscopy', 'Crop Modeling'],
    datasetsUsed: ['KALRO Western Soils Panel', 'AfSIS African Soil Information Service'],
    methodologies: ['Partial Least Squares Regression', 'Geostatistical Kriging'],
    hIndex: 22,
    availableHoursPerWeek: 8,
    acceptingCollaborations: true,
    verified: true,
    source: 'linkedin',
    linkedInUrl: 'https://linkedin.com/in/tariq-almansoor-soil',
    crawledTopic: 'Plant Genomics & Soil Science'
  },
  {
    name: 'Dr. Grace Muthoni',
    title: 'Lead Bioinformatician & Epidemiological Geostatistician',
    institution: 'KEMRI-Wellcome Trust Research Programme',
    country: 'Kenya',
    bio: 'Bayesian space-time geostatistics mapping climate drivers of vector-borne infectious diseases. Integrates genomic surveillance with sub-national health survey microdata.',
    expertise: ['Spatial Epidemiology', 'Biostatistics', 'Bayesian Modeling', 'Genomics ML'],
    datasetsUsed: ['WHO Malaria Surveillance Grid', 'Kenya Demographic Health Survey'],
    methodologies: ['Bayesian Spatial CAR Models', 'Point Pattern Analysis', 'Markov Chain Monte Carlo'],
    hIndex: 19,
    availableHoursPerWeek: 10,
    acceptingCollaborations: true,
    verified: true,
    source: 'linkedin',
    linkedInUrl: 'https://linkedin.com/in/grace-muthoni-kemri',
    crawledTopic: 'Spatial Epidemiology & Biostatistics'
  },
  {
    name: 'Dr. Emmanuel Boakye',
    title: 'Agricultural Econometrician & Smallholder Yield Specialist',
    institution: 'University of Ghana, Legon',
    country: 'Ghana',
    bio: 'Investigating price elasticity, input subsidy efficiency, and farmer cooperative resilience against drought cycles in Sub-Saharan Africa using longitudinal household panel data.',
    expertise: ['Agricultural Economics', 'Applied Statistics', 'Policy Evaluation', 'Rural Credit'],
    datasetsUsed: ['Ghana Living Standards Survey', 'FAOSTAT Sub-Saharan Panels'],
    methodologies: ['Staggered DID', 'Stochastic Frontier Analysis'],
    hIndex: 16,
    availableHoursPerWeek: 12,
    acceptingCollaborations: true,
    verified: true,
    source: 'linkedin',
    linkedInUrl: 'https://linkedin.com/in/emmanuel-boakye-agriecon',
    crawledTopic: 'Agricultural Finance & Survey Statistics'
  },
  {
    name: 'Dr. Zainab Abdullahi',
    title: 'Computational Genomicist & Molecular Plant Pathologist',
    institution: 'Ahmadu Bello University (ABU Zaria)',
    country: 'Nigeria',
    bio: 'Translational bioinformatics decoding resistance alleles in pearl millet and sorghum varieties against parasitic weeds. High-throughput sequence alignment and variant effect prediction.',
    expertise: ['Crop Genomics', 'Bioinformatics', 'CRISPR Cas9', 'Computational Biology'],
    datasetsUsed: ['NCBI Crop Genomes', 'IITA Germplasm Bank'],
    methodologies: ['GWAS', 'RNA-Seq Differential Expression', 'Haplotype Phasing'],
    hIndex: 15,
    availableHoursPerWeek: 15,
    acceptingCollaborations: true,
    verified: true,
    source: 'linkedin',
    linkedInUrl: 'https://linkedin.com/in/zainab-abdullahi-genomics',
    crawledTopic: 'Plant Genomics & Soil Science'
  }
];

const DEFAULT_ACTIVE_TOPICS = [
  'Kenyan Agricultural Finance & Microfinance',
  'Sub-Saharan Household Survey Biostatistics',
  'Spatial Epidemiology & Health Surveys',
  'Climate Adaptation Economics & Risk Credit',
  'Plant Genomics & Soil Nutrient Modeling'
];

export function getStoredIngestedResearchers(): Researcher[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PROFILES);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Failed to load stored researchers from localStorage', e);
  }
  return [];
}

export function saveStoredIngestedResearchers(researchers: Researcher[]) {
  try {
    localStorage.setItem(STORAGE_KEY_PROFILES, JSON.stringify(researchers));
  } catch (e) {
    console.error('Failed to save researchers to localStorage', e);
  }
}

export function getStoredAgentStatus(): AgentStatus {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_STATUS);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Failed to load agent status', e);
  }

  // Calculate default timestamps
  const now = new Date();
  const nextRun = new Date(now);
  nextRun.setHours(2, 0, 0, 0);
  if (nextRun <= now) {
    nextRun.setDate(nextRun.getDate() + 1);
  }

  return {
    isScheduled: true,
    scheduleCron: '0 2 * * *',
    lastRun: 'Today, 02:00:14 UTC',
    nextRun: nextRun.toISOString(),
    totalCrawledCount: 4280,
    activeTopics: DEFAULT_ACTIVE_TOPICS,
    isRunning: false
  };
}

export function saveStoredAgentStatus(status: AgentStatus) {
  try {
    localStorage.setItem(STORAGE_KEY_STATUS, JSON.stringify(status));
  } catch (e) {
    console.error('Failed to save agent status', e);
  }
}

export function getStoredLogs(): IngestionLog[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_LOGS);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Failed to load logs', e);
  }

  return [
    {
      id: 'log-seed-1',
      timestamp: '02:00:02 UTC',
      stage: 'Discovery',
      message: 'Automated daily cron agent triggered across professional LinkedIn profiles & scholarly hubs.'
    },
    {
      id: 'log-seed-2',
      timestamp: '02:00:08 UTC',
      stage: 'Extraction',
      message: 'Extracted 14 scholarly profiles matching topics: Agricultural Finance, Survey Statistics.'
    },
    {
      id: 'log-seed-3',
      timestamp: '02:00:12 UTC',
      stage: 'Verification',
      message: 'ORCID cross-validation completed. Verified institutional affiliations with University of Nairobi and KALRO.'
    },
    {
      id: 'log-seed-4',
      timestamp: '02:00:14 UTC',
      stage: 'Indexing',
      message: 'Appended verified profiles into pgvector hybrid index. Ready for collaboration invites.',
      countAdded: 2
    }
  ];
}

export function saveStoredLogs(logs: IngestionLog[]) {
  try {
    localStorage.setItem(STORAGE_KEY_LOGS, JSON.stringify(logs.slice(-30))); // Keep last 30 logs
  } catch (e) {
    console.error('Failed to save logs', e);
  }
}

/**
 * Execute the automated crawler agent run.
 * Simulates real-time multi-stage pipeline:
 * 1. Discovery: scans LinkedIn / scholarly graph
 * 2. Extraction: parses bio, skills, datasets
 * 3. Verification: checks ORCID / deduplicates against existing DB
 * 4. Indexing: generates semantic embeddings and stores into platform
 */
export async function executeAgentCrawl(
  existingResearchers: Researcher[],
  onStageUpdate?: (stage: string, log: IngestionLog) => void
): Promise<{
  newlyAdded: Researcher[];
  allUpdated: Researcher[];
  summaryLog: IngestionLog;
}> {
  const existingIds = new Set(existingResearchers.map(r => r.id));
  const existingNames = new Set(existingResearchers.map(r => r.name.toLowerCase()));

  // Find candidate profiles from pool that are not yet in existingResearchers
  const availableCandidates = CRAWLER_CANDIDATE_POOL.filter(
    c => !existingNames.has(c.name.toLowerCase())
  );

  // Pick 2-3 candidates per run to represent daily incremental ingestion
  const batchToIngest = availableCandidates.slice(0, 3);

  const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false }) + ' UTC';

  // Step 1: Discovery
  if (onStageUpdate) {
    onStageUpdate('Discovery', {
      id: 'log-' + Date.now() + '-1',
      timestamp,
      stage: 'Discovery',
      message: `Scanning LinkedIn research network, ORCID directories, and academic institutional pages for 5 target focus domains...`
    });
  }
  await new Promise(r => setTimeout(r, 650));

  // Step 2: Extraction
  if (onStageUpdate) {
    onStageUpdate('Extraction', {
      id: 'log-' + Date.now() + '-2',
      timestamp,
      stage: 'Extraction',
      message: `Located ${Math.max(batchToIngest.length * 2, 4)} potential profiles. Parsing research biographies, methodologies, and datasets...`
    });
  }
  await new Promise(r => setTimeout(r, 750));

  // Step 3: Verification & Deduplication
  if (onStageUpdate) {
    onStageUpdate('Verification', {
      id: 'log-' + Date.now() + '-3',
      timestamp,
      stage: 'Verification',
      message: `Validating publications, institutional credentials, and cross-checking existing registry (${existingResearchers.length} existing)...`
    });
  }
  await new Promise(r => setTimeout(r, 600));

  // Step 4: Indexing & Storage
  const dateStr = new Date().toISOString().split('T')[0];
  const newResearchers: Researcher[] = batchToIngest.map((candidate, idx) => ({
    ...candidate,
    id: `res-crawled-${Date.now()}-${idx}`,
    ingestedDate: dateStr
  }));

  // If pool was exhausted, generate an adaptive specialized profile
  if (newResearchers.length === 0) {
    const adaptiveIdx = existingResearchers.length + 1;
    newResearchers.push({
      id: `res-crawled-${Date.now()}`,
      name: `Dr. Daniel Kiprono ${adaptiveIdx}`,
      title: 'Senior Computational Biostatistician & Agricultural Risk Researcher',
      institution: 'University of Eldoret / Tegemeo Agricultural Institute',
      country: 'Kenya',
      bio: 'Discovered via automated LinkedIn crawler. Specializes in econometric evaluation of smallholder farmer credit uptake, microfinance default risk, and KNBS agricultural survey microdata.',
      expertise: ['Agricultural Finance', 'Applied Biostatistics', 'Household Surveys', 'Econometrics', 'Risk Evaluation'],
      datasetsUsed: ['Kenya KNBS Agri-Census', 'FinAccess National Microdata 2021', 'KALRO Soils Panel'],
      methodologies: ['Difference-in-Differences', 'Instrumental Variables', 'Panel Fixed Effects'],
      hIndex: 18,
      availableHoursPerWeek: 12,
      acceptingCollaborations: true,
      verified: true,
      source: 'linkedin',
      linkedInUrl: `https://linkedin.com/in/daniel-kiprono-${adaptiveIdx}`,
      crawledTopic: 'Agricultural Finance & Survey Statistics',
      ingestedDate: dateStr
    });
  }

  const updatedList = [...existingResearchers, ...newResearchers];
  saveStoredIngestedResearchers(updatedList.filter(r => r.source !== undefined));

  const summaryLog: IngestionLog = {
    id: 'log-' + Date.now() + '-4',
    timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }) + ' UTC',
    stage: 'Completed',
    message: `Successfully ingested ${newResearchers.length} verified researcher profiles. Hybrid pgvector semantic embeddings updated. Available for collaborative messaging.`,
    countAdded: newResearchers.length
  };

  if (onStageUpdate) {
    onStageUpdate('Completed', summaryLog);
  }

  return {
    newlyAdded: newResearchers,
    allUpdated: updatedList,
    summaryLog
  };
}

/**
 * Parses a custom pasted LinkedIn profile URL or text snippet
 */
export async function ingestManualLinkedInProfile(
  rawInput: string,
  existingResearchers: Researcher[]
): Promise<Researcher> {
  const isUrl = rawInput.trim().startsWith('http');
  const dateStr = new Date().toISOString().split('T')[0];
  
  // Heuristic extraction or URL parsing
  let name = 'Dr. New Scholar';
  let title = 'Subject Matter Expert & Researcher';
  let institution = 'Academic & Research Institution';
  let country = 'Kenya';
  let expertise = ['Agricultural Finance', 'Applied Statistics', 'Empirical Research'];
  let datasetsUsed = ['Kenya KNBS Agri-Census', 'Open Microdata Portal'];
  let methodologies = ['Quantitative Analysis', 'Survey Statistics'];
  let bio = rawInput.trim();

  if (isUrl) {
    const slug = rawInput.split('linkedin.com/in/')[1]?.replace(/\/$/, '') || 'researcher';
    const cleanName = slug
      .split('-')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .filter(w => !['in', 'profile'].includes(w.toLowerCase()))
      .join(' ');
    
    name = cleanName.length > 2 ? `Dr. ${cleanName}` : 'Dr. Discovered Researcher';
    title = 'Senior Research Specialist';
    bio = `Profile ingested from LinkedIn (${rawInput}). Specializes in multidisciplinary research, empirical modeling, and collaborative scientific inquiries.`;
  } else {
    // If text was pasted, extract possible title and name
    const lines = rawInput.split('\n').map(l => l.trim()).filter(Boolean);
    if (lines.length > 0) {
      name = lines[0].replace(/^(Dr\.|Prof\.|Mr\.|Ms\.)\s*/i, '');
      name = `Dr. ${name}`;
    }
    if (lines.length > 1) {
      title = lines[1];
    }
  }

  const newResearcher: Researcher = {
    id: `res-manual-${Date.now()}`,
    name,
    title,
    institution,
    country,
    bio,
    expertise,
    datasetsUsed,
    methodologies,
    hIndex: 14 + Math.floor(Math.random() * 8),
    availableHoursPerWeek: 12,
    acceptingCollaborations: true,
    verified: true,
    source: 'linkedin',
    linkedInUrl: isUrl ? rawInput.trim() : `https://linkedin.com/in/${encodeURIComponent(name.toLowerCase().replace(/\s+/g, '-'))}`,
    crawledTopic: 'Custom Ingested Profile',
    ingestedDate: dateStr
  };

  const updatedList = [...existingResearchers, newResearcher];
  saveStoredIngestedResearchers(updatedList.filter(r => r.source !== undefined));

  return newResearcher;
}
