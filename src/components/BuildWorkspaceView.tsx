import React from 'react';
import type { ProjectWorkspace } from '../data/mockData.ts';
import { 
  Layers, 
  Users, 
  BookOpen, 
  CheckCircle2, 
  Circle, 
  Cpu, 
  Calendar, 
  MapPin, 
  ExternalLink,
  Plus,
  ShieldCheck,
  FileText
} from 'lucide-react';

interface BuildWorkspaceViewProps {
  project: ProjectWorkspace;
  onToggleMilestone: (milestoneId: string) => void;
  onInviteMoreClick: () => void;
}

export const BuildWorkspaceView: React.FC<BuildWorkspaceViewProps> = ({
  project,
  onToggleMilestone,
  onInviteMoreClick
}) => {
  const [activeTab, setActiveTab] = React.useState<'overview' | 'team' | 'methodology' | 'literature' | 'milestones'>('overview');

  const completedCount = project.milestones.filter(m => m.status === 'Completed').length;
  const progressPercent = Math.round((completedCount / project.milestones.length) * 100);

  return (
    <div className="space-y-6">
      
      {/* Workspace Header & Title Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="space-y-2 flex-1 min-w-0 pr-0 md:pr-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-semibold text-blue-800 bg-blue-50 px-2.5 py-0.5 rounded">
                Active Project Workspace
              </span>
              <span className="text-xs text-slate-500 font-medium">
                Stage: <span className="font-semibold text-slate-900">{project.status}</span>
              </span>
              <span className="text-slate-300">·</span>
              <span className="text-xs text-slate-500 font-medium">
                Domain: <span className="text-slate-700">{project.domain}</span>
              </span>
            </div>

            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {project.title}
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {project.abstract}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-slate-500">
              <span>Lead: <strong className="text-slate-800">{project.leadResearcher}</strong></span>
              <span aria-hidden="true">·</span>
              <span>Target: <strong className="text-slate-800">{project.targetCompletion}</strong></span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1 text-emerald-700 font-medium">
                <ShieldCheck className="w-3.5 h-3.5" />
                IRB Protocol Approved
              </span>
            </div>
          </div>

          {/* Right Action & Progress */}
          <div className="flex flex-col items-start md:items-end justify-between gap-3 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
            <div className="text-left md:text-right">
              <div className="text-xs text-slate-500">Milestone Velocity</div>
              <div className="text-xl font-bold font-mono text-slate-900 tabular-nums">
                {progressPercent}%
              </div>
              <div className="text-[11px] text-slate-500">
                {completedCount} of {project.milestones.length} milestones complete
              </div>
            </div>

            <button
              onClick={onInviteMoreClick}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Invite Collaborator</span>
            </button>
          </div>
        </div>

        {/* Workspace Sub-Navigation Tabs */}
        <div className="mt-6 pt-4 border-t border-slate-200 flex flex-wrap items-center gap-1">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              activeTab === 'overview' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Overview & Planning
          </button>
          <button
            onClick={() => setActiveTab('team')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              activeTab === 'team' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Team Formation ({project.members.length})
          </button>
          <button
            onClick={() => setActiveTab('methodology')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              activeTab === 'methodology' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Methodology & Tools
          </button>
          <button
            onClick={() => setActiveTab('literature')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              activeTab === 'literature' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Literature Binder ({project.literature.length})
          </button>
          <button
            onClick={() => setActiveTab('milestones')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              activeTab === 'milestones' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Milestone Checklist
          </button>
        </div>
      </div>

      {/* Tab: Overview & Milestones Strip */}
      {(activeTab === 'overview' || activeTab === 'milestones') && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Milestones Task List */}
          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Research Milestone Deliverables</span>
              </h2>
              <span className="text-xs text-slate-500">Click to toggle state</span>
            </div>

            <div className="divide-y divide-slate-100">
              {project.milestones.map((m) => {
                const isDone = m.status === 'Completed';
                return (
                  <div 
                    key={m.id}
                    onClick={() => onToggleMilestone(m.id)}
                    className="py-3 flex items-start gap-3 cursor-pointer hover:bg-slate-50 px-2 rounded-lg transition-colors group"
                  >
                    <button 
                      type="button"
                      className="mt-0.5 text-slate-400 group-hover:text-slate-600 transition-colors"
                      aria-label={`Toggle milestone ${m.title}`}
                    >
                      {isDone ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-50" />
                      ) : (
                        <Circle className="w-5 h-5 text-slate-300" />
                      )}
                    </button>

                    <div className="flex-1">
                      <div className={`text-xs sm:text-sm font-medium ${isDone ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                        {m.title}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-500 mt-0.5">
                        <span>Owner: <strong className="text-slate-700">{m.owner}</strong></span>
                        <span aria-hidden="true">·</span>
                        <span>Due: <span className="font-mono">{m.dueDate}</span></span>
                        <span aria-hidden="true">·</span>
                        <span className={`text-[11px] font-semibold ${
                          m.status === 'Completed' ? 'text-emerald-700' :
                          m.status === 'In Progress' ? 'text-amber-700' : 'text-slate-500'
                        }`}>
                          {m.status}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Connected Datasets & Spatial Scope */}
          <div className="space-y-4">
            <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Layers className="w-4 h-4 text-blue-600" />
                <span>Mounted Datasets</span>
              </h2>
              <ul className="space-y-2 text-xs text-slate-700">
                {project.datasets.map((d, idx) => (
                  <li key={idx} className="p-2.5 bg-slate-50 rounded-lg border border-slate-200/60 font-medium flex items-center justify-between">
                    <span>{d}</span>
                    <span className="text-[10px] text-emerald-700 font-bold">READY</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-2">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-rose-600" />
                <span>Geographic Scope</span>
              </h2>
              <p className="text-xs text-slate-600">
                Kenya Western Region: Bungoma, Kakamega, and Kisumu Counties. Total target sample: 1,200 rural smallholder households.
              </p>
            </div>
          </div>

        </div>
      )}

      {/* Tab: Team Formation */}
      {(activeTab === 'overview' || activeTab === 'team') && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-600" />
                <span>Research Team & Assigned Roles</span>
              </h2>
              <p className="text-xs text-slate-500">
                Multi-disciplinary team composed through Nexus Intelligent Matching
              </p>
            </div>
            <button
              onClick={onInviteMoreClick}
              className="text-xs font-semibold text-slate-900 hover:text-blue-600 flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Member</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {project.members.map((mem) => (
              <div key={mem.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-slate-800 text-white flex items-center justify-center text-xs font-bold font-mono">
                    {mem.avatarInitials}
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm font-bold text-slate-900">{mem.name}</div>
                    <div className="text-[11px] text-slate-500">{mem.country}</div>
                  </div>
                </div>

                <div className="text-xs font-semibold text-blue-800 bg-blue-50 px-2 py-0.5 rounded inline-block">
                  {mem.role}
                </div>

                <div className="text-xs text-slate-600 truncate">
                  {mem.institution}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Methodology & Computational Tools */}
      {(activeTab === 'overview' || activeTab === 'methodology') && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Cpu className="w-4 h-4 text-purple-600" />
            <span>Research Design & Methodological Protocol</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Primary Estimator</h3>
              <div className="text-sm font-bold text-slate-900">{project.methodology}</div>
              <p className="text-xs text-slate-600 leading-relaxed">{project.methodologyDetails}</p>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Integrated Computational Stack</h3>
              <div className="flex flex-wrap gap-2 pt-1">
                {project.tools.map((t, idx) => (
                  <span key={idx} className="bg-white border border-slate-200 text-slate-800 text-xs font-mono font-medium px-2.5 py-1 rounded-md">
                    {t}
                  </span>
                ))}
              </div>
              <p className="text-xs text-slate-500 pt-1">
                Data pipeline configured with automated checks for survey attrition and outlier trimming.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Literature Binder */}
      {(activeTab === 'overview' || activeTab === 'literature') && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-emerald-600" />
            <span>Literature Binder & Core Theoretical Citations</span>
          </h2>

          <div className="divide-y divide-slate-100">
            {project.literature.map((lit, idx) => (
              <div key={idx} className="py-3 flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="text-xs sm:text-sm font-bold text-slate-900">{lit.title}</div>
                  <div className="text-xs text-slate-600">{lit.authors} ({lit.year})</div>
                  <div className="text-xs text-slate-500 italic">{lit.journal}</div>
                </div>

                <a 
                  href={`https://doi.org/${lit.doi}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-mono text-blue-700 hover:text-blue-900 flex items-center gap-1 shrink-0 pt-1"
                >
                  <span>DOI: {lit.doi}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
