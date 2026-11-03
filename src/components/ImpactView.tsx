import React from 'react';
import { INITIAL_IMPACT_RECORDS, type ImpactRecord } from '../data/mockData.ts';
import { TrendingUp, Award, ExternalLink, ShieldAlert, BarChart3, Globe, Sparkles } from 'lucide-react';

const SDG_DEFINITIONS: Record<number, { title: string; color: string; desc: string }> = {
  1: { title: "SDG 1: No Poverty", color: "bg-red-50 text-red-700 border-red-200", desc: "Target 1.4: Equal rights to economic resources & financial services" },
  2: { title: "SDG 2: Zero Hunger", color: "bg-amber-50 text-amber-700 border-amber-200", desc: "Target 2.3: Double agricultural productivity of small-scale food producers" },
  8: { title: "SDG 8: Decent Work & Economic Growth", color: "bg-purple-50 text-purple-700 border-brand-crimson", desc: "Target 8.10: Strengthen capacity of domestic financial institutions" },
  13: { title: "SDG 13: Climate Action", color: "bg-emerald-50 text-emerald-700 border-brand-crimson", desc: "Target 13.1: Strengthen resilience to climate-related hazards" }
};

export const ImpactView: React.FC = () => {
  const [impactRecords] = React.useState<ImpactRecord[]>(INITIAL_IMPACT_RECORDS);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
        <div className="text-xs font-semibold text-blue-700 uppercase tracking-wider">
          Layer 5 · Societal Impact & Commercialization Runway
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
          Research Impact & SDG Alignment Tracking
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-4xl">
          Track policy adoption by national ministries, commercial spin-offs and patent disclosures, and empirical contribution toward the UN Sustainable Development Goals.
        </p>
      </div>

      {/* Aggregate Impact KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <div className="text-xs text-slate-500">Farmers Benefited</div>
          <div className="text-2xl font-extrabold font-mono text-slate-900 tabular-nums mt-1">
            14,200+
          </div>
          <div className="text-[11px] text-emerald-700 font-medium mt-0.5">
            Western Kenya smallholders
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <div className="text-xs text-slate-500">Micro-Credit Scored</div>
          <div className="text-2xl font-extrabold font-mono text-slate-900 tabular-nums mt-1">
            $180,000
          </div>
          <div className="text-[11px] text-slate-600 mt-0.5">
            97.4% on-time repayment
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <div className="text-xs text-slate-500">Policy Briefs Adopted</div>
          <div className="text-2xl font-extrabold font-mono text-slate-900 tabular-nums mt-1">
            2 Formal
          </div>
          <div className="text-[11px] text-blue-700 font-medium mt-0.5">
            Kenya Ministry of Agriculture
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <div className="text-xs text-slate-500">Methodological Packages</div>
          <div className="text-2xl font-extrabold font-mono text-slate-900 tabular-nums mt-1">
            620+
          </div>
          <div className="text-[11px] text-purple-700 font-medium mt-0.5">
            R package downloads
          </div>
        </div>
      </div>

      {/* SDG Alignment Matrix */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Globe className="w-4 h-4 text-blue-600" />
            <span>UN Sustainable Development Goals (SDG) Alignment</span>
          </h2>
          <span className="text-xs text-slate-500 font-mono">Verified Empirical Indicators</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 8, 13].map((sdg) => {
            const def = SDG_DEFINITIONS[sdg];
            return (
              <div key={sdg} className={`p-4 rounded-xl border ${def.color} space-y-1.5`}>
                <div className="font-bold text-sm">{def.title}</div>
                <p className="text-xs opacity-90 leading-relaxed">{def.desc}</p>
                <div className="text-[11px] font-medium pt-1">
                  Active indicators: County agricultural credit access & drought yield buffer
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Policy Outputs & Spin-off Runway */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Award className="w-4 h-4 text-emerald-600" />
            <span>Recorded Policy Outputs & Applied Innovations</span>
          </h2>
          <span className="text-xs text-slate-500 font-mono">Nexus Impact Ledger</span>
        </div>

        <div className="divide-y divide-slate-100">
          {impactRecords.map((rec, idx) => (
            <div key={idx} className="py-4 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="space-y-1.5 flex-1 min-w-0 pr-0 sm:pr-4">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                    {rec.type}
                  </span>
                  <span className="text-xs text-slate-500">Date: {rec.date}</span>
                </div>

                <h3 className="text-sm font-bold text-slate-900">{rec.title}</h3>
                
                <div className="text-xs text-slate-600">
                  Beneficiary: <strong className="text-slate-800">{rec.organizationBeneficiary}</strong>
                </div>

                <div className="text-xs text-emerald-800 font-medium bg-emerald-50/70 p-2 rounded-lg border border-emerald-100">
                  Impact Proof: {rec.metrics}
                </div>
              </div>

              {rec.doiOrUrl && (
                <a
                  href={rec.doiOrUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-semibold text-blue-700 hover:text-blue-900 flex items-center gap-1 shrink-0 pt-1"
                >
                  <span>Verify Record</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
