import React from 'react';
import type { RankedResearcherMatch } from '../utils/matchingEngine.ts';
import { Send, X, ShieldCheck, Clock, CheckCircle } from 'lucide-react';

interface CollaborationInviteModalProps {
  match: RankedResearcherMatch | null;
  isOpen: boolean;
  onClose: () => void;
  onSendInvite: (inviteDetails: {
    researcherId: string;
    researcherName: string;
    projectTitle: string;
    role: string;
    message: string;
    hoursPerWeek: number;
  }) => void;
}

export const CollaborationInviteModal: React.FC<CollaborationInviteModalProps> = ({
  match,
  isOpen,
  onClose,
  onSendInvite
}) => {
  const [role, setRole] = React.useState('Lead Econometrician & Biostatistician');
  const [projectTitle, setProjectTitle] = React.useState('Agricultural Microfinance & Crop Yields in Western Kenya');
  const [hoursPerWeek, setHoursPerWeek] = React.useState(8);
  const [message, setMessage] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [successSent, setSuccessSent] = React.useState(false);

  React.useEffect(() => {
    if (match) {
      setMessage(
        `Dear ${match.researcher.name},\n\nI came across your profile on the Research Saturday Nexus platform while looking for expertise in ${match.sharedInterests.slice(0, 2).join(' and ')}.\n\nWe are currently executing an empirical research project on smallholder finance resilience in Western Kenya using the KNBS microdata. We would be thrilled to invite you as our ${role} to lead the staggered difference-in-differences econometric estimations.\n\nLooking forward to collaborating,\nDr. Joseph Juma`
      );
    }
  }, [match, role]);

  if (!isOpen || !match) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      onSendInvite({
        researcherId: match.researcher.id,
        researcherName: match.researcher.name,
        projectTitle,
        role,
        message,
        hoursPerWeek
      });
      setIsSubmitting(false);
      setSuccessSent(true);
      setTimeout(() => {
        setSuccessSent(false);
        onClose();
      }, 1500);
    }, 600);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="invite-modal-title"
    >
      <div className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-lg w-full overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div>
            <h2 id="invite-modal-title" className="text-base font-bold text-slate-900">
              Send Collaboration Invitation
            </h2>
            <p className="text-xs text-slate-500">
              Nexus Secure Invitation Protocol (Least-Privilege Role Access)
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200 transition-colors"
            aria-label="Close invitation modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {successSent ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Invitation Dispatched!</h3>
            <p className="text-xs text-slate-600 max-w-sm mx-auto">
              {match.researcher.name} has been notified via secure Nexus alert and email. A placeholder seat has been reserved in your project workspace.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            
            {/* Recipient summary banner */}
            <div className="bg-blue-50/60 border border-blue-200/60 rounded-lg p-3 flex items-start justify-between gap-3 text-xs">
              <div>
                <div className="font-bold text-slate-900">{match.researcher.name}</div>
                <div className="text-slate-600">{match.researcher.title} · {match.researcher.institution}</div>
                <div className="text-slate-500 mt-1">Match Confidence: <span className="font-bold text-blue-800">{match.matchScore}% ({match.confidenceTier})</span></div>
              </div>
              <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded shrink-0">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Verified</span>
              </div>
            </div>

            {/* Target Project */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Project Workspace
              </label>
              <input
                type="text"
                value={projectTitle}
                onChange={(e) => setProjectTitle(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900"
                required
              />
            </div>

            {/* Role Selection & Expected Hours */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Proposed Project Role
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900 bg-white"
                >
                  <option value="Lead Econometrician & Biostatistician">Lead Econometrician & Biostatistician</option>
                  <option value="Co-Principal Investigator">Co-Principal Investigator</option>
                  <option value="Data Pipeline Specialist">Data Pipeline Specialist</option>
                  <option value="Scientific Advisor / Mentor">Scientific Advisor / Mentor</option>
                  <option value="Field Data Lead">Field Data Lead</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Expected Commitment
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="2"
                    max="30"
                    value={hoursPerWeek}
                    onChange={(e) => setHoursPerWeek(Number(e.target.value))}
                    className="w-20 px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900 font-mono"
                    required
                  />
                  <span className="text-xs text-slate-500">hours / week</span>
                </div>
              </div>
            </div>

            {/* Personalized Message */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Personalized Research Brief & Pitch
              </label>
              <textarea
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900 font-sans leading-relaxed"
                required
              />
            </div>

            {/* Footer Actions */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-50 rounded-lg transition-colors shadow-sm"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSubmitting ? 'Sending...' : 'Send Invitation'}</span>
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
