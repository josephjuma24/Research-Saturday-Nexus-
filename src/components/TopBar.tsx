import React from 'react';
import { 
  Compass, 
  Layers, 
  BookOpen, 
  Users, 
  TrendingUp, 
  FileCode2, 
  Plus, 
  ShieldCheck, 
  CheckCircle2,
  ChevronDown
} from 'lucide-react';

export type NavTab = 'discover' | 'build' | 'publish' | 'connect' | 'impact' | 'agent' | 'dataset-agent' | 'funding-agent' | 'specification';

export type UserRole = 
  | 'RESEARCHER' 
  | 'MENTOR' 
  | 'INDUSTRY_PARTNER' 
  | 'INSTITUTIONAL_ADMIN' 
  | 'SYSTEM_MODERATOR';

interface TopBarProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  onNewProjectClick: () => void;
}

const ROLE_LABELS: Record<UserRole, string> = {
  RESEARCHER: 'Researcher (Dr. Juma)',
  MENTOR: 'Senior Mentor / Advisor',
  INDUSTRY_PARTNER: 'Industry Innovator (AgriFinance)',
  INSTITUTIONAL_ADMIN: 'Institutional Admin (UoN)',
  SYSTEM_MODERATOR: 'System Moderator'
};

export const TopBar: React.FC<TopBarProps> = ({
  activeTab,
  onTabChange,
  currentRole,
  onRoleChange,
  onNewProjectClick
}) => {
  const [roleMenuOpen, setRoleMenuOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 w-full">
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-10">
        <div className="flex items-center justify-between gap-8 h-16">
          
          {/* Zone 1: Brand title, one line */}
          <div className="flex items-center gap-3 shrink-0">
            <button 
              onClick={() => onTabChange('discover')}
              className="flex items-center gap-2.5 text-left focus:outline-none"
            >
              <div className="w-9 h-9 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-sm tracking-tight shadow-sm">
                RS
              </div>
              <div>
                <span className="text-base font-bold text-slate-900 tracking-tight whitespace-nowrap block">
                  Research Saturday Nexus
                </span>
                <span className="text-[11px] text-slate-500 font-medium tracking-normal block leading-tight">
                  Intelligent Research Intelligence Platform
                </span>
              </div>
            </button>
          </div>

          {/* Zone 2: 5-6 Clean single-line nav links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            <button
              onClick={() => onTabChange('discover')}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
                activeTab === 'discover'
                  ? 'bg-slate-100 text-slate-900'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Compass className="w-3.5 h-3.5 text-slate-500" />
              <span>Discover</span>
            </button>

            <button
              onClick={() => onTabChange('build')}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
                activeTab === 'build'
                  ? 'bg-slate-100 text-slate-900'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-slate-500" />
              <span>Build</span>
            </button>

            <button
              onClick={() => onTabChange('publish')}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
                activeTab === 'publish'
                  ? 'bg-slate-100 text-slate-900'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-slate-500" />
              <span>Publish</span>
            </button>

            <button
              onClick={() => onTabChange('connect')}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
                activeTab === 'connect'
                  ? 'bg-slate-100 text-slate-900'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Users className="w-3.5 h-3.5 text-slate-500" />
              <span>Connect</span>
            </button>

            <button
              onClick={() => onTabChange('impact')}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
                activeTab === 'impact'
                  ? 'bg-slate-100 text-slate-900'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5 text-slate-500" />
              <span>Impact</span>
            </button>

            <div className="h-4 w-px bg-slate-200 mx-1" />

            <button
              onClick={() => onTabChange('specification')}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-md transition-colors whitespace-nowrap ${
                activeTab === 'specification'
                  ? 'bg-blue-50 text-blue-800 ring-1 ring-blue-200'
                  : 'text-blue-700 hover:bg-blue-50/60'
              }`}
            >
              <FileCode2 className="w-3.5 h-3.5 text-blue-600" />
              <span>Technical Blueprint</span>
            </button>
          </nav>

          {/* Zone 3: 1 primary action + Role Context Switcher */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Role Switcher Pill Dropdown */}
            <div className="relative">
              <button
                onClick={() => setRoleMenuOpen(!roleMenuOpen)}
                className="flex items-center gap-2 px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-md transition-colors whitespace-nowrap"
                aria-expanded={roleMenuOpen}
                aria-label="Switch RBAC user role"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-slate-500" />
                <span className="hidden sm:inline">{ROLE_LABELS[currentRole]}</span>
                <span className="sm:hidden">{currentRole.slice(0, 4)}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {roleMenuOpen && (
                <div 
                  className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-lg shadow-lg py-1.5 z-50 text-xs"
                  role="menu"
                >
                  <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                    Switch Active RBAC Role
                  </div>
                  {(Object.keys(ROLE_LABELS) as UserRole[]).map((r) => (
                    <button
                      key={r}
                      onClick={() => {
                        onRoleChange(r);
                        setRoleMenuOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-slate-50 transition-colors ${
                        currentRole === r ? 'font-semibold text-slate-900 bg-slate-50' : 'text-slate-600'
                      }`}
                      role="menuitem"
                    >
                      <span>{ROLE_LABELS[r]}</span>
                      {currentRole === r && <CheckCircle2 className="w-3.5 h-3.5 text-slate-900" />}
                    </button>
                  ))}
                  <div className="px-3 py-2 bg-slate-50 text-[11px] text-slate-500 border-t border-slate-100">
                    Enforces Least Privilege Security Matrix in real-time.
                  </div>
                </div>
              )}
            </div>

            {/* Primary Action Button */}
            <button
              onClick={onNewProjectClick}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors shadow-sm whitespace-nowrap"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">New Project</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
