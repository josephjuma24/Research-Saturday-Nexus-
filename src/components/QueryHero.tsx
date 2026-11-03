import React from 'react';
import { Search, Sparkles, ArrowRight, Compass, Database, Coins, Lightbulb, Bot } from 'lucide-react';

interface QueryHeroProps {
  currentQuery: string;
  onQueryChange: (query: string) => void;
  onExecuteSearch: (query: string) => void;
  isSearching: boolean;
  completenessScore: number;
  totalResearchersCount?: number;
  totalDatasetsCount?: number;
  totalFundingCount?: number;
  onOpenAgent?: () => void;
  onOpenDatasetAgent?: () => void;
  onOpenFundingAgent?: () => void;
}

const EXAMPLE_QUERIES = [
  {
    label: "Kenyan Agricultural Finance Statistician",
    text: "I need a statistician who understands agricultural finance and can work with Kenyan datasets."
  },
  {
    label: "Spatial Epidemiology & Malaria",
    text: "Looking for an expert in spatial epidemiology and Bayesian geostatistics with African health survey experience."
  },
  {
    label: "Plant Genomics & CRISPR Maize",
    text: "Need a plant geneticist with CRISPR Cas9 background for drought-resistant cereal trials."
  },
  {
    label: "Climate Adaptation Economics",
    text: "Seeking a climate adaptation economist to evaluate smallholder farmer credit risk in West Africa."
  }
];

