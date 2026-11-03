/**
 * Research Saturday Nexus - Intelligent Matching Engine
 * Pure logic module implementing multi-attribute hybrid matching (BM25 token overlap + domain weights + geographic matching)
 */

export interface Researcher {
  id: string;
  name: string;
  title: string;
  institution: string;
  country: string;
  bio: string;
  expertise: string[];
  datasetsUsed: string[];
  methodologies: string[];
  hIndex: number;
  availableHoursPerWeek: number;
  acceptingCollaborations: boolean;
  avatarUrl?: string;
  verified: boolean;
  source?: 'linkedin' | 'orcid' | 'scholar' | 'institutional' | 'manual';
  linkedInUrl?: string;
  ingestedDate?: string;
  crawledTopic?: string;
}

export interface Dataset {
  id: string;
  title: string;
  publisher: string;
  countryOrRegion: string;
  domain: string;
  license: string;
  description: string;
  tags: string[];
  recordCount?: number;
  sourceType?: 'mcp' | 'crawler' | 'scraper' | 'api' | 'manual';
  mcpServer?: string;
  harvestedDate?: string;
  openSourceVerified?: boolean;
  downloadUrl?: string;
  fileFormats?: string[];
}

export interface FundingOpportunity {
  id: string;
  title: string;
  funder: string;
  amount: string;
  deadline: string;
  eligibleRegions: string[];
  domains: string[];
  summary: string;
  // Origin platform verifiability fields
  originUrl?: string;
  originPlatform?: string;
  originPlatformDomain?: string;
  verificationHash?: string;
  verifiedAt?: string;
  trustScore?: number; // 0 - 100%
  callStatus?: 'Active' | 'Closing Soon' | 'Under Review';
  sourceType?: 'crawler' | 'rss' | 'portal_scraper' | 'api' | 'manual';
  archiveSnapshotUrl?: string;
  coFundingAvailable?: boolean;
  grantType?: 'Project Grant' | 'Consortium / Challenge' | 'Fellowship' | 'Innovation Fund';
  applicationUrl?: string;
}

export interface Methodology {
  id: string;
  name: string;
  category: 'Quantitative' | 'Qualitative' | 'Mixed Methods' | 'Computational';
  description: string;
  recommendedTools: string[];
  bestSuitedFor: string[];
}

export interface MatchScoreBreakdown {
  domainScore: number;       // 0-100
  skillsScore: number;       // 0-100
  geoScore: number;          // 0-100
  availabilityScore: number; // 0-100
  totalScore: number;        // 0-100 weighted
}

export interface RankedResearcherMatch {
  researcher: Researcher;
  matchScore: number; // 0-100
  confidenceTier: 'Exceptional' | 'Strong' | 'Moderate' | 'Complementary';
  matchReason: string;
  sharedInterests: string[];
  scoreBreakdown: MatchScoreBreakdown;
}

export interface IntelligentMatchResponse {
  query: string;
  extractedKeywords: string[];
  detectedRegion?: string;
  detectedDomain?: string;
  rankedResearchers: RankedResearcherMatch[];
  matchingDatasets: Dataset[];
  matchingFunding: FundingOpportunity[];
  suggestedMethodologies: Methodology[];
}

const STOP_WORDS = new Set([
  'the', 'and', 'for', 'with', 'who', 'can', 'need', 'needs', 'want', 'wants', 
  'looking', 'work', 'works', 'working', 'help', 'from', 'into', 'about', 'some',
  'any', 'that', 'this', 'our', 'project', 'datasets', 'dataset'
]);

/**
 * Normalizes text to lowercase tokens removing punctuation & stop words
 */
export function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, ' ')
    .split(/\s+/)
    .map(t => {
      // Light stemming
      if (t.endsWith('ician')) return t.replace(/ician$/, 'ic');
      if (t.endsWith('ics')) return t.replace(/ics$/, 'ic');
      if (t.endsWith('ing')) return t.replace(/ing$/, '');
      if (t.endsWith('an') && t.length > 5) return t.replace(/an$/, '');
      return t;
    })
    .filter(token => token.length > 2 && !STOP_WORDS.has(token));
}

