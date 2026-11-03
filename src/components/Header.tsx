import React, { useState, useRef, useEffect } from 'react';
import { 
  Menu, 
  Plus, 
  Compass, 
  Layers, 
  BookOpen, 
  Users, 
  TrendingUp, 
  FileCode2, 
  Bot, 
  Database, 
  Coins, 
  Settings, 
  User, 
  Shield, 
  LogOut, 
  LogIn, 
  Sparkles,
  ExternalLink,
  ChevronDown
} from 'lucide-react';
import type { NavTab, UserRole } from './TopBar.tsx';

interface HeaderProps {
  activeTab: NavTab;
  onOpenMobileSidebar: () => void;
  onNewProjectClick: () => void;
  currentRole: UserRole;
  onNavigateTab?: (tab: NavTab) => void;
  isAuthenticated: boolean;
  onOpenUserSettings: () => void;
  onOpenSystemAdmin: () => void;
  onOpenLandingLogin: () => void;
  onToggleAuth: () => void;
}

const TAB_METADATA: Record<NavTab, { label: string; icon: React.ComponentType<{ className?: string }> }> = {
  discover: { label: 'Discover', icon: Compass },
  build: { label: 'Build', icon: Layers },
  publish: { label: 'Publish', icon: BookOpen },
  connect: { label: 'Connect', icon: Users },
  impact: { label: 'Impact', icon: TrendingUp },
  agent: { label: 'Automated Agent & Ingestion', icon: Bot },
  'dataset-agent': { label: 'Open Data & MCP Harvester', icon: Database },
  'funding-agent': { label: 'Funding Calls Scout & Verifier', icon: Coins },
  specification: { label: 'Technical Blueprint', icon: FileCode2 },
};

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onOpenMobileSidebar,
  onNewProjectClick,
  currentRole,
  onNavigateTab,
  isAuthenticated,
  onOpenUserSettings,
  onOpenSystemAdmin,
  onOpenLandingLogin,
  onToggleAuth
}) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentTabInfo = TAB_METADATA[activeTab] || TAB_METADATA.discover;
  const Icon = currentTabInfo.icon;

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsSettingsOpen(false);
      }
    };
    if (isSettingsOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSettingsOpen]);

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-xs border-b border-slate-200 w-full">
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-10">
        <div className="flex items-center justify-between h-14 gap-4">
          
          {/* Left: Hamburger Button (mobile/tablet) + Contextual Breadcrumbs */}
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenMobileSidebar}
              className="lg:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg focus:outline-none"
              aria-label="Open navigation sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Breadcrumb Trail */}
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="font-semibold text-slate-900 hidden sm:inline">Nexus</span>
              <span className="text-slate-300 hidden sm:inline">/</span>
              <div className="flex items-center gap-1.5 font-bold text-slate-900">
                <Icon className="w-3.5 h-3.5 text-slate-500" />
                <span>{currentTabInfo.label}</span>
              </div>
            </div>
          </div>

          {/* Right: Quick Actions + Settings Button */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {onNavigateTab && (
              <button
                onClick={() => onNavigateTab('agent')}
                className="hidden md:flex items-center gap-1.5 text-[11px] font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded-md border border-blue-200/80 transition-colors"
                title="View Automated Ingestion Agent"
              >
                <Bot className="w-3.5 h-3.5" />
                <span>Daily Crawler: Active</span>
              </button>
            )}

            {/* New Project Button */}
            <button
              onClick={onNewProjectClick}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors shadow-xs whitespace-nowrap"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Project</span>
            </button>

            {/* Very Small Settings Button next to New Project at the top right */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                className={`p-1.5 rounded-lg border transition-all flex items-center justify-center focus:outline-none ${
                  isSettingsOpen 
                    ? 'bg-slate-100 text-slate-900 border-slate-300 ring-2 ring-slate-400/20' 
                    : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 border-slate-200'
                }`}
                title="Settings & System Administration"
                aria-label="Settings and System Administration"
                aria-expanded={isSettingsOpen}
              >
                <Settings className="w-3.5 h-3.5" />
              </button>

              {/* Settings Dropdown Menu */}
              {isSettingsOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-xl shadow-xl py-1.5 z-50 text-xs animate-in fade-in slide-in-from-top-1 duration-150">
                  
                  {/* User Profile Summary */}
                  <div className="px-3.5 py-2.5 border-b border-slate-100 bg-slate-50/70">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 text-xs truncate">
                        Dr. Joseph Juma
                      </span>
                      <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${
                        isAuthenticated 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {isAuthenticated ? 'Signed In' : 'Guest'}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 truncate mt-0.5">
                      josephjuma24@gmail.com
                    </div>
                    <div className="text-[10px] text-slate-400 font-medium truncate">
                      Role: {currentRole}
                    </div>
                  </div>

                  {/* Core Settings Options */}
                  <div className="py-1">
                    <button
                      onClick={() => {
                        setIsSettingsOpen(false);
                        onOpenUserSettings();
                      }}
                      className="w-full text-left px-3.5 py-2 flex items-center gap-2.5 text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                    >
                      <User className="w-3.5 h-3.5 text-slate-500" />
                      <div>
                        <div className="font-medium text-xs">User Settings</div>
                        <div className="text-[10px] text-slate-400">Profile, affiliation & notifications</div>
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        setIsSettingsOpen(false);
                        onOpenSystemAdmin();
                      }}
                      className="w-full text-left px-3.5 py-2 flex items-center gap-2.5 text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                    >
                      <Shield className="w-3.5 h-3.5 text-emerald-600" />
                      <div>
                        <div className="font-medium text-xs flex items-center gap-1.5">
                          <span>Systems Administration</span>
                          <span className="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-1 rounded">Admin</span>
                        </div>
                        <div className="text-[10px] text-slate-400">Agents telemetry, RBAC & database</div>
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        setIsSettingsOpen(false);
                        onOpenLandingLogin();
                      }}
                      className="w-full text-left px-3.5 py-2 flex items-center gap-2.5 text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                      <div>
                        <div className="font-medium text-xs">Landing / Login Page</div>
                        <div className="text-[10px] text-slate-400">View split-card landing screen</div>
                      </div>
                    </button>
                  </div>

                  {/* Divider */}
                  <div className="my-1 border-t border-slate-100" />

                  {/* Auth Actions: Sign In / Log Out */}
                  <div className="py-1">
                    {isAuthenticated ? (
                      <button
                        onClick={() => {
                          setIsSettingsOpen(false);
                          onToggleAuth();
                        }}
                        className="w-full text-left px-3.5 py-2 flex items-center gap-2.5 text-rose-600 hover:bg-rose-50 transition-colors font-medium text-xs"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Log Out of System</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setIsSettingsOpen(false);
                          onOpenLandingLogin();
                        }}
                        className="w-full text-left px-3.5 py-2 flex items-center gap-2.5 text-teal-700 hover:bg-teal-50 transition-colors font-medium text-xs"
                      >
                        <LogIn className="w-3.5 h-3.5" />
                        <span>Sign In to System</span>
                      </button>
                    )}
                  </div>

                </div>
              )}
            </div>

          </div>

        </div>
      </div>
    </header>
  );
};
