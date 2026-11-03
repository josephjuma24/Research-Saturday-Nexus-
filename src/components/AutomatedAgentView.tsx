import React from 'react';
import type { Researcher } from '../utils/matchingEngine.ts';
import { 
  getStoredAgentStatus, 
  saveStoredAgentStatus, 
  getStoredLogs, 
  saveStoredLogs,
  executeAgentCrawl,
  ingestManualLinkedInProfile,
  type AgentStatus,
  type IngestionLog
} from '../services/researcherIngestionAgent.ts';
import { 
  Bot, 
  Play, 
  Calendar, 
  Clock, 
  Database, 
  ShieldCheck, 
  ExternalLink, 
  Send, 
  CheckCircle2, 
  RefreshCw, 
  Plus, 
  Search, 
  Sparkles, 
  Terminal, 
  MapPin, 
  Award,
  Layers,
  ArrowRight,
  Filter,
  Check
} from 'lucide-react';

interface AutomatedAgentViewProps {
  researchers: Researcher[];
  onResearchersUpdated: (updatedList: Researcher[]) => void;
  onInviteResearcher: (researcher: Researcher) => void;
  onShowToast: (message: string) => void;
}

export const AutomatedAgentView: React.FC<AutomatedAgentViewProps> = ({
  researchers,
  onResearchersUpdated,
  onInviteResearcher,
  onShowToast
}) => {
  const [agentStatus, setAgentStatus] = React.useState<AgentStatus>(getStoredAgentStatus);
  const [logs, setLogs] = React.useState<IngestionLog[]>(getStoredLogs);
  const [isRunning, setIsRunning] = React.useState(false);
  const [activeStage, setActiveStage] = React.useState<string | null>(null);
  
  // Custom manual URL / snippet input
  const [showManualInput, setShowManualInput] = React.useState(false);
  const [manualInput, setManualInput] = React.useState('');
  const [isManualIngesting, setIsManualIngesting] = React.useState(false);

  // Filter / Search for ingested researchers
  const [searchFilter, setSearchFilter] = React.useState('');
  const [selectedTopicFilter, setSelectedTopicFilter] = React.useState<string>('all');
  const [newTopicInput, setNewTopicInput] = React.useState('');

  // Newly crawled / ingested profiles from the full researchers list
  const ingestedProfiles = React.useMemo(() => {
    return researchers.filter(r => r.source !== undefined);
  }, [researchers]);

  const filteredIngested = React.useMemo(() => {
    return ingestedProfiles.filter(r => {
      const matchSearch = searchFilter === '' || 
        r.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
        r.bio.toLowerCase().includes(searchFilter.toLowerCase()) ||
        r.institution.toLowerCase().includes(searchFilter.toLowerCase()) ||
        r.expertise.some(e => e.toLowerCase().includes(searchFilter.toLowerCase()));
      
      const matchTopic = selectedTopicFilter === 'all' || 
        (r.crawledTopic && r.crawledTopic.toLowerCase().includes(selectedTopicFilter.toLowerCase())) ||
        r.expertise.some(e => e.toLowerCase().includes(selectedTopicFilter.toLowerCase()));

      return matchSearch && matchTopic;
    });
  }, [ingestedProfiles, searchFilter, selectedTopicFilter]);

  // Handle running crawler now
  const handleTriggerCrawl = async () => {
    if (isRunning) return;
    setIsRunning(true);
    setActiveStage('Discovery');
    onShowToast('Automated agent started: Scanning LinkedIn profiles and scholarly repositories...');

    try {
      const result = await executeAgentCrawl(researchers, (stage, log) => {
        setActiveStage(stage);
        setLogs(prev => {
          const next = [log, ...prev];
          saveStoredLogs(next);
          return next;
        });
      });

      onResearchersUpdated(result.allUpdated);
      
      // Update agent status
      const updatedStatus: AgentStatus = {
        ...agentStatus,
        lastRun: 'Just now (Incremental crawl completed)',
        totalCrawledCount: 4280 + result.allUpdated.filter(r => r.source !== undefined).length,
        isRunning: false
      };
      setAgentStatus(updatedStatus);
      saveStoredAgentStatus(updatedStatus);

      onShowToast(`Agent completed run: ${result.newlyAdded.length} new verified researchers ingested into the platform.`);
    } catch (e) {
      console.error(e);
      onShowToast('Agent encountered a transient error during crawl.');
    } finally {
      setIsRunning(false);
      setActiveStage(null);
    }
  };

  // Toggle daily scheduled cron
  const handleToggleSchedule = () => {
    const updated = {
      ...agentStatus,
      isScheduled: !agentStatus.isScheduled
    };
    setAgentStatus(updated);
    saveStoredAgentStatus(updated);
    onShowToast(
      updated.isScheduled 
        ? 'Daily scheduled agent activated (Runs at 02:00 UTC).' 
        : 'Daily scheduled agent paused.'
    );
  };

  // Handle manual profile ingest
  const handleManualIngest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualInput.trim()) return;

    setIsManualIngesting(true);
    try {
      const newProfile = await ingestManualLinkedInProfile(manualInput, researchers);
      const updatedList = [...researchers, newProfile];
      onResearchersUpdated(updatedList);
      
      const newLog: IngestionLog = {
        id: 'log-' + Date.now(),
        timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }) + ' UTC',
        stage: 'Indexing',
        message: `Manually parsed & ingested ${newProfile.name} (${newProfile.institution}). Source: LinkedIn.`,
        countAdded: 1
      };
      setLogs(prev => [newLog, ...prev]);
      saveStoredLogs([newLog, ...logs]);

      setManualInput('');
      setShowManualInput(false);
      onShowToast(`Researcher ${newProfile.name} successfully added and ready for collaboration.`);
    } catch (err) {
      console.error(err);
      onShowToast('Failed to parse LinkedIn profile input.');
    } finally {
      setIsManualIngesting(false);
    }
  };

  // Add target topic
  const handleAddTopic = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTopicInput.trim()) return;
    if (agentStatus.activeTopics.includes(newTopicInput.trim())) return;

    const updated = {
      ...agentStatus,
      activeTopics: [...agentStatus.activeTopics, newTopicInput.trim()]
    };
    setAgentStatus(updated);
    saveStoredAgentStatus(updated);
    setNewTopicInput('');
    onShowToast(`Added "${newTopicInput.trim()}" to daily crawler focus.`);
  };

  const handleRemoveTopic = (topic: string) => {
    const updated = {
      ...agentStatus,
      activeTopics: agentStatus.activeTopics.filter(t => t !== topic)
    };
    setAgentStatus(updated);
    saveStoredAgentStatus(updated);
    onShowToast(`Removed "${topic}" from focus topics.`);
  };

  return (
    <div className="space-y-8">
      
      {/* Hero Banner: Automated Agent Status & Overview */}
      <div className="bg-brand-navy text-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-800 relative overflow-hidden">
        <svg className="absolute right-0 top-0 h-full w-1/3 pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><path d="M70 0 C 45 35, 55 70, 100 100 L 100 0 Z" fill="#8A0F23" opacity="0.9" /><path d="M78 0 C 55 35, 63 70, 108 100 L 108 0 Z" fill="#0B195E" /></svg>
        
        <div className="relative z-10 flex flex-col xl:flex-row xl:items-center justify-between gap-6">
          <div className="space-y-2 min-w-0 lg:flex-1 max-w-4xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Automated Daily Crawler Agent</span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white text-balance">
              Autonomous Researcher Discovery & LinkedIn Aggregator
            </h1>
            
            <p className="text-slate-300 text-sm leading-relaxed max-w-3xl text-pretty">
              An intelligent autonomous background agent that crawls professional LinkedIn profiles, scholarly graphs, and institutional faculty directories daily. It extracts research focus, methodologies, and datasets, and incrementally indexes verified researchers so other platform members can discover and invite them to collaborate.
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 pt-2 font-mono">
              <span className="flex items-center gap-1.5 bg-slate-800/80 px-2.5 py-1 rounded-md border border-slate-700">
                <Clock className="w-3.5 h-3.5 text-blue-400" />
                Schedule: <span className="text-white font-semibold">Daily at 02:00 UTC (cron 0 2 * * *)</span>
              </span>
              <span className="flex items-center gap-1.5 bg-slate-800/80 px-2.5 py-1 rounded-md border border-slate-700">
                <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                Next Run: <span className="text-white font-semibold">Today 02:00 UTC</span>
              </span>
              <span className="flex items-center gap-1.5 bg-slate-800/80 px-2.5 py-1 rounded-md border border-slate-700">
                <Database className="w-3.5 h-3.5 text-amber-400" />
                Total Platform Researchers: <span className="text-white font-semibold">{4280 + ingestedProfiles.length} verified</span>
              </span>
            </div>
          </div>

          {/* Action Trigger Buttons */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
            <button
              onClick={handleTriggerCrawl}
              disabled={isRunning}
              className={`flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm transition-all shadow-md ${
                isRunning
                  ? 'bg-blue-600/50 text-blue-200 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-500 text-white active:scale-98 cursor-pointer'
              }`}
            >
              <RefreshCw className={`w-4 h-4 ${isRunning ? 'animate-spin' : ''}`} />
              <span>{isRunning ? 'Crawling Profiles...' : 'Run Ingestion Agent Now'}</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={handleToggleSchedule}
                className="flex-1 flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
              >
                <span className={`w-2 h-2 rounded-full ${agentStatus.isScheduled ? 'bg-emerald-400' : 'bg-slate-500'}`} />
                <span>{agentStatus.isScheduled ? 'Daily Cron Active' : 'Daily Cron Paused'}</span>
              </button>

              <button
                onClick={() => setShowManualInput(!showManualInput)}
                className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
                title="Paste a LinkedIn profile to ingest immediately"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Ingest URL</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Manual LinkedIn Profile Ingest Drawer */}
      {showManualInput && (
        <div className="bg-white border border-blue-200 rounded-xl p-5 shadow-xs animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Bot className="w-4 h-4 text-blue-600" />
              <h3 className="text-sm font-bold text-slate-900">
                Single Profile Ingestion via LinkedIn URL or Bio Snippet
              </h3>
            </div>
            <button 
              onClick={() => setShowManualInput(false)}
              className="text-xs text-slate-400 hover:text-slate-600"
            >
              Cancel
            </button>
          </div>
          
          <form onSubmit={handleManualIngest} className="mt-4 space-y-3">
            <p className="text-xs text-slate-600">
              Paste a public LinkedIn profile URL (e.g. <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-slate-800">https://linkedin.com/in/dr-amina-kamau</code>) or raw biographical text. The agent will parse qualifications, research focus, datasets, and methodologies, then index them into the collaboration graph.
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                value={manualInput}
                onChange={(e) => setManualInput(e.target.value)}
                placeholder="https://linkedin.com/in/dr-example-researcher or paste researcher bio text..."
                className="flex-1 px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
              />
              <button
                type="submit"
                disabled={isManualIngesting || !manualInput.trim()}
                className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 disabled:opacity-50 transition-colors shrink-0"
              >
                {isManualIngesting ? 'Parsing...' : 'Parse & Ingest Profile'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 4-Stage Ingestion Pipeline Visualizer */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-600" />
              <span>Automated Daily Crawl Pipeline Architecture</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Multi-phase asynchronous workflow running daily across professional research ecosystems
            </p>
          </div>
          
          {isRunning && (
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200 animate-pulse">
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>Pipeline Stage Active: {activeStage}</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
          
          {/* Phase 1 */}
          <div className={`p-4 rounded-xl border transition-all ${
            activeStage === 'Discovery'
              ? 'border-blue-400 bg-blue-50/50 ring-2 ring-blue-100'
              : 'border-slate-200 bg-slate-50/50'
          }`}>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono font-bold text-blue-600 bg-blue-100 px-2 py-0.5 rounded">
                STAGE 01
              </span>
              {isRunning && activeStage === 'Discovery' ? (
                <RefreshCw className="w-3.5 h-3.5 text-blue-600 animate-spin" />
              ) : (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              )}
            </div>
            <h3 className="text-xs font-bold text-slate-900 mt-2">
              LinkedIn & Scholarly Graph Scraping
            </h3>
            <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
              Targeted queries across LinkedIn academic profiles, ORCID public registries, and African research portals.
            </p>
          </div>

          {/* Phase 2 */}
          <div className={`p-4 rounded-xl border transition-all ${
            activeStage === 'Extraction'
              ? 'border-blue-400 bg-blue-50/50 ring-2 ring-blue-100'
              : 'border-slate-200 bg-slate-50/50'
          }`}>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono font-bold text-blue-600 bg-blue-100 px-2 py-0.5 rounded">
                STAGE 02
              </span>
              {isRunning && activeStage === 'Extraction' ? (
                <RefreshCw className="w-3.5 h-3.5 text-blue-600 animate-spin" />
              ) : (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              )}
            </div>
            <h3 className="text-xs font-bold text-slate-900 mt-2">
              Entity & Methodology Extraction
            </h3>
            <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
              Extracts research bio, publication abstracts, h-index, datasets used (e.g. KNBS, FinAccess), and statistical methodologies.
            </p>
          </div>

          {/* Phase 3 */}
          <div className={`p-4 rounded-xl border transition-all ${
            activeStage === 'Verification'
              ? 'border-blue-400 bg-blue-50/50 ring-2 ring-blue-100'
              : 'border-slate-200 bg-slate-50/50'
          }`}>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono font-bold text-blue-600 bg-blue-100 px-2 py-0.5 rounded">
                STAGE 03
              </span>
              {isRunning && activeStage === 'Verification' ? (
                <RefreshCw className="w-3.5 h-3.5 text-blue-600 animate-spin" />
              ) : (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              )}
            </div>
            <h3 className="text-xs font-bold text-slate-900 mt-2">
              Cross-Deduplication & Validation
            </h3>
            <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
              Validates institutional email affiliations (UoN, Egerton, KEMRI) and checks against existing researcher database records.
            </p>
          </div>

          {/* Phase 4 */}
          <div className={`p-4 rounded-xl border transition-all ${
            activeStage === 'Completed'
              ? 'border-emerald-400 bg-emerald-50/50 ring-2 ring-emerald-100'
              : 'border-slate-200 bg-slate-50/50'
          }`}>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                STAGE 04
              </span>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            </div>
            <h3 className="text-xs font-bold text-slate-900 mt-2">
              pgvector Indexing & Collaboration Ready
            </h3>
            <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
              Generates 1536-dim embeddings and adds profile to discoverable search so signed-up researchers can immediately send messages.
            </p>
          </div>

        </div>
      </div>

      {/* Target Focus Topics & Ingestion Keywords */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Search className="w-4 h-4 text-purple-600" />
              <span>Target Research Focus Domains (Automated Crawler Queue)</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              The agent focuses daily searches on these research specializations
            </p>
          </div>

          <form onSubmit={handleAddTopic} className="flex gap-2">
            <input
              type="text"
              value={newTopicInput}
              onChange={(e) => setNewTopicInput(e.target.value)}
              placeholder="Add new research topic..."
              className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-purple-500 focus:bg-white"
            />
            <button
              type="submit"
              className="px-3 py-1.5 text-xs font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-lg transition-colors whitespace-nowrap"
            >
              + Add Topic
            </button>
          </form>
        </div>

        <div className="flex flex-wrap items-center gap-2 mt-4">
          {agentStatus.activeTopics.map((topic, i) => (
            <div 
              key={i}
              className="group flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-lg text-xs text-slate-800 transition-colors"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
              <span className="font-medium">{topic}</span>
              <button
                type="button"
                onClick={() => handleRemoveTopic(topic)}
                className="text-slate-400 hover:text-red-500 ml-1 text-xs"
                title="Remove topic"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Discovered & Ingested Researchers Feed */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Bot className="w-4 h-4 text-blue-600" />
              <span>Recently Discovered & Ingested Researchers ({ingestedProfiles.length})</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Aggregated from LinkedIn and academic profiles. Any member can directly send collaboration invitations.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Search ingested profiles..."
                className="pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {filteredIngested.length === 0 ? (
          <div className="bg-white border border-dashed border-slate-300 rounded-xl p-8 text-center space-y-3">
            <Bot className="w-8 h-8 text-slate-400 mx-auto" />
            <h3 className="text-sm font-semibold text-slate-900">
              No profiles match your filter or none crawled yet
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Click &quot;Run Ingestion Agent Now&quot; above to launch the automated daily crawler, or paste a LinkedIn URL directly.
            </p>
            <button
              onClick={handleTriggerCrawl}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Run Ingestion Agent Now</span>
            </button>
          </div>
        ) : (
          <div className="space-y-4 w-full">
            {filteredIngested.map((r) => (
              <div 
                key={r.id}
                className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 hover:border-blue-300 hover:shadow-xs transition-all w-full group"
              >
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                  {/* Left / Main Profile Information */}
                  <div className="flex-1 min-w-0 space-y-3">
                    {/* Top Badges & Meta */}
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200/80">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                        <span>LinkedIn Verified Profile</span>
                      </span>

                      <span className="text-[11px] text-slate-400 font-mono">
                        Ingested {r.ingestedDate || 'Today'}
                      </span>

                      <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-2 py-0.5 rounded-md flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Ready for Collaboration</span>
                      </span>
                    </div>

                    {/* Researcher Identity */}
                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-blue-900 transition-colors">
                        {r.name}
                      </h3>
                      <div className="text-xs sm:text-sm font-medium text-slate-700 mt-0.5">
                        {r.title}
                      </div>
                      <div className="text-xs text-slate-500 mt-1 flex flex-wrap items-center gap-x-2 gap-y-1">
                        <span>{r.institution}</span>
                        <span aria-hidden="true" className="text-slate-300">·</span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          {r.country}
                        </span>
                        <span aria-hidden="true" className="text-slate-300">·</span>
                        <span className="font-mono text-slate-700 font-medium">h-index: <span className="font-bold">{r.hIndex}</span></span>
                      </div>
                    </div>

                    {/* Biographical summary */}
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {r.bio}
                    </p>

                    {/* Skills & Expertise Chips */}
                    <div className="flex flex-wrap items-center gap-1.5 text-xs pt-1">
                      <span className="font-semibold text-slate-700 text-[11px] uppercase tracking-wider mr-1">
                        Expertise:
                      </span>
                      {r.expertise.map((s, idx) => (
                        <span 
                          key={idx} 
                          className="bg-slate-50 border border-slate-200 px-2.5 py-0.5 rounded-md text-xs text-slate-700 font-medium"
                        >
                          {s}
                        </span>
                      ))}
                    </div>

                    {/* Datasets Used */}
                    {r.datasetsUsed.length > 0 && (
                      <div className="text-xs text-slate-600 flex flex-wrap items-center gap-2 bg-slate-50/80 border border-slate-200/70 rounded-lg px-3 py-2 mt-2">
                        <Database className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="font-semibold text-slate-700 text-xs">Datasets & Registries:</span>
                        <span className="text-slate-600">{r.datasetsUsed.join(' · ')}</span>
                      </div>
                    )}
                  </div>

                  {/* Right / Action Section (desktop side column, mobile bottom bar) */}
                  <div className="lg:w-60 lg:shrink-0 flex flex-col justify-between items-stretch lg:items-end gap-4 border-t lg:border-t-0 lg:border-l border-slate-100 pt-4 lg:pt-0 lg:pl-6">
                    {/* Top metric pill on desktop */}
                    <div className="hidden lg:flex flex-col items-end text-right">
                      <span className="text-[11px] font-mono text-slate-400">Indexed Record</span>
                      <div className="mt-1 flex items-center gap-1.5 text-xs bg-slate-100/80 border border-slate-200 px-2.5 py-1 rounded-md text-slate-700">
                        <span className="text-slate-500">Metric:</span>
                        <span className="font-mono font-bold text-slate-900">h-index {r.hIndex}</span>
                      </div>
                    </div>

                    {/* Bottom Action Buttons */}
                    <div className="w-full flex flex-col gap-2">
                      <button
                        onClick={() => onInviteResearcher(r)}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-xs hover:shadow-sm cursor-pointer"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Invite to Collaborate</span>
                      </button>

                      {r.linkedInUrl && (
                        <a
                          href={r.linkedInUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-600 hover:text-blue-600 hover:bg-blue-50/50 border border-slate-200 rounded-lg transition-colors"
                        >
                          <span>LinkedIn Profile</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Real-time Agent Logs Terminal Console */}
      <div className="bg-slate-950 text-slate-300 rounded-xl p-5 border border-slate-800 font-mono text-xs shadow-inner">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-emerald-400" />
            <span className="text-white font-bold">Autonomous Ingestion Agent Execution Log</span>
          </div>
          <span className="text-[11px] text-slate-500">
            {logs.length} operations recorded
          </span>
        </div>

        <div className="space-y-1.5 max-h-48 overflow-y-auto custom-scrollbar pr-2">
          {logs.map((log) => (
            <div key={log.id} className="flex items-start gap-2.5 leading-relaxed">
              <span className="text-slate-500 shrink-0 select-none">[{log.timestamp}]</span>
              <span className={`px-1.5 py-0.2 rounded text-[10px] shrink-0 font-bold ${
                log.stage === 'Discovery' ? 'bg-blue-900/60 text-blue-300 border border-blue-700/50' :
                log.stage === 'Extraction' ? 'bg-purple-900/60 text-purple-300 border border-purple-700/50' :
                log.stage === 'Verification' ? 'bg-amber-900/60 text-amber-300 border border-amber-700/50' :
                log.stage === 'Indexing' ? 'bg-cyan-900/60 text-cyan-300 border border-cyan-700/50' :
                log.stage === 'Completed' ? 'bg-emerald-900/60 text-emerald-300 border border-emerald-700/50' :
                'bg-red-900/60 text-red-300'
              }`}>
                {log.stage}
              </span>
              <span className="text-slate-300">{log.message}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
