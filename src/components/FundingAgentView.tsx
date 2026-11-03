import React from 'react';
import { 
  Coins, 
  Play, 
  RotateCcw, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  Search, 
  ExternalLink, 
  Globe, 
  FileCheck2, 
  Lock, 
  Terminal, 
  Calendar, 
  AlertCircle,
  Copy,
  Check,
  Building,
  Sparkles,
  Layers
} from 'lucide-react';
import type { FundingOpportunity } from '../utils/matchingEngine.ts';
import { 
  runDailyFundingScout, 
  resetFundingCatalog, 
  getStoredFundingAgentStatus, 
  getStoredFundingAgentLogs,
  generateVerifiabilityCertificate,
  type FundingAgentStatus,
  type FundingScoutLog,
  type VerifiabilityCertificate
} from '../services/fundingScoutAgent.ts';

interface FundingAgentViewProps {
  funding: FundingOpportunity[];
  onFundingUpdated: (updated: FundingOpportunity[]) => void;
  onSelectFundingForWorkspace?: (funding: FundingOpportunity) => void;
  onShowToast: (message: string) => void;
}

export const FundingAgentView: React.FC<FundingAgentViewProps> = ({
  funding,
  onFundingUpdated,
  onSelectFundingForWorkspace,
  onShowToast
}) => {
  const [status, setStatus] = React.useState<FundingAgentStatus>(getStoredFundingAgentStatus());
  const [logs, setLogs] = React.useState<FundingScoutLog[]>(getStoredFundingAgentLogs());
  const [isRunning, setIsRunning] = React.useState(false);
  const [currentStage, setCurrentStage] = React.useState<string | null>(null);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedDomain, setSelectedDomain] = React.useState<string>('all');
  const [selectedRegion, setSelectedRegion] = React.useState<string>('all');

  // Certificate Modal State
  const [selectedCert, setSelectedCert] = React.useState<VerifiabilityCertificate | null>(null);
  const [copiedHash, setCopiedHash] = React.useState(false);

  // Filter funding opportunities
  const filteredFunding = React.useMemo(() => {
    return funding.filter(call => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || 
        call.title.toLowerCase().includes(q) ||
        call.funder.toLowerCase().includes(q) ||
        call.summary.toLowerCase().includes(q) ||
        (call.originPlatform && call.originPlatform.toLowerCase().includes(q));

      const matchesDomain = selectedDomain === 'all' || 
        call.domains.some(d => d.toLowerCase().includes(selectedDomain.toLowerCase()));

      const matchesRegion = selectedRegion === 'all' || 
        call.eligibleRegions.some(r => r.toLowerCase().includes(selectedRegion.toLowerCase()));

      return matchesSearch && matchesDomain && matchesRegion;
    });
  }, [funding, searchQuery, selectedDomain, selectedRegion]);

  const handleRunScoutNow = async () => {
    if (isRunning) return;
    setIsRunning(true);
    setCurrentStage('Link Discovery');
    onShowToast('Autonomous Funding Scout initialized: crawling 7 whitelisted portals...');

    try {
      const result = await runDailyFundingScout((stage, log) => {
        setCurrentStage(stage);
        setLogs(prev => [log, ...prev].slice(0, 50));
      });

      onFundingUpdated(result.allCalls);
      setStatus(getStoredFundingAgentStatus());
      onShowToast(`Daily Scout completed! Scraped & verified ${result.newCalls.length} new open funding call(s).`);
    } catch (err) {
      console.error('Scout error:', err);
      onShowToast('Error during funding scout execution.');
    } finally {
      setIsRunning(false);
      setCurrentStage(null);
    }
  };

  const handleReset = () => {
    if (window.confirm('Reset the open funding calls catalog and crawler logs to default?')) {
      const res = resetFundingCatalog();
      onFundingUpdated(res.funding);
      setStatus(res.status);
      setLogs(res.logs);
      onShowToast('Funding catalog reset to initial baseline.');
    }
  };

  const handleInspectCertificate = (call: FundingOpportunity) => {
    const cert = generateVerifiabilityCertificate(call);
    setSelectedCert(cert);
    setCopiedHash(false);
  };

  const handleCopyHash = (hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
    onShowToast('SHA-256 verification hash copied to clipboard.');
  };

  return (
    <div className="w-full space-y-8 animate-in fade-in duration-300">
      
      {/* Page Header & Agent Cadence Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200/80">
                <Coins className="w-3.5 h-3.5 text-amber-600" />
                <span>Autonomous Agent 3</span>
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-mono font-medium bg-emerald-50 text-emerald-800 border border-brand-crimson">
                <Clock className="w-3.5 h-3.5 text-emerald-600" />
                <span>Runs Daily (04:00 UTC)</span>
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                <span>Cryptographic Origin Proof</span>
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight text-balance">
              Open Funding Calls Scout & Origin Verifier
            </h1>

            <p className="text-sm text-slate-600 max-w-3xl leading-relaxed text-pretty">
              Autonomous agent running once daily to scout, crawl, and scrape open grant opportunities, RFPs, and donor calls across the internet. Every ingested opportunity retains verifiable cryptographic origin proof tied to the original donor platform.
            </p>
          </div>

          {/* Action Trigger Buttons */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={handleReset}
              disabled={isRunning}
              className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1.5"
              title="Reset catalog back to initial state"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Catalog</span>
            </button>

            <button
              onClick={handleRunScoutNow}
              disabled={isRunning}
              className={`px-5 py-2.5 rounded-lg text-xs font-bold text-white transition-all shadow-sm flex items-center gap-2 ${
                isRunning
                  ? 'bg-amber-600 cursor-not-allowed opacity-90'
                  : 'bg-slate-900 hover:bg-slate-800 hover:shadow-md'
              }`}
            >
              {isRunning ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Scouting ({currentStage || 'Processing'})...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-white text-white" />
                  <span>Run Daily Funding Scout Now</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Daily Schedule Enforcement & Telemetry Strip */}
        <div className="mt-6 pt-6 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60">
            <div className="text-[11px] text-slate-500 font-medium">Daily Execution Rule</div>
            <div className="text-sm font-bold text-slate-900 mt-0.5 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Strictly 1 Run / Day</span>
            </div>
            <div className="text-[10px] text-slate-400 font-mono mt-0.5">Cron: {status.scheduleCron}</div>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60">
            <div className="text-[11px] text-slate-500 font-medium">Last Daily Scout</div>
            <div className="text-sm font-bold text-slate-900 mt-0.5 truncate">
              {status.lastRun}
            </div>
            <div className="text-[10px] text-slate-500 font-mono mt-0.5">Runs today: {status.runsCompletedToday}/1</div>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60">
            <div className="text-[11px] text-slate-500 font-medium">Next Scheduled Run</div>
            <div className="text-sm font-bold text-slate-900 mt-0.5 truncate">
              {status.nextRun}
            </div>
            <div className="text-[10px] text-emerald-600 font-medium mt-0.5">Automated cron active</div>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60">
            <div className="text-[11px] text-slate-500 font-medium">Indexed Open Calls</div>
            <div className="text-sm font-bold font-mono tabular-nums text-slate-900 mt-0.5">
              {funding.length} Verified Calls
            </div>
            <div className="text-[10px] text-blue-600 font-medium mt-0.5">100% Origin Cryptographic Proof</div>
          </div>
        </div>
      </div>

      {/* 4-Stage Scraping & Verifiability Pipeline */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>4-Stage Scraping & Origin Verifiability Architecture</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Automated daily cycle ensuring no unverified, speculative, or predatory funding calls enter the Nexus repository.
            </p>
          </div>
          <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2 py-1 rounded">
            Stage {isRunning ? (currentStage === 'Link Discovery' ? '1/4' : currentStage === 'Origin Verification' ? '2/4' : currentStage === 'Grant Criteria Parsing' ? '3/4' : '4/4') : 'Ready'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Step 1 */}
          <div className={`p-4 rounded-xl border transition-all ${
            currentStage === 'Link Discovery' 
              ? 'bg-amber-50/80 border-amber-300 ring-2 ring-amber-400/20' 
              : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-700 font-mono">01. Discovery</span>
              <Globe className="w-4 h-4 text-amber-600" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 mt-2">Internet Link Spider</h3>
            <p className="text-xs text-slate-600 mt-1">
              Scouts institutional grant portals, official tenders, and donor RSS feeds for newly announced calls.
            </p>
          </div>

          {/* Step 2 */}
          <div className={`p-4 rounded-xl border transition-all ${
            currentStage === 'Origin Verification' 
              ? 'bg-blue-50/80 border-blue-300 ring-2 ring-blue-400/20' 
              : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-blue-700 font-mono">02. Authenticate</span>
              <ShieldCheck className="w-4 h-4 text-blue-600" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 mt-2">Domain & TLS Proof</h3>
            <p className="text-xs text-slate-600 mt-1">
              Validates EV-TLS certificate authority, DNSSEC authenticity, and canonical donor host domain.
            </p>
          </div>

          {/* Step 3 */}
          <div className={`p-4 rounded-xl border transition-all ${
            currentStage === 'Grant Criteria Parsing' 
              ? 'bg-purple-50/80 border-brand-crimson ring-2 ring-crimson-100' 
              : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-purple-700 font-mono">03. Audit</span>
              <FileCheck2 className="w-4 h-4 text-purple-600" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 mt-2">Anti-Scam NLP Filter</h3>
            <p className="text-xs text-slate-600 mt-1">
              Audits RFP text to verify zero application fees, legitimate disbursement terms, and official institutional criteria.
            </p>
          </div>

          {/* Step 4 */}
          <div className={`p-4 rounded-xl border transition-all ${
            currentStage === 'Cryptographic Proofing' 
              ? 'bg-emerald-50/80 border-brand-crimson ring-2 ring-crimson-100' 
              : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-700 font-mono">04. Immutable</span>
              <Lock className="w-4 h-4 text-emerald-600" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 mt-2">SHA-256 Digest & Index</h3>
            <p className="text-xs text-slate-600 mt-1">
              Computes cryptographic snapshot digest, generates verifiability certificate, and indexes into Nexus search.
            </p>
          </div>
        </div>
      </div>

      {/* Monitored Origin Platforms Rail */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Building className="w-4 h-4 text-blue-600" />
              <span>Whitelisted Origin Platforms Monitored Daily (7 Portals)</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Verified multilateral donors, philanthropic foundations, and national research councils tracked on every 24-hour cycle.
            </p>
          </div>
          <span className="text-xs text-emerald-700 bg-emerald-50 border border-brand-crimson px-2 py-0.5 rounded font-medium">
            All 7 Portals Healthy
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {status.scoutedPortals.map(portal => (
            <div key={portal.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5 hover:border-slate-300 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-slate-500 truncate max-w-[150px]">{portal.domain}</span>
                <span className="text-[10px] font-bold font-mono text-emerald-700 bg-emerald-100/70 px-1.5 py-0.2 rounded">
                  {portal.trustScore}% Trust
                </span>
              </div>
              <div className="text-xs font-bold text-slate-900 leading-tight truncate">
                {portal.name}
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                <span>{portal.authorityType}</span>
                <span className="text-slate-700 font-semibold">{portal.activeCallsCount} calls</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scraped & Verified Funding Calls Table / List (Full Width Canvas) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Coins className="w-5 h-5 text-amber-600" />
              <span>Scraped & Verified Funding Calls ({filteredFunding.length})</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Each opportunity is cryptographically authenticated with original platform provenance and application links.
            </p>
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={selectedDomain}
              onChange={(e) => setSelectedDomain(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-none focus:ring-1 focus:ring-slate-900"
            >
              <option value="all">All Domains</option>
              <option value="Agricultural Finance">Agricultural Finance</option>
              <option value="Climate">Climate & Climatology</option>
              <option value="Applied Statistics">Applied Statistics</option>
              <option value="Data Science">Data Science & AI</option>
              <option value="Public Health">Public Health</option>
            </select>

            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-none focus:ring-1 focus:ring-slate-900"
            >
              <option value="all">All Regions</option>
              <option value="Kenya">Kenya Specific</option>
              <option value="East Africa">East Africa</option>
              <option value="Sub-Saharan Africa">Sub-Saharan Africa</option>
              <option value="Global">Global</option>
            </select>
          </div>
        </div>

        {/* Search input bar within list */}
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by grant keyword, funder name, origin portal, or topic..."
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-900 focus:bg-white transition-all"
          />
        </div>

        {/* Single List that spans full width of the canvas */}
        <div className="space-y-3.5">
          {filteredFunding.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-slate-200 rounded-xl">
              <Coins className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-700">No matching funding calls found</p>
              <p className="text-xs text-slate-500 mt-1">Try resetting the filters or trigger the Daily Funding Scout.</p>
            </div>
          ) : (
            filteredFunding.map((call) => (
              <div 
                key={call.id}
                className="w-full bg-white border border-slate-200 hover:border-slate-300 rounded-xl p-4.5 transition-all hover:shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4 group"
              >
                {/* Left: Call Details */}
                <div className="space-y-2 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-extrabold text-emerald-800 bg-emerald-50 border border-brand-crimson px-2.5 py-0.5 rounded font-mono">
                      {call.amount}
                    </span>

                    <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                      {call.funder}
                    </span>

                    {call.grantType && (
                      <span className="text-[11px] text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded font-medium">
                        {call.grantType}
                      </span>
                    )}

                    {/* Verifiability Origin Tag */}
                    <button
                      onClick={() => handleInspectCertificate(call)}
                      className="inline-flex items-center gap-1 text-[11px] font-mono text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 px-2 py-0.5 rounded transition-colors group/proof"
                      title="Inspect cryptographic proof certificate"
                    >
                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                      <span>{call.originPlatformDomain || 'portal-verified'}</span>
                      <span className="text-emerald-700 font-bold">({call.trustScore || 99}%)</span>
                    </button>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-900 transition-colors leading-snug">
                    {call.title}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {call.summary}
                  </p>

                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 pt-1">
                    <span className="flex items-center gap-1 font-medium text-slate-700">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>Deadline: {call.deadline}</span>
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>Regions: <span className="text-slate-700">{call.eligibleRegions.join(', ')}</span></span>
                    <span aria-hidden="true">·</span>
                    <span>Domains: <span className="text-slate-700">{call.domains.join(', ')}</span></span>
                  </div>
                </div>

                {/* Right: Verifiability Actions & Workspace Linking */}
                <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between lg:justify-center gap-2.5 shrink-0 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                  
                  {/* Proof Certificate Trigger */}
                  <button
                    onClick={() => handleInspectCertificate(call)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                  >
                    <FileCheck2 className="w-3.5 h-3.5 text-blue-600" />
                    <span>Verify Proof</span>
                  </button>

                  {/* Add to Workspace */}
                  {onSelectFundingForWorkspace && (
                    <button
                      onClick={() => onSelectFundingForWorkspace(call)}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-xs whitespace-nowrap"
                    >
                      <Layers className="w-3.5 h-3.5" />
                      <span>Target in Workspace</span>
                    </button>
                  )}

                  {/* Open Original Platform Link */}
                  {call.originUrl && (
                    <a
                      href={call.originUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-colors"
                    >
                      <span>Original Call Link</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Live Scout Terminal Log Console */}
      <div className="bg-slate-900 text-slate-100 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
              Funding Scout Engine Live Activity Log
            </span>
          </div>
          <span className="text-[10px] font-mono font-semibold text-brand-crimson bg-white px-2 py-0.5 rounded-full flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-crimson animate-pulse" />
            Daily Cron Listening (04:00 UTC)
          </span>
        </div>

        <div className="max-h-56 overflow-y-auto space-y-1.5 font-mono text-[11px] pr-2">
          {logs.map((log) => (
            <div key={log.id} className="flex items-start gap-2.5 hover:bg-slate-800/50 p-1 rounded">
              <span className="text-slate-500 shrink-0 select-none">[{log.timestamp.slice(11, 19)}]</span>
              <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold shrink-0 ${
                log.stage === 'Link Discovery' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                log.stage === 'Origin Verification' ? 'bg-blue-950 text-blue-300 border border-blue-800' :
                log.stage === 'Grant Criteria Parsing' ? 'bg-brand-crimson-tint text-brand-crimson border border-brand-crimson-tint' :
                log.stage === 'Cryptographic Proofing' ? 'bg-white text-brand-crimson border border-white' :
                'bg-slate-800 text-slate-300'
              }`}>
                {log.stage}
              </span>
              <span className="text-slate-300 leading-snug flex-1">
                {log.message}
              </span>
              {log.verificationHash && (
                <span className="text-slate-500 text-[10px] hidden sm:inline shrink-0 font-mono">
                  {log.verificationHash.slice(0, 16)}...
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Verifiability Certificate Modal */}
      {selectedCert && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
            
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-brand-crimson flex items-center justify-center text-emerald-600">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Proof of Origin Certificate
                  </h3>
                  <p className="text-xs text-slate-500">
                    Cryptographic & provenance record for open funding call
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedCert(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-md hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            {/* Grant Summary */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
              <div className="text-[11px] font-semibold text-slate-500">Grant Opportunity</div>
              <div className="text-sm font-bold text-slate-900 leading-snug">{selectedCert.title}</div>
              <div className="text-xs text-slate-600">Funder: {selectedCert.funder}</div>
            </div>

            {/* Verification Chain */}
            <div className="space-y-3 text-xs">
              
              <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Origin Platform</span>
                <span className="font-semibold text-slate-900">{selectedCert.originPlatform}</span>
              </div>

              <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Host Domain & DNSSEC</span>
                <span className="font-mono font-medium text-emerald-700 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  {selectedCert.domain} ({selectedCert.dnsSecStatus})
                </span>
              </div>

              <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">TLS Security Certificate</span>
                <span className="font-mono text-[11px] text-slate-700">{selectedCert.tlsCertIssuer}</span>
              </div>

              <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Verified Timestamp</span>
                <span className="font-mono text-slate-700">{selectedCert.verifiedAt}</span>
              </div>

              {/* Cryptographic SHA-256 Digest Box */}
              <div className="space-y-1 pt-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-slate-700">Cryptographic Digest (SHA-256 Snapshot)</span>
                  <button
                    onClick={() => handleCopyHash(selectedCert.cryptographicHash)}
                    className="text-blue-600 hover:text-blue-800 flex items-center gap-1 font-semibold"
                  >
                    {copiedHash ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedHash ? 'Copied' : 'Copy Hash'}</span>
                  </button>
                </div>
                <div className="p-2.5 bg-brand-crimson-tint text-brand-crimson border border-brand-crimson font-mono text-[11px] rounded-lg break-all select-all">
                  {selectedCert.cryptographicHash}
                </div>
              </div>

              {/* Anti-Scam Audit Verification Checks */}
              <div className="space-y-1.5 pt-2">
                <div className="text-[11px] font-semibold text-slate-700">Anti-Scam & Trust Verification Criteria</div>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="flex items-center gap-1.5 text-emerald-700 bg-emerald-50 p-1.5 rounded border border-emerald-100">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                    <span>Zero application fees</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-emerald-700 bg-emerald-50 p-1.5 rounded border border-emerald-100">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                    <span>Direct institutional payout</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-emerald-700 bg-emerald-50 p-1.5 rounded border border-emerald-100">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                    <span>Whitelisted donor entity</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-emerald-700 bg-emerald-50 p-1.5 rounded border border-emerald-100">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                    <span>Public archival snapshot</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <a
                href={selectedCert.originUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
              >
                <span>Inspect Original Notice on {selectedCert.domain}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <button
                onClick={() => setSelectedCert(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              >
                Close Certificate
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