/**
 * Calculates Jaccard / token overlap coefficient between two sets
 */
export function calculateTokenOverlap(queryTokens: string[], targetTokens: string[]): number {
  if (queryTokens.length === 0 || targetTokens.length === 0) return 0;
  const targetSet = new Set(targetTokens.map(t => t.toLowerCase()));
  let matchCount = 0;
  for (const token of queryTokens) {
    const t = token.toLowerCase();
    if (targetSet.has(t)) {
      matchCount += 1;
    } else {
      // Partial sub-string or prefix match check
      for (const target of targetSet) {
        if (target.startsWith(t.slice(0, 4)) || t.startsWith(target.slice(0, 4))) {
          matchCount += 0.8;
          break;
        } else if (target.includes(t) || t.includes(target)) {
          matchCount += 0.5;
          break;
        }
      }
    }
  }
  return Math.min(1, matchCount / Math.max(1, queryTokens.length));
}

/**
 * Detects regional markers in query (e.g., Kenya, East Africa, Sub-Saharan, Global) by earliest appearance
 */
export function extractRegion(query: string): string | undefined {
  const regions = ['Kenya', 'Uganda', 'Tanzania', 'Rwanda', 'Nigeria', 'Ghana', 'South Africa', 'Ethiopia', 'Global', 'Sub-Saharan Africa'];
  const lowerQuery = query.toLowerCase();
  
  let earliestIdx = Infinity;
  let detected: string | undefined = undefined;

  for (const region of regions) {
    const searchTarget = region.toLowerCase();
    let idx = lowerQuery.indexOf(searchTarget);
    if (idx === -1 && region === 'Kenya') {
      idx = lowerQuery.indexOf('kenyan');
    }
    if (idx !== -1 && idx < earliestIdx) {
      earliestIdx = idx;
      detected = region;
    }
  }
  return detected;
}

/**
 * Calculates match score between a natural language query and a candidate researcher
 */
export function scoreResearcherMatch(query: string, candidate: Researcher): RankedResearcherMatch {
  const queryTokens = tokenize(query);
  const detectedRegion = extractRegion(query);

  // 1. Skills / Expertise overlap
  const candidateTokens = [
    ...candidate.expertise.flatMap(e => tokenize(e)),
    ...candidate.methodologies.flatMap(m => tokenize(m)),
    ...candidate.datasetsUsed.flatMap(d => tokenize(d)),
    ...tokenize(candidate.title),
    ...tokenize(candidate.bio),
  ];
  const skillsOverlap = calculateTokenOverlap(queryTokens, candidateTokens);
  const skillsScore = Math.round(skillsOverlap * 100);

  // 2. Domain relevance
  let domainScore = 40;
  const queryLower = query.toLowerCase();
  for (const exp of candidate.expertise) {
    if (queryLower.includes(exp.toLowerCase())) {
      domainScore += 20;
    }
  }
  domainScore = Math.min(100, domainScore);

  // 3. Geographic relevance
  let geoScore = 50;
  if (detectedRegion) {
    if (candidate.country.toLowerCase() === detectedRegion.toLowerCase() || 
        (detectedRegion === 'Kenya' && candidate.country.toLowerCase().includes('kenya'))) {
      geoScore = 100;
    } else if (candidate.datasetsUsed.some(d => d.toLowerCase().includes(detectedRegion.toLowerCase()) || (detectedRegion === 'Kenya' && d.toLowerCase().includes('kenya')))) {
      geoScore = 95;
    } else {
      geoScore = 30;
    }
  }

  // 4. Availability & capacity
  let availabilityScore = candidate.acceptingCollaborations ? 85 : 20;
  if (candidate.availableHoursPerWeek >= 10) availabilityScore += 15;

  // Weighted total: Skills (40%), Geo (25%), Domain (25%), Availability (10%)
  const totalScore = Math.round(
    (skillsScore * 0.40) +
    (geoScore * 0.25) +
    (domainScore * 0.25) +
    (availabilityScore * 0.10)
  );

  // Confidence Tier
  let confidenceTier: RankedResearcherMatch['confidenceTier'] = 'Moderate';
  if (totalScore >= 85) confidenceTier = 'Exceptional';
  else if (totalScore >= 75) confidenceTier = 'Strong';
  else if (totalScore >= 60) confidenceTier = 'Moderate';
  else confidenceTier = 'Complementary';

  // Shared Interests
  const sharedInterests = candidate.expertise.filter(e => {
    const eTokens = tokenize(e);
    return eTokens.some(t => queryTokens.includes(t)) || queryLower.includes(e.toLowerCase());
  });

  // Descriptive reasoning
  let matchReason = `Strong expertise in ${candidate.expertise.slice(0, 2).join(' & ')}`;
  if (geoScore >= 90) {
    matchReason += ` with direct experience in ${candidate.country} and local datasets.`;
  } else {
    matchReason += ` aligning with project methodology.`;
  }

  return {
    researcher: candidate,
    matchScore: totalScore,
    confidenceTier,
    matchReason,
    sharedInterests: sharedInterests.length > 0 ? sharedInterests : candidate.expertise.slice(0, 3),
    scoreBreakdown: {
      domainScore,
      skillsScore,
      geoScore,
      availabilityScore,
      totalScore
    }
  };
}

