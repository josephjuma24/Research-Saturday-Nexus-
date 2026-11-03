import React from 'react';
import { INITIAL_JOURNAL_MATCHES, type JournalMatch } from '../data/mockData.ts';
import { BookOpen, FileText, Check, ExternalLink, Sparkles, Send, Award } from 'lucide-react';

export const PublishView: React.FC = () => {
  const [journals] = React.useState<JournalMatch[]>(INITIAL_JOURNAL_MATCHES);
  const [activeSection, setActiveSection] = React.useState<'journals' | 'manuscript' | 'coauthors'>('journals');
  const [abstractText, setAbstractText] = React.useState(
    "This study evaluates the causal effect of mobile microcredit programs on crop yield stabilization and fertilizer adoption among smallholder farmers in Western Kenya. Utilizing a staggered difference-in-differences estimator across 47 county rollout waves and three repeated cross-sectional surveys from 2020 to 2024, we show that digital credit access enhances fertilizer investment by 28% and mitigates yield variance during moderate rainfall deficits."
  );

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-semibold text-blue-700 uppercase tracking-wider">
              Layer 3 · Publish & Dissemination Engine
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
              Academic Publishing & Journal Discovery
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-4xl">
              Match your research abstract to indexed journals, configure co-authorship equity, and link cross-repository digital object identifiers (DOIs).
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveSection('journals')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                activeSection === 'journals' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Journal Matcher
            </button>
            <button
              onClick={() => setActiveSection('manuscript')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                activeSection === 'manuscript' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Manuscript Draft
            </button>
          </div>
        </div>
      </div>

      {/* Journal Recommender Panel */}
      {activeSection === 'journals' && (
        <div className="space-y-6">
          
          {/* Abstract Input Box for Journal Matching */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span>Paper Abstract for Semantic Scope Matching</span>
              </label>
              <span className="text-xs text-slate-500">Live Semantic Aim Analyzer</span>
            </div>
            <textarea
              rows={4}
              value={abstractText}
              onChange={(e) => setAbstractText(e.target.value)}
              className="w-full p-3 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 text-slate-800 leading-relaxed font-sans"
            />
          </div>

          {/* Ranked Journal Matches */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-blue-600" />
                <span>Top Journal Matches Ranked by Aims & Scope</span>
              </h2>
              <span className="text-xs text-slate-500 font-mono tabular-nums">
                {journals.length} indexed outlets scored
              </span>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {journals.map((j) => (
                <div key={j.id} className="bg-white border border-slate-200 rounded-xl p-5 hover:border-slate-300 transition-colors">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="space-y-2 flex-1 min-w-0 pr-0 md:pr-4">
                      <div className="flex items-center gap-3">
                        <h3 className="text-base font-bold text-slate-900">{j.journalName}</h3>
                        <span className="text-xs text-slate-500">({j.publisher})</span>
                        {j.openAccess && (
                          <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                            Open Access
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-4 text-xs text-slate-600">
                        <span>Impact Factor: <strong className="font-mono text-slate-900">{j.impactFactor}</strong></span>
                        <span aria-hidden="true">·</span>
                        <span>Avg Review Speed: <strong className="font-mono text-slate-900">{j.avgReviewWeeks} weeks</strong></span>
                      </div>

                      <p className="text-xs text-slate-600 pt-1">
                        {j.focusAlignment}
                      </p>
                    </div>

                    <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-start gap-2 shrink-0">
                      <div className="text-right">
                        <div className="text-2xl font-black font-mono tabular-nums text-slate-900">
                          {j.matchPercentage}%
                        </div>
                        <div className="text-[11px] font-semibold text-blue-700">Aim Alignment</div>
                      </div>

                      <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors">
                        <span>Author Guidelines</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* Manuscript Workspace */}
      {activeSection === 'manuscript' && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <FileText className="w-4 h-4 text-blue-600" />
            <span>Structured Manuscript Outline & Author Attribution</span>
          </h2>

          <div className="space-y-3">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <div className="text-xs font-bold text-slate-900">1. Introduction & Theoretical Framing</div>
              <p className="text-xs text-slate-600 mt-1">Lead: Dr. Joseph Juma · Reviewer: Prof. Kwame Mensah</p>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <div className="text-xs font-bold text-slate-900">2. Econometric Methodology (Staggered DiD & Pre-Trends)</div>
              <p className="text-xs text-slate-600 mt-1">Lead: Dr. Wanjiru Karanja · Reviewer: Dr. Brian Ochieng</p>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <div className="text-xs font-bold text-slate-900">3. Household Survey Microdata & Robustness Tables</div>
              <p className="text-xs text-slate-600 mt-1">Lead: Amina Mwangi, MSc · Status: Drafting in progress</p>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <div className="text-xs font-bold text-slate-900">4. Policy Implications for Smallholder Subsidies</div>
              <p className="text-xs text-slate-600 mt-1">Lead: Dr. Joseph Juma · Policy Liaison feedback integrated</p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
