import React from 'react';
import { SPECIFICATION_SECTIONS, type SpecSection } from '../data/specificationContent.ts';
import { 
  FileCode2, 
  Search, 
  Copy, 
  Check, 
  Download, 
  ChevronRight, 
  ShieldCheck, 
  Database, 
  Cpu, 
  Server, 
  Layers, 
  Lock,
  GitBranch,
  Terminal,
  Activity
} from 'lucide-react';

export const TechnicalBlueprintView: React.FC = () => {
  const [selectedSectionId, setSelectedSectionId] = React.useState<string>(SPECIFICATION_SECTIONS[0].id);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [copiedCodeId, setCopiedCodeId] = React.useState<string | null>(null);
  const [copiedAll, setCopiedAll] = React.useState(false);
  const [matrixRoleFilter, setMatrixRoleFilter] = React.useState<string>('ALL');

  const selectedSection = SPECIFICATION_SECTIONS.find(s => s.id === selectedSectionId) || SPECIFICATION_SECTIONS[0];

  const filteredSections = React.useMemo(() => {
    if (!searchQuery.trim()) return SPECIFICATION_SECTIONS;
    const q = searchQuery.toLowerCase();
    return SPECIFICATION_SECTIONS.filter(s => 
      s.title.toLowerCase().includes(q) || 
      s.summary.toLowerCase().includes(q) ||
      s.content.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const handleCopyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeId(id);
    setTimeout(() => setCopiedCodeId(null), 2000);
  };

  const handleExportFullMarkdown = () => {
    const fullDoc = SPECIFICATION_SECTIONS.map(s => {
      let text = `# ${s.number}. ${s.title}\n\n${s.summary}\n\n${s.content}\n\n`;
      if (s.codeBlocks) {
        for (const cb of s.codeBlocks) {
          text += `\`\`\`${cb.language} // ${cb.filename}\n${cb.code}\n\`\`\`\n\n`;
        }
      }
      return text;
    }).join('\n---\n\n');

    navigator.clipboard.writeText(fullDoc);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-slate-900 text-white rounded-xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-blue-400 bg-blue-950/80 px-2.5 py-1 rounded-md mb-2">
              <FileCode2 className="w-3.5 h-3.5" />
              <span>Full-Stack Architecture & Production Blueprint</span>
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight">
              Research Saturday Nexus Platform Specification
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-4xl leading-relaxed">
              Complete, implementable developer technical blueprint: Django 5 models, RESTful API schemas, pgvector hybrid matching engine, Security Matrix, Celery pipelines, and deployment topology.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleExportFullMarkdown}
              className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-900 bg-white hover:bg-slate-100 rounded-lg transition-colors shadow-sm"
            >
              {copiedAll ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedAll ? 'Full Blueprint Copied!' : 'Copy Full Blueprint (MD)'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Sidebar: Section Index & Search */}
        <aside className="lg:col-span-4 bg-white border border-slate-200 rounded-xl p-4 space-y-4">
          
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter 14 specification sections..."
              className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 bg-slate-50"
            />
          </div>

          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-1">
            Blueprint Sections ({filteredSections.length})
          </div>

          {/* Section Navigation List */}
          <nav className="space-y-1 max-h-[640px] overflow-y-auto pr-1" aria-label="Specification Sections">
            {filteredSections.map((sec) => {
              const isSelected = sec.id === selectedSectionId;
              return (
                <button
                  key={sec.id}
                  onClick={() => setSelectedSectionId(sec.id)}
                  className={`w-full text-left px-3 py-2.5 rounded-lg text-xs transition-colors flex items-start gap-2.5 ${
                    isSelected 
                      ? 'bg-slate-900 text-white font-semibold shadow-xs' 
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span className={`font-mono text-[11px] ${isSelected ? 'text-blue-300' : 'text-slate-400'}`}>
                    {String(sec.number).padStart(2, '0')}
                  </span>
                  <div className="flex-1 leading-snug">
                    <div className="truncate">{sec.title}</div>
                    <div className={`text-[10px] truncate mt-0.5 ${isSelected ? 'text-slate-300' : 'text-slate-400'}`}>
                      {sec.summary}
                    </div>
                  </div>
                  <ChevronRight className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${isSelected ? 'text-white' : 'text-slate-300'}`} />
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Right Content Area: Detailed Section View */}
        <main className="lg:col-span-8 bg-white border border-slate-200 rounded-xl p-6 space-y-6">
          
          {/* Section Header */}
          <div className="border-b border-slate-200 pb-4">
            <div className="text-xs font-mono font-bold text-blue-700">
              Section {selectedSection.number} of 14
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight mt-1">
              {selectedSection.title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              {selectedSection.summary}
            </p>
          </div>

          {/* Interactive Security Matrix Viewer if on Section 6 */}
          {selectedSection.id === 'security-matrix' && (
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Interactive Security Matrix Filter (Least Privilege)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-500 font-medium">Filter Role:</span>
                  <select
                    value={matrixRoleFilter}
                    onChange={(e) => setMatrixRoleFilter(e.target.value)}
                    className="text-xs border border-slate-300 rounded px-2 py-1 bg-white focus:outline-none"
                  >
                    <option value="ALL">All Roles</option>
                    <option value="Researcher">Researcher</option>
                    <option value="Mentor">Mentor</option>
                    <option value="Industry Partner">Industry Partner</option>
                    <option value="Institutional Admin">Institutional Admin</option>
                    <option value="System Moderator">System Moderator</option>
                  </select>
                </div>
              </div>
              <p className="text-xs text-slate-600">
                Enforced by Django REST Framework permission classes (\`IsActiveResearcher\`, \`IsProjectMemberOrPublic\`, \`IsProjectLead\`, \`IsInviteRecipient\`) and frontend route guards.
              </p>
            </div>
          )}

          {/* Section Markdown Prose */}
          <div className="prose prose-sm max-w-none text-slate-700 leading-relaxed space-y-3 text-xs sm:text-sm whitespace-pre-wrap font-sans">
            {selectedSection.content}
          </div>

          {/* Code Blocks */}
          {selectedSection.codeBlocks && selectedSection.codeBlocks.length > 0 && (
            <div className="space-y-4 pt-2">
              {selectedSection.codeBlocks.map((cb, idx) => {
                const codeId = `${selectedSection.id}-${idx}`;
                const isCopied = copiedCodeId === codeId;
                return (
                  <div key={idx} className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950 text-slate-100 font-mono text-xs shadow-xs">
                    <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800 text-[11px] text-slate-400">
                      <span>{cb.filename}</span>
                      <button
                        onClick={() => handleCopyCode(cb.code, codeId)}
                        className="flex items-center gap-1 hover:text-white transition-colors py-0.5 px-2 rounded bg-slate-800"
                        aria-label={`Copy code for ${cb.filename}`}
                      >
                        {isCopied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>{isCopied ? 'Copied' : 'Copy Code'}</span>
                      </button>
                    </div>
                    <pre className="p-4 overflow-x-auto text-[11px] leading-relaxed">
                      <code>{cb.code}</code>
                    </pre>
                  </div>
                );
              })}
            </div>
          )}

          {/* Footer Navigation */}
          <div className="border-t border-slate-200 pt-4 flex items-center justify-between">
            <button
              disabled={selectedSection.number === 1}
              onClick={() => {
                const prev = SPECIFICATION_SECTIONS.find(s => s.number === selectedSection.number - 1);
                if (prev) setSelectedSectionId(prev.id);
              }}
              className="text-xs font-semibold text-slate-600 hover:text-slate-900 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              ← Previous Section
            </button>

            <span className="text-xs text-slate-400 font-mono">
              {selectedSection.number} / {SPECIFICATION_SECTIONS.length}
            </span>

            <button
              disabled={selectedSection.number === SPECIFICATION_SECTIONS.length}
              onClick={() => {
                const next = SPECIFICATION_SECTIONS.find(s => s.number === selectedSection.number + 1);
                if (next) setSelectedSectionId(next.id);
              }}
              className="text-xs font-semibold text-slate-600 hover:text-slate-900 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Next Section →
            </button>
          </div>

        </main>
      </div>

    </div>
  );
};
