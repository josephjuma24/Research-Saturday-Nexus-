import React from 'react';
import { 
  Compass, 
  Layers, 
  BookOpen, 
  Users, 
  TrendingUp, 
  FileCode2, 
  ShieldCheck, 
  CheckCircle2,
  ChevronDown,
  X,
  Plus,
  Sparkles,
  Bot,
  Database,
  Coins
} from 'lucide-react';
import type { NavTab, UserRole } from './TopBar.tsx';
import { BrandMark } from './BrandWordmark.tsx';

interface SidebarProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  onNewProjectClick: () => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

const ROLE_LABELS: Record<UserRole, string> = {
  RESEARCHER: 'Researcher (Dr. Juma)',
  MENTOR: 'Senior Mentor / Advisor',
  INDUSTRY_PARTNER: 'Industry Innovator (AgriFinance)',
  INSTITUTIONAL_ADMIN: 'Institutional Admin (UoN)',
  SYSTEM_MODERATOR: 'System Moderator'
};

interface NavItemDef {
  id: NavTab;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  isSpecial?: boolean;
}

const LIFECYCLE_NAV_ITEMS: NavItemDef[] = [
  {
    id: 'discover',
    label: 'Discover',
    description: 'Find experts, datasets & grants',
    icon: Compass
  },
  {
    id: 'build',
    label: 'Build',
    description: 'Project workspaces & teams',
    icon: Layers
  },
  {
    id: 'publish',
    label: 'Publish',
    description: 'Journal matcher & writing',
    icon: BookOpen
  },
  {
    id: 'connect',
    label: 'Connect',
    description: 'Communities & symposiums',
    icon: Users
  },
  {
    id: 'impact',
    label: 'Impact',
    description: 'SDGs & policy adoption',
    icon: TrendingUp
  }
];

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  currentRole,
  onRoleChange,
  onNewProjectClick,
  isOpenMobile,
  onCloseMobile
}) => {
  const [roleMenuOpen, setRoleMenuOpen] = React.useState(false);

  const handleItemClick = (tab: NavTab) => {
    onTabChange(tab);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpenMobile && (
        <div 
          className="fixed inset-0 bg-slate-900/40 z-40 lg:hidden backdrop-blur-xs transition-opacity"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      {/* Vertical Sidebar Panel */}
      <aside 
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 sm:w-72 bg-white border-r border-slate-200 flex flex-col justify-between transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
        aria-label="Nexus Navigation Sidebar"
      >
        {/* Top Section: Brand & Quick Action */}
        <div className="p-4 border-b border-slate-100 space-y-3 relative">
          <div className="brand-rule absolute top-0 left-0 right-0" aria-hidden="true">
            <span className="rounded-none!" />
            <span className="rounded-none!" />
            <span className="rounded-none!" />
          </div>
          <div className="flex items-center justify-between">
            <button
              onClick={() => handleItemClick('discover')}
              className="flex items-center gap-2.5 text-left focus:outline-none"
            >
              <BrandMark />
              <div>
                <span className="text-sm font-black text-brand-navy tracking-tight block whitespace-nowrap uppercase">
                  Research Saturday
                </span>
                <span className="text-[10px] font-bold block leading-tight tracking-[0.3em] text-brand-crimson">
                  KENYA <span className="tracking-normal font-medium text-slate-500">· Nexus</span>
                </span>
              </div>
            </button>

            {/* Mobile Close Button */}
            <button
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-100"
              aria-label="Close navigation sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* New Project Button */}
          <button
            onClick={() => {
              onNewProjectClick();
              onCloseMobile();
            }}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create New Project</span>
          </button>
        </div>

        {/* Middle Section: Vertical Navigation Menu */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          
          {/* Research Lifecycle Layers */}
          <div className="space-y-1">
            <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Research Lifecycle Modules
            </div>

            {LIFECYCLE_NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item.id)}
                  className={`relative w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors text-left group ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-xs before:absolute before:left-0 before:top-2 before:bottom-2 before:w-1 before:rounded-r-full before:bg-crimson-400'
                      : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <Icon className={`w-4 h-4 shrink-0 transition-colors ${
                    isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-600'
                  }`} />
                  
                  <div className="flex-1 min-w-0">
                    <div className="truncate leading-tight">{item.label}</div>
                    <div className={`text-[10px] truncate font-normal mt-0.5 ${
                      isActive ? 'text-slate-300' : 'text-slate-400'
                    }`}>
                      {item.description}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Autonomous Crawling Agents Section */}
          <div className="space-y-1 pt-2 border-t border-slate-100">
            <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
              <span>Autonomous Agents</span>
              <span className="flex items-center gap-1 text-[9px] text-emerald-600 font-mono font-medium lowercase">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Active
              </span>
            </div>

            {/* Agent 1: Researcher LinkedIn & Scholar Crawler (Daily) */}
            <button
              onClick={() => handleItemClick('agent')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-bold transition-colors text-left group ${
                activeTab === 'agent'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
              aria-current={activeTab === 'agent' ? 'page' : undefined}
            >
              <div className={`p-1.5 rounded-md ${
                activeTab === 'agent' ? 'bg-white/15 text-white' : 'bg-slate-100 text-slate-600 group-hover:bg-slate-200'
              }`}>
                <Bot className="w-4 h-4 shrink-0" />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="truncate leading-tight flex items-center justify-between gap-1">
                  <span>Researcher Ingestion</span>
                  <span className="text-[9px] font-mono px-1 rounded bg-slate-200/60 text-slate-700 font-medium">Daily</span>
                </div>
                <div className={`text-[10px] truncate font-normal mt-0.5 ${
                  activeTab === 'agent' ? 'text-slate-300' : 'text-slate-500'
                }`}>
                  LinkedIn & Scholarly Graph
                </div>
              </div>
            </button>

            {/* Agent 2: Open Source Data & MCP Harvester (Weekly) */}
            <button
              onClick={() => handleItemClick('dataset-agent')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-bold transition-colors text-left group ${
                activeTab === 'dataset-agent'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
              aria-current={activeTab === 'dataset-agent' ? 'page' : undefined}
            >
              <div className={`p-1.5 rounded-md ${
                activeTab === 'dataset-agent' ? 'bg-crimson-600 text-white' : 'bg-slate-100 text-emerald-700 group-hover:bg-slate-200'
              }`}>
                <Database className="w-4 h-4 shrink-0" />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="truncate leading-tight flex items-center justify-between gap-1">
                  <span>Open Data & MCP Agent</span>
                  <span className="text-[9px] font-mono px-1 rounded bg-emerald-100/70 text-emerald-800 font-medium">Weekly</span>
                </div>
                <div className={`text-[10px] truncate font-normal mt-0.5 ${
                  activeTab === 'dataset-agent' ? 'text-slate-300' : 'text-slate-500'
                }`}>
                  Open Source Datasets & MCP
                </div>
              </div>
            </button>

            {/* Agent 3: Open Funding Scout & Verifier (Daily) */}
            <button
              onClick={() => handleItemClick('funding-agent')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-bold transition-colors text-left group ${
                activeTab === 'funding-agent'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
              aria-current={activeTab === 'funding-agent' ? 'page' : undefined}
            >
              <div className={`p-1.5 rounded-md ${
                activeTab === 'funding-agent' ? 'bg-amber-600 text-white' : 'bg-slate-100 text-amber-700 group-hover:bg-slate-200'
              }`}>
                <Coins className="w-4 h-4 shrink-0" />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="truncate leading-tight flex items-center justify-between gap-1">
                  <span>Funding Calls Scout</span>
                  <span className="text-[9px] font-mono px-1 rounded bg-amber-100/70 text-amber-800 font-medium">Daily</span>
                </div>
                <div className={`text-[10px] truncate font-normal mt-0.5 ${
                  activeTab === 'funding-agent' ? 'text-slate-300' : 'text-slate-500'
                }`}>
                  Scraped Calls & Origin Proof
                </div>
              </div>
            </button>
          </div>

          {/* Technical Blueprint Section */}
          <div className="space-y-1 pt-2 border-t border-slate-100">
            <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              System Architecture
            </div>

            <button
              onClick={() => handleItemClick('specification')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-bold transition-colors text-left group ${
                activeTab === 'specification'
                  ? 'bg-blue-50 text-blue-900 ring-1 ring-blue-300'
                  : 'text-blue-700 hover:bg-blue-50/70'
              }`}
              aria-current={activeTab === 'specification' ? 'page' : undefined}
            >
              <FileCode2 className={`w-4 h-4 shrink-0 ${
                activeTab === 'specification' ? 'text-blue-700' : 'text-blue-500'
              }`} />
              
              <div className="flex-1 min-w-0">
                <div className="truncate leading-tight">Technical Blueprint</div>
                <div className="text-[10px] text-blue-600/80 truncate font-normal mt-0.5">
                  14 System Specifications
                </div>
              </div>
            </button>
          </div>

        </div>

        {/* Bottom Section: Active Profile & RBAC Role Card */}
        <div className="p-3 border-t border-slate-200 bg-slate-50/80 space-y-3">
          
          {/* User Profile Mini Banner */}
          <div className="flex items-center gap-2.5 px-1">
            <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs font-mono shrink-0 ring-2 ring-crimson-200">
              JJ
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-bold text-slate-900 truncate">Dr. Joseph Juma</div>
              <div className="text-[10px] text-slate-500 truncate">Nairobi Agricultural Inst.</div>
            </div>
          </div>

          {/* Profile Completeness Indicator */}
          <div className="px-1 space-y-1">
            <div className="flex items-center justify-between text-[11px] text-slate-500">
              <span>Profile Completeness</span>
              <span className="font-mono font-bold text-slate-800">85%</span>
            </div>
            <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-brand-navy to-brand-crimson rounded-full" style={{ width: '85%' }} />
            </div>
          </div>

          {/* RBAC Role Selector Dropdown */}
          <div className="relative pt-1">
            <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1 px-1">
              Active Security Role
            </div>
            
            <button
              onClick={() => setRoleMenuOpen(!roleMenuOpen)}
              className="w-full flex items-center justify-between gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-md transition-colors"
              aria-expanded={roleMenuOpen}
              aria-label="Switch RBAC user role"
            >
              <div className="flex items-center gap-1.5 truncate">
                <ShieldCheck className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span className="truncate">{ROLE_LABELS[currentRole]}</span>
              </div>
              <ChevronDown className="w-3 h-3 text-slate-400 shrink-0" />
            </button>

            {roleMenuOpen && (
              <div 
                className="absolute bottom-full left-0 right-0 mb-1 bg-white border border-slate-200 rounded-lg shadow-lg py-1.5 z-50 text-xs"
                role="menu"
              >
                <div className="px-3 py-1.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                  Select RBAC Role
                </div>
                {(Object.keys(ROLE_LABELS) as UserRole[]).map((r) => (
                  <button
                    key={r}
                    onClick={() => {
                      onRoleChange(r);
                      setRoleMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 flex items-center justify-between hover:bg-slate-50 transition-colors ${
                      currentRole === r ? 'font-semibold text-slate-900 bg-slate-50' : 'text-slate-600'
                    }`}
                    role="menuitem"
                  >
                    <span className="truncate">{ROLE_LABELS[r]}</span>
                    {currentRole === r && <CheckCircle2 className="w-3.5 h-3.5 text-slate-900 shrink-0 ml-1" />}
                  </button>
                ))}
              </div>
            )}
          </div>

        </div>

      </aside>
    </>
  );
};
