/**
 * Research Saturday Nexus Platform — Master Application
 * Intelligent Research Collaboration & Architecture Blueprint Engine
 * Layout: Left Vertical Sidebar Panel + Responsive Main Content Viewport
 */

import React from 'react';
import { Sidebar } from './components/Sidebar.tsx';
import { Header } from './components/Header.tsx';
import type { NavTab, UserRole } from './components/TopBar.tsx';
import { QueryHero } from './components/QueryHero.tsx';
import { MatchResultsView } from './components/MatchResultsView.tsx';
import { CollaborationInviteModal } from './components/CollaborationInviteModal.tsx';
import { BuildWorkspaceView } from './components/BuildWorkspaceView.tsx';
import { PublishView } from './components/PublishView.tsx';
import { ConnectView } from './components/ConnectView.tsx';
import { ImpactView } from './components/ImpactView.tsx';
import { TechnicalBlueprintView } from './components/TechnicalBlueprintView.tsx';
import { AutomatedAgentView } from './components/AutomatedAgentView.tsx';
import { DatasetAgentView } from './components/DatasetAgentView.tsx';
import { FundingAgentView } from './components/FundingAgentView.tsx';
import { LandingLoginView } from './components/LandingLoginView.tsx';
import { BrandWordmark } from './components/BrandWordmark.tsx';
import { SettingsModal } from './components/SettingsModal.tsx';

import { 
  INITIAL_RESEARCHERS, 
  INITIAL_DATASETS, 
  INITIAL_FUNDING, 
  INITIAL_METHODOLOGIES, 
  INITIAL_PROJECT_WORKSPACE,
  type ProjectWorkspace 
} from './data/mockData.ts';

import { 
  executeIntelligentMatch, 
  type IntelligentMatchResponse, 
  type RankedResearcherMatch,
  type Researcher,
  type Dataset,
  type FundingOpportunity
} from './utils/matchingEngine.ts';

import { getStoredIngestedResearchers } from './services/researcherIngestionAgent.ts';
import { getStoredIngestedDatasets } from './services/datasetHarvestingAgent.ts';
import { getStoredIngestedFunding } from './services/fundingScoutAgent.ts';

