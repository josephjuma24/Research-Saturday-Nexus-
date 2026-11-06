import React, { useState } from 'react';
import { 
  X, 
  User, 
  Shield, 
  Check, 
  Bell, 
  Bot, 
  Database, 
  Coins, 
  RefreshCw, 
  Sliders, 
  Server, 
  Key, 
  CheckCircle2, 
  AlertCircle,
  Save
} from 'lucide-react';
import type { UserRole } from './TopBar.tsx';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'user' | 'admin';
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  onShowToast: (msg: string) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  defaultTab = 'user',
  currentRole,
  onRoleChange,
  onShowToast
}) => {
  const [activeTab, setActiveTab] = useState<'user' | 'admin'>(defaultTab);

  // User Settings State
  const [userName, setUserName] = useState('Dr. Joseph Juma');
  const [userTitle, setUserTitle] = useState('Principal Investigator & Econometrician');
  const [institution, setInstitution] = useState('University of Nairobi · School of Economics');
  const [orcid, setOrcid] = useState('0000-0002-1825-0097');
  const [contactEmail, setContactEmail] = useState('josephjuma24@gmail.com');
  const [notifyOnMatch, setNotifyOnMatch] = useState(true);
  const [notifyOnFunding, setNotifyOnFunding] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(true);
  const [openForInvites, setOpenForInvites] = useState(true);

  // System Administration State
  const [isSyncingAgents, setIsSyncingAgents] = useState(false);
  const [agentFrequency, setAgentFrequency] = useState('daily');
  const [crawlerRateLimit, setCrawlerRateLimit] = useState('10 profiles/min');

  if (!isOpen) return null;

  const handleSaveUserSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onShowToast('User profile and notification settings updated.');
    onClose();
  };

  const handleTriggerAdminSync = () => {
    setIsSyncingAgents(true);
    setTimeout(() => {
      setIsSyncingAgents(false);
      onShowToast('System Administration: Triggered multi-agent telemetry and synchronization cycle.');
    }, 1000);
  };

  const handlePurgeCache = () => {
    if (window.confirm('Reset local ingestion cache and reload default mock telemetry?')) {
      localStorage.removeItem('rs_ingested_researchers');
      localStorage.removeItem('rs_ingested_datasets');
      localStorage.removeItem('rs_ingested_funding');
      onShowToast('Platform agent cache purged.');
      setTimeout(() => window.location.reload(), 400);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900">Nexus Platform Configuration</h3>
              <p className="text-[11px] text-slate-500">Manage your user profile and platform system controls</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-lg transition-colors"
            aria-label="Close settings"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-200 bg-white px-6">
          <button
            onClick={() => setActiveTab('user')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === 'user'
                ? 'border-slate-900 text-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>User Settings</span>
          </button>

          <button
            onClick={() => setActiveTab('admin')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === 'admin'
                ? 'border-slate-900 text-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Shield className="w-3.5 h-3.5 text-emerald-600" />
            <span>Systems Administration</span>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded-full">
              Admin
            </span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          
          {/* USER SETTINGS TAB */}
          {activeTab === 'user' && (
            <form onSubmit={handleSaveUserSettings} className="space-y-5">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Full Name & Academic Title
                  </label>
                  <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Primary Academic Email
                  </label>
                  <input
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Academic Affiliation & Department
                  </label>
                  <input
                    type="text"
                    value={institution}
                    onChange={(e) => setInstitution(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    ORCID Digital Identifier
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={orcid}
                      onChange={(e) => setOrcid(e.target.value)}
                      className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-slate-900"
                    />
                    <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-1.5 rounded-md border border-brand-crimson flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Verified
                    </span>
                  </div>
                </div>
              </div>

              {/* Notification & Matching Preferences */}
              <div className="border-t border-slate-100 pt-4 space-y-3">
                <h4 className="font-semibold text-slate-900 text-xs flex items-center gap-2">
                  <Bell className="w-3.5 h-3.5 text-slate-500" />
                  <span>Collaboration & Alert Preferences</span>
                </h4>

                <div className="space-y-2.5">
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={openForInvites}
                      onChange={(e) => setOpenForInvites(e.target.checked)}
                      className="w-4 h-4 rounded text-slate-900 border-slate-300"
                    />
                    <div>
                      <span className="font-medium text-slate-800">Available for cross-institutional research invitations</span>
                      <p className="text-[11px] text-slate-500">Allow other verified investigators to invite you to project workspaces.</p>
                    </div>
                  </label>

                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifyOnMatch}
                      onChange={(e) => setNotifyOnMatch(e.target.checked)}
                      className="w-4 h-4 rounded text-slate-900 border-slate-300"
                    />
                    <div>
                      <span className="font-medium text-slate-800">Real-time match alerts for new datasets</span>
                      <p className="text-[11px] text-slate-500">Notify when the MCP crawler indexes a microdata file in your domain.</p>
                    </div>
                  </label>

                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifyOnFunding}
                      onChange={(e) => setNotifyOnFunding(e.target.checked)}
                      className="w-4 h-4 rounded text-slate-900 border-slate-300"
                    />
                    <div>
                      <span className="font-medium text-slate-800">Scouted funding calls with &gt;75% relevance match</span>
                      <p className="text-[11px] text-slate-500">Receive verified grant opportunities that match your active inquiries.</p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Footer Save */}
              <div className="border-t border-slate-100 pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-3.5 py-1.5 text-slate-600 hover:text-slate-900 font-medium rounded-lg hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save User Settings</span>
                </button>
              </div>

            </form>
          )}

          {/* SYSTEMS ADMINISTRATION TAB */}
          {activeTab === 'admin' && (
            <div className="space-y-6">
              
              {/* Active RBAC Role Governance */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-bold text-slate-900">Role-Based Access Control (RBAC)</h4>
                    <p className="text-[11px] text-slate-500">Active role privileges and least-privilege matrix</p>
                  </div>
                  <span className="text-[11px] font-mono bg-slate-200 text-slate-800 px-2 py-0.5 rounded">
                    {currentRole}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {(['RESEARCHER', 'INSTITUTIONAL_ADMIN', 'SYSTEM_MODERATOR'] as UserRole[]).map((r) => (
                    <button
                      key={r}
                      onClick={() => {
                        onRoleChange(r);
                        onShowToast(`Switched active administrative role to ${r}.`);
                      }}
                      className={`p-2 rounded-lg border text-left transition-all ${
                        currentRole === r
                          ? 'border-emerald-600 bg-emerald-50/70 text-emerald-950 font-semibold'
                          : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      <div className="text-[11px] uppercase tracking-wide font-bold">
                        {r.replace('_', ' ')}
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5">
                        {r === 'RESEARCHER' ? 'Standard Discovery & Workspace' : r === 'INSTITUTIONAL_ADMIN' ? 'Full Institution Governance' : 'All-access Supervisor'}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Autonomous Agents Telemetry & Health */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900 flex items-center gap-2">
                    <Bot className="w-4 h-4 text-blue-600" />
                    <span>Autonomous Agents Engine Status</span>
                  </h4>
                  <button
                    onClick={handleTriggerAdminSync}
                    disabled={isSyncingAgents}
                    className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 px-2.5 py-1 rounded-md transition-colors shadow-2xs"
                  >
                    <RefreshCw className={`w-3 h-3 ${isSyncingAgents ? 'animate-spin text-blue-600' : ''}`} />
                    <span>Sync All Agents Now</span>
                  </button>
                </div>

                <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden bg-white">
                  
                  {/* Agent 1 */}
                  <div className="p-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
                        <Bot className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <div className="font-semibold text-slate-800">LinkedIn Researcher Ingestion Agent</div>
                        <div className="text-[10px] text-slate-500">Cadence: Daily · Automated profile extraction & semantic ranking</div>
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-brand-crimson">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-crimson animate-pulse" />
                      Operational
                    </span>
                  </div>

                  {/* Agent 2 */}
                  <div className="p-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                        <Database className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <div className="font-semibold text-slate-800">Open Microdata & MCP Harvester</div>
                        <div className="text-[10px] text-slate-500">Cadence: Weekly · Ethical Open Access & CC-BY Ingestion</div>
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-brand-crimson">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-crimson animate-pulse" />
                      Operational
                    </span>
                  </div>

                  {/* Agent 3 */}
                  <div className="p-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
                        <Coins className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <div className="font-semibold text-slate-800">Funding Calls Scout & Verifier</div>
                        <div className="text-[10px] text-slate-500">Cadence: Daily · Web link crawler with cryptographic origin check</div>
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-brand-crimson">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-crimson animate-pulse" />
                      Operational
                    </span>
                  </div>

                </div>
              </div>

              {/* Infrastructure Telemetry */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <h4 className="font-bold text-slate-900 flex items-center gap-2">
                  <Server className="w-4 h-4 text-slate-600" />
                  <span>Infrastructure & Storage Specifications</span>
                </h4>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                  <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                    <div className="text-[10px] text-slate-500">Database Engine</div>
                    <div className="font-mono font-bold text-slate-900 text-xs mt-0.5">PostgreSQL 16</div>
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                    <div className="text-[10px] text-slate-500">Vector Index</div>
                    <div className="font-mono font-bold text-slate-900 text-xs mt-0.5">pgvector HNSW</div>
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                    <div className="text-[10px] text-slate-500">Embedding Dim</div>
                    <div className="font-mono font-bold text-slate-900 text-xs mt-0.5">768 Float32</div>
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                    <div className="text-[10px] text-slate-500">Uptime SLA</div>
                    <div className="font-mono font-bold text-emerald-700 text-xs mt-0.5">99.98%</div>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-slate-200">
                  <span className="text-[11px] text-slate-500">Local Cache & Agent Storage</span>
                  <button
                    type="button"
                    onClick={handlePurgeCache}
                    className="text-[11px] font-semibold text-rose-600 hover:text-rose-700 hover:underline"
                  >
                    Purge Ingestion Cache
                  </button>
                </div>
              </div>

              {/* Close Button */}
              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg transition-colors text-xs"
                >
                  Done
                </button>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
