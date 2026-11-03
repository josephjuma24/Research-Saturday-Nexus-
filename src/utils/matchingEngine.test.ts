import test from 'node:test';
import assert from 'node:assert/strict';
import {
  tokenize,
  extractRegion,
  calculateTokenOverlap,
  scoreResearcherMatch,
  executeIntelligentMatch,
} from './matchingEngine.ts';
import type {
  Researcher,
  Dataset,
  FundingOpportunity,
  Methodology
} from './matchingEngine.ts';

const mockResearchers: Researcher[] = [
  {
    id: 'res-1',
    name: 'Dr. Wanjiru Karanja',
    title: 'Senior Agricultural Biostatistician',
    institution: 'University of Nairobi',
    country: 'Kenya',
    bio: 'Specialist in econometric modeling, microfinance impact evaluation, and rural household survey analysis in East Africa.',
    expertise: ['Agricultural Finance', 'Applied Statistics', 'Econometrics', 'Household Surveys'],
    datasetsUsed: ['Kenya KNBS Agri-Census', 'FinAccess Kenya 2021', 'World Bank Living Standards'],
    methodologies: ['Difference-in-Differences', 'Instrumental Variables', 'Propensity Score Matching'],
    hIndex: 19,
    availableHoursPerWeek: 12,
    acceptingCollaborations: true,
    verified: true
  },
  {
    id: 'res-2',
    name: 'Dr. Marcus Vance',
    title: 'Computational Neuroscientist',
    institution: 'Imperial College London',
    country: 'United Kingdom',
    bio: 'Focuses on deep learning representations of cortical microcircuits and electrophysiology pipelines.',
    expertise: ['Neuroscience', 'Deep Learning', 'PyTorch', 'Electrophysiology'],
    datasetsUsed: ['Allen Brain Observatory', 'Human Connectome Project'],
    methodologies: ['Convolutional Neural Networks', 'Bayesian Filtering'],
    hIndex: 26,
    availableHoursPerWeek: 6,
    acceptingCollaborations: false,
    verified: true
  }
];

const mockDatasets: Dataset[] = [
  {
    id: 'data-1',
    title: 'KNBS Kenya Agricultural & Microfinance Survey 2024',
    publisher: 'Kenya National Bureau of Statistics',
    countryOrRegion: 'Kenya',
    domain: 'Agricultural Economics',
    license: 'CC-BY-4.0',
    description: 'Microdata covering 47 counties on credit access, crop yields, and fertilizer subsidy adoption.',
    tags: ['agriculture', 'finance', 'kenya', 'credit']
  }
];

const mockFunding: FundingOpportunity[] = [
  {
    id: 'fund-1',
    title: 'Sub-Saharan Smallholder Financial Resilience Grant',
    funder: 'Bill & Melinda Gates Foundation',
    amount: '$450,000 USD',
    deadline: '2026-11-30',
    eligibleRegions: ['Sub-Saharan Africa', 'Kenya'],
    domains: ['Agriculture', 'Financial Inclusion'],
    summary: 'Catalytic grants supporting empirical investigations into rural credit structures and climatic resilience.'
  }
];

const mockMethodologies: Methodology[] = [
  {
    id: 'meth-1',
    name: 'Difference-in-Differences with Staggered Rollout',
    category: 'Quantitative',
    description: 'Robust econometric identification of treatment effects across multiple intervention waves.',
    recommendedTools: ['R fixest', 'Python pyfixest', 'Stata reghdfe'],
    bestSuitedFor: ['agricultural finance', 'policy evaluation', 'panel data']
  }
];

test('tokenize splits and filters tokens correctly', () => {
  const tokens = tokenize('I need a statistician who understands agricultural finance!');
  assert.ok(tokens.includes('statistic'));
  assert.ok(tokens.includes('understands'));
  assert.ok(tokens.includes('agricultural'));
  assert.ok(tokens.includes('finance'));
  assert.ok(!tokens.includes('a'));
  assert.ok(!tokens.includes('need')); // filtered as stop word
});

test('extractRegion identifies Kenya and Kenyan phrasing', () => {
  assert.equal(extractRegion('working with Kenyan datasets'), 'Kenya');
  assert.equal(extractRegion('projects in Ghana and Rwanda'), 'Ghana');
  assert.equal(extractRegion('general quantitative synthesis'), undefined);
});

test('calculateTokenOverlap accurately scores shared word frequencies', () => {
  const query = ['statistician', 'finance', 'kenya'];
  const target = ['biostatistician', 'finance', 'kenya', 'econometrics'];
  const overlap = calculateTokenOverlap(query, target);
  assert.ok(overlap > 0.6);
});

test('Intelligent Matching Engine correctly ranks Dr. Wanjiru Karanja top for Kenyan agricultural finance', () => {
  const query = 'I need a statistician who understands agricultural finance and can work with Kenyan datasets.';
  const result = executeIntelligentMatch(query, mockResearchers, mockDatasets, mockFunding, mockMethodologies);

  assert.equal(result.rankedResearchers.length, 2);
  const topMatch = result.rankedResearchers[0];
  assert.equal(topMatch.researcher.name, 'Dr. Wanjiru Karanja');
  assert.ok(topMatch.matchScore > 75, `Expected score > 75, got ${topMatch.matchScore}`);
  assert.ok(topMatch.confidenceTier === 'Exceptional' || topMatch.confidenceTier === 'Strong');
  assert.ok(result.matchingDatasets.length >= 1);
  assert.equal(result.matchingDatasets[0].id, 'data-1');
  assert.ok(result.matchingFunding.length >= 1);
});