import { CheckCircle2 } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = React.useState<NavTab>('discover');
  const [currentRole, setCurrentRole] = React.useState<UserRole>('RESEARCHER');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = React.useState(false);
  
  // Dynamic researchers state merging initial verified directory with ingested profiles
  const [researchers, setResearchers] = React.useState<Researcher[]>(() => {
    const stored = getStoredIngestedResearchers();
    if (stored.length === 0) return INITIAL_RESEARCHERS;
    const storedIds = new Set(stored.map(r => r.id));
    return [...INITIAL_RESEARCHERS.filter(r => !storedIds.has(r.id)), ...stored];
  });

  // Dynamic open datasets state merging initial catalog with weekly harvested open datasets
  const [datasets, setDatasets] = React.useState<Dataset[]>(() => {
    const stored = getStoredIngestedDatasets();
    if (stored.length === 0) return INITIAL_DATASETS;
    const storedIds = new Set(stored.map(d => d.id));
    return [...INITIAL_DATASETS.filter(d => !storedIds.has(d.id)), ...stored];
  });

  // Dynamic funding calls state merging initial catalog with daily scouted & verified funding calls
  const [funding, setFunding] = React.useState<FundingOpportunity[]>(() => {
    const stored = getStoredIngestedFunding();
    if (stored.length === 0) return INITIAL_FUNDING;
    const storedIds = new Set(stored.map(f => f.id));
    return [...INITIAL_FUNDING.filter(f => !storedIds.has(f.id)), ...stored];
  });

  // Natural language query state - initial empty string allows sample hint placeholder to display
  const [query, setQuery] = React.useState<string>('');
  
  // Intelligent Match Results
  const [matchResults, setMatchResults] = React.useState<IntelligentMatchResponse>(() => {
    const storedDs = getStoredIngestedDatasets();
    const activeDs = storedDs.length > 0 ? storedDs : INITIAL_DATASETS;
    const storedFund = getStoredIngestedFunding();
    const activeFund = storedFund.length > 0 ? storedFund : INITIAL_FUNDING;
    return executeIntelligentMatch(
      'I need a statistician who understands agricultural finance and can work with Kenyan datasets.',
      INITIAL_RESEARCHERS,
      activeDs,
      activeFund,
      INITIAL_METHODOLOGIES
    );
  });
  const [isSearching, setIsSearching] = React.useState(false);

  // Modal and Workspace State
  const [selectedMatchForInvite, setSelectedMatchForInvite] = React.useState<RankedResearcherMatch | null>(null);
  const [projectWorkspace, setProjectWorkspace] = React.useState<ProjectWorkspace>(INITIAL_PROJECT_WORKSPACE);
  const [toastMessage, setToastMessage] = React.useState<string | null>(null);

  // Authentication & Landing / Settings state
  const [isAuthenticated, setIsAuthenticated] = React.useState<boolean>(() => {
    const saved = localStorage.getItem('nexus_is_authenticated');
    return saved !== null ? saved === 'true' : true;
  });
  const [isViewingLandingPage, setIsViewingLandingPage] = React.useState<boolean>(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = React.useState<boolean>(false);
  const [settingsModalTab, setSettingsModalTab] = React.useState<'user' | 'admin'>('user');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleSignIn = (email?: string) => {
    setIsAuthenticated(true);
    setIsViewingLandingPage(false);
    localStorage.setItem('nexus_is_authenticated', 'true');
    showToast(`Signed in as ${email || 'Dr. Joseph Juma'}. Session active.`);
  };

  const handleExploreAsGuest = () => {
    setIsViewingLandingPage(false);
    showToast('Exploring Nexus Platform in Guest Researcher mode.');
  };

  const handleToggleAuth = () => {
    if (isAuthenticated) {
      setIsAuthenticated(false);
      localStorage.setItem('nexus_is_authenticated', 'false');
      setIsViewingLandingPage(true);
      showToast('Logged out of system. Session ended.');
    } else {
      setIsViewingLandingPage(true);
    }
  };

  const handleOpenUserSettings = () => {
    setSettingsModalTab('user');
    setIsSettingsModalOpen(true);
  };

  const handleOpenSystemAdmin = () => {
    setSettingsModalTab('admin');
    setIsSettingsModalOpen(true);
  };

  const handleOpenLandingLogin = () => {
    setIsViewingLandingPage(true);
  };

  // Run matching engine with current dynamic researchers, datasets, & funding pool
  const handleExecuteSearch = (newQuery: string) => {
    setIsSearching(true);
    setTimeout(() => {
      const results = executeIntelligentMatch(
        newQuery,
        researchers,
        datasets,
        funding,
        INITIAL_METHODOLOGIES
      );
      setMatchResults(results);
      setIsSearching(false);
      setActiveTab('discover');
    }, 350);
  };

  // Handle researcher crawler updates
  const handleResearchersUpdated = (updatedList: Researcher[]) => {
    setResearchers(updatedList);
    const currentQ = query.trim() || 'I need a statistician who understands agricultural finance and can work with Kenyan datasets.';
    const results = executeIntelligentMatch(
      currentQ,
      updatedList,
      datasets,
      funding,
      INITIAL_METHODOLOGIES
    );
    setMatchResults(results);
  };

  // Handle weekly dataset harvester updates
  const handleDatasetsUpdated = (updatedDatasets: Dataset[]) => {
    setDatasets(updatedDatasets);
    const currentQ = query.trim() || 'I need a statistician who understands agricultural finance and can work with Kenyan datasets.';
    const results = executeIntelligentMatch(
      currentQ,
      researchers,
      updatedDatasets,
      funding,
      INITIAL_METHODOLOGIES
    );
    setMatchResults(results);
    showToast(`Platform open datasets catalog updated. Total: ${1150 + updatedDatasets.length} available.`);
  };

  // Handle daily funding scout updates
  const handleFundingUpdated = (updatedFunding: FundingOpportunity[]) => {
    setFunding(updatedFunding);
    const currentQ = query.trim() || 'I need a statistician who understands agricultural finance and can work with Kenyan datasets.';
    const results = executeIntelligentMatch(
      currentQ,
      researchers,
      datasets,
      updatedFunding,
      INITIAL_METHODOLOGIES
    );
    setMatchResults(results);
    showToast(`Verified open funding calls updated. Total: ${updatedFunding.length} calls available.`);
  };

  // Handle selecting a funding opportunity to target in the active workspace
  const handleSelectFundingForWorkspace = (selectedCall: FundingOpportunity) => {
    showToast(`Targeted "${selectedCall.title}" (${selectedCall.amount}) for active Project Workspace.`);
    setActiveTab('build');
  };

  // Handle importing a harvested open dataset into the active Project Workspace
  const handleImportDatasetToWorkspace = (dataset: Dataset) => {
    setProjectWorkspace(prev => {
      if (prev.datasets.includes(dataset.title)) {
        showToast(`Dataset "${dataset.title}" already added to active Project Workspace.`);
        return prev;
      }
      return {
        ...prev,
        datasets: [...prev.datasets, dataset.title]
      };
    });
    showToast(`Imported "${dataset.title}" into Project Workspace.`);
  };

  // Handle inviting a researcher directly from the Automated Agent view
  const handleInviteFromAgent = (researcher: Researcher) => {
    const match: RankedResearcherMatch = {
      researcher,
      matchScore: 94,
      confidenceTier: 'Exceptional',
      matchReason: `Discovered and verified via Automated Ingestion Agent. Expertise in ${researcher.expertise.slice(0, 2).join(' & ')} matches target collaborative domains.`,
      scoreBreakdown: {
        skillsScore: 94,
        domainScore: 92,
        geoScore: 96,
        availabilityScore: 90,
        totalScore: 94
      },
      sharedInterests: researcher.expertise.slice(0, 3)
    };
    setSelectedMatchForInvite(match);
  };

  // Handle invitation submission
  const handleSendInvite = (invite: {
    researcherId: string;
    researcherName: string;
    projectTitle: string;
    role: string;
    message: string;
    hoursPerWeek: number;
  }) => {
    // Add member to workspace if not already present
    setProjectWorkspace(prev => {
      const exists = prev.members.some(m => m.id === invite.researcherId);
      if (exists) return prev;
      return {
        ...prev,
        members: [
          ...prev.members,
          {
            id: invite.researcherId,
            name: invite.researcherName,
            role: invite.role,
            institution: 'University of Nairobi',
            country: 'Kenya',
            avatarInitials: invite.researcherName.split(' ').map(n => n[0]).join('').slice(0, 2)
          }
        ]
      };
    });

    showToast(`Collaboration invitation dispatched to ${invite.researcherName} as ${invite.role}.`);
  };

  // Toggle milestone completed state
  const handleToggleMilestone = (milestoneId: string) => {
    setProjectWorkspace(prev => ({
      ...prev,
      milestones: prev.milestones.map(m => {
        if (m.id !== milestoneId) return m;
        return {
          ...m,
          status: m.status === 'Completed' ? 'In Progress' : 'Completed'
        };
      })
    }));
    showToast('Project milestone updated.');
  };

  // If user navigated to Landing / Login Page
  if (isViewingLandingPage) {
    return (
      <div className="relative">
        {toastMessage && (
          <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-lg border border-slate-700 flex items-center gap-2.5 text-xs animate-in fade-in slide-in-from-bottom-2 duration-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}
        <LandingLoginView
          onSignIn={handleSignIn}
          onExploreAsGuest={handleExploreAsGuest}
          onClose={() => setIsViewingLandingPage(false)}
          isModal={false}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex antialiased">
      
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-lg border border-slate-700 flex items-center gap-2.5 text-xs animate-in fade-in slide-in-from-bottom-2 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Left Vertical Menu Side Panel */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        currentRole={currentRole}
        onRoleChange={(r) => {
          setCurrentRole(r);
          showToast(`Active role switched to ${r}. Access permissions updated.`);
        }}
        onNewProjectClick={() => {
          setActiveTab('build');
          showToast('Navigated to Project Workspace.');
        }}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Content Viewport offset by Left Sidebar */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64 sm:lg:pl-72">
        
        {/* Top Header with Breadcrumbs & Mobile Trigger */}
        <Header
          activeTab={activeTab}
          onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
          onNewProjectClick={() => {
            setActiveTab('build');
            showToast('Navigated to Project Workspace.');
          }}
          currentRole={currentRole}
          onNavigateTab={setActiveTab}
          isAuthenticated={isAuthenticated}
          onOpenUserSettings={handleOpenUserSettings}
          onOpenSystemAdmin={handleOpenSystemAdmin}
          onOpenLandingLogin={handleOpenLandingLogin}
          onToggleAuth={handleToggleAuth}
        />

        {/* Viewport Content */}
        <main className="flex-1">
          {activeTab === 'discover' && (
            <div className="w-full">
              {/* "What do you need right now?" Query Hero */}
              <QueryHero
                currentQuery={query}
                onQueryChange={setQuery}
                onExecuteSearch={handleExecuteSearch}
                isSearching={isSearching}
                completenessScore={85}
                totalResearchersCount={4280 + researchers.filter(r => r.source !== undefined).length}
                totalDatasetsCount={1150 + datasets.filter(d => d.sourceType !== undefined).length}
                totalFundingCount={funding.length}
                onOpenAgent={() => setActiveTab('agent')}
                onOpenDatasetAgent={() => setActiveTab('dataset-agent')}
                onOpenFundingAgent={() => setActiveTab('funding-agent')}
              />

              {/* Results Grid Container - Full Width Fluid */}
              <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-10 py-8">
                <MatchResultsView
                  results={matchResults}
                  onInviteClick={(match) => setSelectedMatchForInvite(match)}
                  onCreateProjectFromMatch={() => {
                    setActiveTab('build');
                    showToast('Need statement converted to active Project Workspace.');
                  }}
                />
              </div>
            </div>
          )}

          {/* Autonomous Agent 1: Researcher LinkedIn & Scholarly Ingestion */}
          {activeTab === 'agent' && (
            <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-10 py-8">
              <AutomatedAgentView
                researchers={researchers}
                onResearchersUpdated={handleResearchersUpdated}
                onInviteResearcher={handleInviteFromAgent}
                onShowToast={showToast}
              />
            </div>
          )}

          {/* Autonomous Agent 2: Open Source Datasets & MCP Harvester */}
          {activeTab === 'dataset-agent' && (
            <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-10 py-8">
              <DatasetAgentView
                datasets={datasets}
                onDatasetsUpdated={handleDatasetsUpdated}
                onImportToWorkspace={handleImportDatasetToWorkspace}
                onShowToast={showToast}
              />
            </div>
          )}

          {/* Autonomous Agent 3: Open Funding Calls Scout & Origin Verifier */}
          {activeTab === 'funding-agent' && (
            <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-10 py-8">
              <FundingAgentView
                funding={funding}
                onFundingUpdated={handleFundingUpdated}
                onSelectFundingForWorkspace={handleSelectFundingForWorkspace}
                onShowToast={showToast}
              />
            </div>
          )}

          {activeTab === 'build' && (
            <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-10 py-8">
              <BuildWorkspaceView
                project={projectWorkspace}
                onToggleMilestone={handleToggleMilestone}
                onInviteMoreClick={() => {
                  setActiveTab('discover');
                  showToast('Use "What do you need right now?" to discover matching specialists.');
                }}
              />
            </div>
          )}

          {activeTab === 'publish' && (
            <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-10 py-8">
              <PublishView />
            </div>
          )}

          {activeTab === 'connect' && (
            <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-10 py-8">
              <ConnectView />
            </div>
          )}

          {activeTab === 'impact' && (
            <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-10 py-8">
              <ImpactView />
            </div>
          )}

          {activeTab === 'specification' && (
            <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-10 py-8">
              <TechnicalBlueprintView />
            </div>
          )}
        </main>

        {/* Quiet Footer - Full Width Fluid */}
        <footer className="bg-white mt-auto pb-6">
          <div className="brand-rule mb-6" aria-hidden="true"><span className="rounded-none!" /><span className="rounded-none!" /><span className="rounded-none!" /></div>
          <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <div className="flex items-center gap-3">
              <BrandWordmark size="sm" showTagline={false} />
              <span aria-hidden="true" className="h-4 w-px bg-slate-300" />
              <span className="font-semibold text-slate-700">Research Saturday Kenya</span>
              <span aria-hidden="true">·</span>
              <span className="italic">Research. Reimagined.</span>
            </div>

            <div className="flex items-center gap-4">
              <button 
                onClick={() => setActiveTab('specification')}
                className="hover:text-slate-900 transition-colors"
              >
                System Specification
              </button>
              <span aria-hidden="true">·</span>
              <span>WCAG 2.1 AA Compliant</span>
              <span aria-hidden="true">·</span>
              <span>PostgreSQL 16 + pgvector</span>
            </div>
          </div>
        </footer>

      </div>

      {/* Collaboration Invite Modal */}
      <CollaborationInviteModal
        match={selectedMatchForInvite}
        isOpen={!!selectedMatchForInvite}
        onClose={() => setSelectedMatchForInvite(null)}
        onSendInvite={handleSendInvite}
      />

      {/* User Settings & System Administration Modal */}
      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        defaultTab={settingsModalTab}
        currentRole={currentRole}
        onRoleChange={setCurrentRole}
        onShowToast={showToast}
      />

    </div>
  );
}