/**
 * Main engine entry point that matches query against candidates, datasets, funding, and methods
 */
export function executeIntelligentMatch(
  query: string,
  researchers: Researcher[],
  datasets: Dataset[],
  funding: FundingOpportunity[],
  methodologies: Methodology[]
): IntelligentMatchResponse {
  const queryTokens = tokenize(query);
  const detectedRegion = extractRegion(query);
  const queryLower = query.toLowerCase();

  // Score researchers
  const rankedResearchers = researchers
    .map(r => scoreResearcherMatch(query, r))
    .sort((a, b) => b.matchScore - a.matchScore);

  // Match datasets
  const matchingDatasets = datasets.filter(d => {
    const dTokens = [...tokenize(d.title), ...tokenize(d.description), ...d.tags.flatMap(t => tokenize(t)), ...tokenize(d.countryOrRegion)];
    const overlap = calculateTokenOverlap(queryTokens, dTokens);
    const hasGeo = detectedRegion && (d.countryOrRegion.toLowerCase().includes(detectedRegion.toLowerCase()) || (detectedRegion === 'Kenya' && d.title.toLowerCase().includes('kenya')));
    return overlap > 0.15 || hasGeo;
  }).slice(0, 3);

  // Match funding opportunities
  const matchingFunding = funding.filter(f => {
    const fTokens = [...tokenize(f.title), ...tokenize(f.summary), ...f.domains.flatMap(d => tokenize(d))];
    const overlap = calculateTokenOverlap(queryTokens, fTokens);
    const hasRegion = detectedRegion && f.eligibleRegions.some(r => r.toLowerCase().includes(detectedRegion.toLowerCase()) || r.toLowerCase().includes('sub-saharan') || r.toLowerCase().includes('global'));
    return overlap > 0.15 || hasRegion;
  }).slice(0, 3);

  // Suggested methodologies
  const suggestedMethodologies = methodologies.filter(m => {
    const mTokens = [...tokenize(m.name), ...tokenize(m.description), ...m.bestSuitedFor.flatMap(b => tokenize(b))];
    const overlap = calculateTokenOverlap(queryTokens, mTokens);
    return overlap > 0.10;
  }).slice(0, 3);

  return {
    query,
    extractedKeywords: queryTokens.slice(0, 8),
    detectedRegion,
    rankedResearchers,
    matchingDatasets,
    matchingFunding,
    suggestedMethodologies: suggestedMethodologies.length > 0 ? suggestedMethodologies : methodologies.slice(0, 2)
  };
}