export const QueryHero: React.FC<QueryHeroProps> = ({
  currentQuery,
  onQueryChange,
  onExecuteSearch,
  isSearching,
  completenessScore,
  totalResearchersCount = 4280,
  totalDatasetsCount = 1150,
  totalFundingCount = 3,
  onOpenAgent,
  onOpenDatasetAgent,
  onOpenFundingAgent
}) => {
  const [isFocused, setIsFocused] = React.useState(false);
  const SAMPLE_HINT = 'I need a statistician who understands agricultural finance and can work with Kenyan datasets.';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const queryToExecute = currentQuery.trim() || SAMPLE_HINT;
    if (!currentQuery.trim()) {
      onQueryChange(SAMPLE_HINT);
    }
    onExecuteSearch(queryToExecute);
  };

  return (
    <section className="bg-gradient-to-b from-slate-50 to-white border-b border-slate-200 pt-6 pb-10 w-full">
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-10">
        
        {/* Top Info Strip: Researcher Status & Profile Completeness (Top of Page) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3 text-xs text-slate-500">
            <span className="font-semibold text-slate-900">Dr. Joseph Juma</span>
            <span aria-hidden="true">·</span>
            <span>Nairobi Agricultural Institute</span>
            <span aria-hidden="true">·</span>
            <span className="text-emerald-700 font-medium">Accepting Collaborations</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-xs text-slate-500">Profile Completeness</span>
              <span className="ml-2 text-xs font-bold font-mono tabular-nums text-slate-900">{completenessScore}%</span>
            </div>
            <div className="w-24 h-2 bg-slate-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-slate-900 rounded-full transition-all duration-500"
                style={{ width: `${completenessScore}%` }}
              />
            </div>
          </div>
        </div>

        {/* Hero Title & Value Proposition */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Intelligent Research Intelligence Engine</span>
          </div>

          {/* Research Radar Quick Stats Metrics Card */}
          <div className="my-4 py-3.5 border-y border-slate-200/80 grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-700 shrink-0">
                <Compass className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs text-slate-500 flex items-center gap-1">
                  <span>Active Researchers</span>
                  {totalResearchersCount > 4280 && (
                    <span className="text-[10px] text-blue-600 bg-blue-50 px-1 rounded font-semibold font-mono">
                      +{totalResearchersCount - 4280} new
                    </span>
                  )}
                </div>
                <div className="text-sm font-bold font-mono tabular-nums text-slate-900">
                  {totalResearchersCount.toLocaleString()} Verified
                </div>
              </div>
            </div>

            <div 
              onClick={onOpenDatasetAgent}
              className={`flex items-center gap-3 ${onOpenDatasetAgent ? 'cursor-pointer group' : ''}`}
              title={onOpenDatasetAgent ? "Open Weekly Autonomous Open Data & MCP Harvester" : undefined}
            >
              <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-700 shrink-0 group-hover:bg-emerald-100 transition-colors">
                <Database className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs text-slate-500 flex items-center gap-1">
                  <span>Indexed Datasets</span>
                  {totalDatasetsCount > 1150 && (
                    <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1 rounded font-semibold font-mono">
                      +{totalDatasetsCount - 1150} new
                    </span>
                  )}
                </div>
                <div className="text-sm font-bold font-mono tabular-nums text-slate-900 group-hover:text-emerald-800 transition-colors">
                  {totalDatasetsCount.toLocaleString()} Portals
                </div>
              </div>
            </div>

            <div 
              onClick={onOpenFundingAgent}
              className={`flex items-center gap-3 ${onOpenFundingAgent ? 'cursor-pointer group' : ''}`}
              title={onOpenFundingAgent ? "Open Daily Autonomous Open Funding Calls Scout" : undefined}
            >
              <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-700 shrink-0 group-hover:bg-amber-100 transition-colors">
                <Coins className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs text-slate-500 flex items-center gap-1">
                  <span>Open Funding Calls</span>
                  {totalFundingCount > 3 && (
                    <span className="text-[10px] text-amber-700 bg-amber-50 px-1 rounded font-semibold font-mono">
                      +{totalFundingCount - 3} new
                    </span>
                  )}
                </div>
                <div className="text-sm font-bold font-mono tabular-nums text-slate-900 group-hover:text-amber-800 transition-colors">
                  {totalFundingCount} Verified Calls
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center text-purple-700 shrink-0">
                <Lightbulb className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs text-slate-500">Research Workspaces</div>
                <div className="text-sm font-bold font-mono tabular-nums text-slate-900">620 Collaborative</div>
              </div>
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-2">
            What do you need right now?
          </h1>
          <p className="mt-2 text-sm sm:text-[15px] lg:text-base text-slate-600 w-full max-w-none">
            Describe your research bottleneck, target dataset, methodology, or desired collaborator in plain natural language. Nexus indexes expertise, open microdata, and active funding streams simultaneously.
          </p>
        </div>

        {/* Natural Language Query Box - Full Width Fluid */}
        <form onSubmit={handleSubmit} className="relative w-full">
          <div className="relative flex items-center bg-white border border-slate-300 rounded-xl shadow-sm focus-within:border-slate-900 focus-within:ring-2 focus-within:ring-slate-900/10 transition-all p-1.5">
            <div className="pl-3.5 pr-2.5 text-slate-400">
              <Search className="w-5 h-5" />
            </div>
            <input
              type="text"
              value={currentQuery}
              onChange={(e) => onQueryChange(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder={isFocused ? '' : SAMPLE_HINT}
              className="w-full py-2.5 px-2 text-sm sm:text-base text-slate-900 placeholder:text-slate-500 focus:placeholder-transparent focus:outline-none bg-transparent"
              aria-label="Natural language query: What do you need right now?"
            />
            <button
              type="submit"
              disabled={isSearching}
              className="flex items-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shrink-0 shadow-sm"
            >
              {isSearching ? (
                <span>Matching...</span>
              ) : (
                <>
                  <span>Match Now</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Example Query Quick Buttons */}
        <div className="mt-4 flex flex-wrap items-center gap-2 w-full">
          <span className="text-xs font-medium text-slate-400">Try asking:</span>
          {EXAMPLE_QUERIES.map((q, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                onQueryChange(q.text);
                onExecuteSearch(q.text);
              }}
              className="px-2.5 py-1 text-xs text-slate-600 bg-white hover:bg-slate-100 hover:text-slate-900 border border-slate-200 rounded-md transition-colors text-left"
            >
              {q.label}
            </button>
          ))}
        </div>

      </div>
    </section>
  );
};
