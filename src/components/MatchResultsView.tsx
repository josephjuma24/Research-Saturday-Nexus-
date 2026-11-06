import React from 'react';
import type { IntelligentMatchResponse, RankedResearcherMatch } from '../utils/matchingEngine.ts';
import { 
  Users, 
  Database, 
  Coins, 
  Cpu, 
  Send, 
  ExternalLink, 
  Check, 
  SlidersHorizontal,
  MapPin,
  Clock,
  Award,
  ShieldCheck
} from 'lucide-react';
import { ScrollableSection } from './ScrollableSectionList.tsx';

interface MatchResultsViewProps {
  results: IntelligentMatchResponse;
  onInviteClick: (match: RankedResearcherMatch) => void;
  onCreateProjectFromMatch: () => void;
}

export const MatchResultsView: React.FC<MatchResultsViewProps> = ({
  results,
  onInviteClick,
  onCreateProjectFromMatch
}) => {
  const [activeFilter, setActiveFilter] = React.useState<'all' | 'people' | 'datasets' | 'funding'>('all');

  return (
    <div className="space-y-8">
      
      {/* Query Understanding & Extraction Banner */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Query Intelligence Analysis
            </div>
            <div className="mt-1 text-sm font-medium text-slate-900">
              “{results.query}”
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-600">
              <span className="font-semibold text-slate-700">Identified Entities:</span>
              {results.detectedRegion && (
                <span className="bg-white px-2 py-0.5 border border-slate-200 rounded text-slate-800">
                  Region: {results.detectedRegion}
                </span>
              )}
              {results.extractedKeywords.map((kw, i) => (
                <span key={i} className="bg-white px-2 py-0.5 border border-slate-200 rounded text-slate-700">
                  {kw}
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onCreateProjectFromMatch}
              className="px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors shadow-sm whitespace-nowrap"
            >
              Convert to Project Workspace
            </button>
          </div>
        </div>
      </div>

      {/* Segmented Filter Control */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
              activeFilter === 'all'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Matches ({results.rankedResearchers.length + results.matchingDatasets.length + results.matchingFunding.length})
          </button>
          <button
            onClick={() => setActiveFilter('people')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
              activeFilter === 'people'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Researchers ({results.rankedResearchers.length})
          </button>
          <button
            onClick={() => setActiveFilter('datasets')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
              activeFilter === 'datasets'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Datasets ({results.matchingDatasets.length})
          </button>
          <button
            onClick={() => setActiveFilter('funding')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
              activeFilter === 'funding'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Funding Opportunities ({results.matchingFunding.length})
          </button>
        </div>

        <div className="text-xs text-slate-500 hidden sm:block">
          Ranked by hybrid semantic vector & domain proximity
        </div>
      </div>

      {/* Section 1: Ranked Researchers & Subject Experts */}
      {(activeFilter === 'all' || activeFilter === 'people') && results.rankedResearchers.length > 0 && (
        <ScrollableSection
          title="Ranked Researchers & Subject Experts"
          icon={<Users className="w-4 h-4 text-blue-600" />}
          countLabel={`${results.rankedResearchers.length} experts scored`}
          accentColor="blue"
          itemCount={results.rankedResearchers.length}
          defaultMode="list"
          listMaxHeight="max-h-[580px]"
          childrenRail={
            <>
              {results.rankedResearchers.map((match) => {
                const r = match.researcher;
                const isExceptional = match.confidenceTier === 'Exceptional';
                return (
                  <div
                    key={r.id}
                    className={`w-[360px] sm:w-[450px] shrink-0 snap-start bg-white border rounded-xl p-5 flex flex-col justify-between hover:border-slate-300 hover:shadow-md transition-all relative overflow-hidden group ${
                      isExceptional ? 'border-blue-300 shadow-xs ring-1 ring-blue-100' : 'border-slate-200'
                    }`}
                  >
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-indigo-500" />
                    
                    <div className="space-y-3 pt-1">
                      {/* Researcher Header */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-900 transition-colors">
                              {r.name}
                            </h3>
                            {r.verified && (
                              <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 border border-brand-crimson px-1.5 py-0.5 rounded">
                                Verified Researcher
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-slate-600 font-medium mt-0.5">
                            {r.title} · <span className="text-slate-500">{r.institution}</span>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="text-xl font-black font-mono tabular-nums text-slate-900">
                            {match.matchScore}%
                          </span>
                          <div className="text-[10px] font-semibold text-blue-700">
                            {match.confidenceTier} Match
                          </div>
                        </div>
                      </div>

                      {/* Meta badges */}
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          {r.country}
                        </span>
                        <span className="text-slate-300">·</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          {r.availableHoursPerWeek} hrs/week available
                        </span>
                        <span className="text-slate-300">·</span>
                        <span className="font-mono font-medium text-slate-700">h-index: {r.hIndex}</span>
                      </div>

                      {/* Bio */}
                      <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                        {r.bio}
                      </p>

                      {/* Match Rationale */}
                      <div className="bg-slate-50 border border-slate-200/70 rounded-lg p-2.5 text-xs text-slate-700 flex items-start gap-2">
                        <Award className="w-3.5 h-3.5 text-blue-700 shrink-0 mt-0.5" />
                        <div className="line-clamp-2">
                          <span className="font-semibold text-slate-900">Match Rationale: </span>
                          <span>{match.matchReason}</span>
                        </div>
                      </div>

                      {/* Shared Skills */}
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-600 pt-1">
                        <span className="font-semibold text-slate-800">Shared Skills:</span>
                        {match.sharedInterests.map((skill, sIdx) => (
                          <React.Fragment key={sIdx}>
                            <span className="text-slate-900 font-medium">{skill}</span>
                            {sIdx < match.sharedInterests.length - 1 && <span className="text-slate-300">·</span>}
                          </React.Fragment>
                        ))}
                      </div>

                      {/* Datasets Used */}
                      {r.datasetsUsed.length > 0 && (
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-600">
                          <span className="font-semibold text-slate-800">Datasets Used:</span>
                          {r.datasetsUsed.map((ds, dIdx) => (
                            <React.Fragment key={dIdx}>
                              <span className="text-blue-900">{ds}</span>
                              {dIdx < r.datasetsUsed.length - 1 && <span className="text-slate-300">·</span>}
                            </React.Fragment>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Footer Action */}
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                      <div className="text-[10px] text-slate-400">
                        Skills: {match.scoreBreakdown.skillsScore}% · Geo: {match.scoreBreakdown.geoScore}%
                      </div>
                      <button
                        onClick={() => onInviteClick(match)}
                        className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-xs whitespace-nowrap"
                      >
                        <Send className="w-3 h-3" />
                        <span>Invite to Collaborate</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </>
          }
          childrenList={
            <>
              {results.rankedResearchers.map((match) => {
                const r = match.researcher;
                const isExceptional = match.confidenceTier === 'Exceptional';
                return (
                  <div 
                    key={r.id} 
                    className={`bg-white border rounded-xl p-5 transition-all ${
                      isExceptional 
                        ? 'border-blue-300 shadow-xs ring-1 ring-blue-100' 
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                      
                      {/* Left: Researcher Core Info - Fluid Width */}
                      <div className="space-y-2 flex-1 min-w-0 pr-0 lg:pr-4">
                        <div className="flex flex-wrap items-center gap-3">
                          <h3 className="text-base font-bold text-slate-900">
                            {r.name}
                          </h3>
                          {r.verified && (
                            <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-brand-crimson px-2 py-0.5 rounded">
                              Verified Researcher
                            </span>
                          )}
                          <span className="text-xs text-slate-500">
                            h-index: <span className="font-mono font-bold text-slate-700">{r.hIndex}</span>
                          </span>
                        </div>

                        <div className="text-xs sm:text-sm font-medium text-slate-700">
                          {r.title} · <span className="text-slate-600">{r.institution}</span>
                        </div>

                        <div className="flex items-center gap-4 text-xs text-slate-500">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-slate-400" />
                            {r.country}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            {r.availableHoursPerWeek} hrs/week available
                          </span>
                        </div>

                        <p className="text-xs sm:text-sm text-slate-600 pt-1 leading-relaxed">
                          {r.bio}
                        </p>

                        {/* Match Reason Callout */}
                        <div className="mt-3 bg-slate-50 border border-slate-200/70 rounded-lg p-2.5 text-xs text-slate-700 flex items-start gap-2">
                          <Award className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-semibold text-slate-900">Match Rationale: </span>
                            <span>{match.matchReason}</span>
                          </div>
                        </div>

                        {/* Expertise & Datasets Tags */}
                        <div className="pt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-600">
                          <span className="font-semibold text-slate-800">Shared Skills:</span>
                          {match.sharedInterests.map((skill, sIdx) => (
                            <React.Fragment key={sIdx}>
                              <span className="text-slate-900 font-medium">{skill}</span>
                              {sIdx < match.sharedInterests.length - 1 && <span className="text-slate-300">·</span>}
                            </React.Fragment>
                          ))}
                        </div>

                        {r.datasetsUsed.length > 0 && (
                          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-600">
                            <span className="font-semibold text-slate-800">Datasets Used:</span>
                            {r.datasetsUsed.map((ds, dIdx) => (
                              <React.Fragment key={dIdx}>
                                <span className="text-blue-900">{ds}</span>
                                {dIdx < r.datasetsUsed.length - 1 && <span className="text-slate-300">·</span>}
                              </React.Fragment>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Right: Match Score Card & Invite Action */}
                      <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between lg:justify-start gap-3 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                        
                        <div className="text-right">
                          <div className="flex items-center gap-2 justify-end">
                            <span className="text-2xl font-black font-mono tabular-nums text-slate-900">
                              {match.matchScore}%
                            </span>
                          </div>
                          <div className="text-[11px] font-semibold text-blue-700">
                            {match.confidenceTier} Match
                          </div>
                          
                          {/* Micro score breakdown */}
                          <div className="hidden lg:block text-[11px] text-slate-400 mt-1 space-y-0.5">
                            <div>Skills: {match.scoreBreakdown.skillsScore}%</div>
                            <div>Geo/Dataset: {match.scoreBreakdown.geoScore}%</div>
                          </div>
                        </div>

                        <button
                          onClick={() => onInviteClick(match)}
                          className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-sm whitespace-nowrap"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>Invite to Collaborate</span>
                        </button>
                      </div>

                    </div>
                  </div>
                );
              })}
            </>
          }
        />
      )}

      {/* Section 2: Matching Datasets */}
      {(activeFilter === 'all' || activeFilter === 'datasets') && results.matchingDatasets.length > 0 && (
        <ScrollableSection
          title="Matching Datasets & Repositories"
          icon={<Database className="w-4 h-4 text-emerald-600" />}
          countLabel={`${results.matchingDatasets.length} relevant repositories`}
          accentColor="emerald"
          itemCount={results.matchingDatasets.length}
          childrenRail={
            <>
              {results.matchingDatasets.map((ds) => (
                <div
                  key={ds.id}
                  className="w-[310px] sm:w-[370px] shrink-0 snap-start bg-white border border-slate-200 rounded-xl p-4.5 flex flex-col justify-between hover:border-slate-300 hover:shadow-md transition-all relative overflow-hidden group"
                >
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-crimson to-brand-navy" />
                  <div className="space-y-2.5 pt-1">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-sm font-bold text-slate-900 leading-snug group-hover:text-emerald-950 transition-colors">
                        {ds.title}
                      </h3>
                      <div className="flex flex-col items-end gap-1 shrink-0">
                        <span className="text-[11px] font-medium text-slate-600 bg-slate-50 border border-slate-200/80 px-2 py-0.5 rounded whitespace-nowrap">
                          {ds.license}
                        </span>
                        {ds.sourceType && (
                          <span className="text-[9px] font-mono font-bold text-emerald-800 bg-emerald-50 border border-brand-crimson px-1.5 py-0.2 rounded uppercase">
                            {ds.sourceType === 'mcp' ? 'MCP Harvested' : `${ds.sourceType} Harvester`}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="text-xs text-slate-600">
                      Publisher: <span className="font-semibold text-slate-800">{ds.publisher}</span>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                      {ds.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500 pt-1">
                      <span>Region: <span className="text-slate-700 font-medium">{ds.countryOrRegion}</span></span>
                      <span aria-hidden="true">·</span>
                      <span>Domain: <span className="text-slate-700 font-medium">{ds.domain}</span></span>
                      {ds.recordCount && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="font-mono text-slate-800 font-medium tabular-nums">{ds.recordCount.toLocaleString()} records</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-crimson" />
                      Ready for Project Import
                    </span>
                    <button className="text-xs font-semibold text-slate-900 hover:text-blue-600 flex items-center gap-1 transition-colors">
                      <span>Inspect Metadata</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </>
          }
          childrenList={
            <>
              {results.matchingDatasets.map((ds) => (
                <div
                  key={ds.id}
                  className="bg-white border border-slate-200 rounded-xl p-3.5 hover:border-slate-300 hover:shadow-xs transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-sm font-bold text-slate-900 leading-snug">
                        {ds.title}
                      </h3>
                      <span className="text-[11px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200/80">
                        {ds.license}
                      </span>
                      <span className="text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
                        Ready for Import
                      </span>
                    </div>
                    <div className="text-xs text-slate-600 line-clamp-1">
                      Publisher: <span className="font-medium text-slate-800">{ds.publisher}</span> · {ds.description}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span>Region: {ds.countryOrRegion}</span>
                      <span>·</span>
                      <span>Domain: {ds.domain}</span>
                      {ds.recordCount && (
                        <>
                          <span>·</span>
                          <span className="font-mono tabular-nums">{ds.recordCount.toLocaleString()} records</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                    <button className="text-xs font-semibold text-slate-900 hover:text-blue-600 flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors">
                      <span>Inspect Metadata</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </>
          }
        />
      )}

      {/* Section 3: Matching Funding Opportunities */}
      {(activeFilter === 'all' || activeFilter === 'funding') && results.matchingFunding.length > 0 && (
        <ScrollableSection
          title="Matching Funding Opportunities & Open Calls"
          icon={<Coins className="w-4 h-4 text-amber-600" />}
          countLabel={`${results.matchingFunding.length} open grants`}
          accentColor="amber"
          itemCount={results.matchingFunding.length}
          childrenRail={
            <>
              {results.matchingFunding.map((fund) => (
                <div
                  key={fund.id}
                  className="w-[310px] sm:w-[370px] shrink-0 snap-start bg-white border border-slate-200 rounded-xl p-4.5 flex flex-col justify-between hover:border-slate-300 hover:shadow-md transition-all relative overflow-hidden group"
                >
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-orange-400" />
                  <div className="space-y-2.5 pt-1">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-sm font-bold text-slate-900 leading-snug group-hover:text-amber-950 transition-colors">
                        {fund.title}
                      </h3>
                      <span className="text-xs font-bold font-mono text-emerald-700 bg-emerald-50 border border-brand-crimson px-2 py-0.5 rounded whitespace-nowrap shrink-0">
                        {fund.amount}
                      </span>
                    </div>

                    <div className="text-xs text-slate-600">
                      Funder: <span className="font-semibold text-slate-800">{fund.funder}</span>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                      {fund.summary}
                    </p>

                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500 pt-1">
                      <span>Deadline: <span className="font-semibold text-slate-700">{fund.deadline}</span></span>
                      <span aria-hidden="true">·</span>
                      <span>Regions: <span className="text-slate-700">{fund.eligibleRegions.join(', ')}</span></span>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-slate-500 flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{fund.originPlatformDomain || 'Verified Origin'}</span>
                    </span>
                    {fund.originUrl ? (
                      <a 
                        href={fund.originUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-semibold text-slate-900 hover:text-blue-600 flex items-center gap-1 transition-colors"
                      >
                        <span>Original Call</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    ) : (
                      <button className="text-xs font-semibold text-slate-900 hover:text-blue-600 flex items-center gap-1 transition-colors">
                        <span>View Call Details</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </>
          }
          childrenList={
            <>
              {results.matchingFunding.map((fund) => (
                <div
                  key={fund.id}
                  className="bg-white border border-slate-200 rounded-xl p-3.5 hover:border-slate-300 hover:shadow-xs transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-sm font-bold text-slate-900 leading-snug">
                        {fund.title}
                      </h3>
                      <span className="text-xs font-bold font-mono text-emerald-700 bg-emerald-50 border border-brand-crimson px-2 py-0.5 rounded">
                        {fund.amount}
                      </span>
                      {fund.originPlatformDomain && (
                        <span className="text-[11px] font-mono text-slate-700 bg-slate-50 border border-slate-200 px-1.5 py-0.2 rounded flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3 text-emerald-600" />
                          <span>{fund.originPlatformDomain}</span>
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-600 line-clamp-1">
                      Funder: <span className="font-medium text-slate-800">{fund.funder}</span> · {fund.summary}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span>Deadline: <span className="font-medium text-slate-700">{fund.deadline}</span></span>
                      <span>·</span>
                      <span>Regions: {fund.eligibleRegions.join(', ')}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                    {fund.originUrl ? (
                      <a
                        href={fund.originUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-semibold text-slate-900 hover:text-blue-600 flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
                      >
                        <span>Original Call Notice</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    ) : (
                      <button className="text-xs font-semibold text-slate-900 hover:text-blue-600 flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors">
                        <span>View Call Details</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </>
          }
        />
      )}


      {/* Section 4: Recommended Methodologies & Tools */}
      {results.suggestedMethodologies.length > 0 && (
        <section className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-purple-600" />
              <span>Recommended Methodologies & Computational Tools</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {results.suggestedMethodologies.map((m) => (
              <div key={m.id} className="bg-white border border-slate-200 rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900">
                    {m.name}
                  </h3>
                  <span className="text-[11px] font-medium text-slate-500 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                    {m.category}
                  </span>
                </div>

                <p className="text-xs text-slate-600">
                  {m.description}
                </p>

                <div className="pt-2 text-xs text-slate-600">
                  <span className="font-semibold text-slate-700">Recommended Software Tools: </span>
                  <span className="font-mono text-slate-900">{m.recommendedTools.join(' · ')}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

    </div>
  );
};
