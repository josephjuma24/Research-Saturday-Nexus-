import React, { useState } from 'react';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  Bot, 
  Database, 
  Coins, 
  ArrowRight, 
  Sparkles,
  CheckCircle2,
  X
} from 'lucide-react';

interface LandingLoginViewProps {
  onSignIn: (email?: string) => void;
  onExploreAsGuest: () => void;
  onClose?: () => void;
  isModal?: boolean;
}

export const LandingLoginView: React.FC<LandingLoginViewProps> = ({
  onSignIn,
  onExploreAsGuest,
  onClose,
  isModal = false
}) => {
  const [email, setEmail] = useState('josephjuma24@gmail.com');
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [keepSignedIn, setKeepSignedIn] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [ssoMessage, setSsoMessage] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onSignIn(email);
    }, 600);
  };

  const handleSSO = (provider: 'Google' | 'Microsoft') => {
    setSsoMessage(`Authenticating with ${provider} Institutional Identity Provider...`);
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setSsoMessage(null);
      onSignIn(`${provider.toLowerCase()}.user@nexus.ac.ke`);
    }, 800);
  };

  const content = (
    <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl shadow-slate-900/15 overflow-hidden grid grid-cols-1 md:grid-cols-2 border border-slate-200/80 relative">
      
      {/* Optional Close Button if onClose is provided */}
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 px-2.5 py-1.5 text-slate-500 hover:text-slate-900 bg-white/90 hover:bg-slate-100 rounded-full border border-slate-200 transition-colors flex items-center gap-1.5 text-[11px] font-medium shadow-2xs"
          aria-label="Return to Nexus Platform"
          title="Return to Nexus Platform"
        >
          <span className="hidden sm:inline">Return to Workspace</span>
          <X className="w-3.5 h-3.5" />
        </button>
      )}

      {/* LEFT PANEL: Dark Teal/Spruce Gradient with Value Highlights matching reference */}
      <div className="bg-[#0b2422] text-white p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden">
        {/* Ambient subtle glow overlay */}
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top: Brand Header */}
        <div className="relative z-10">
          <div className="flex items-center gap-2.5 mb-8">
            <div className="w-8 h-8 rounded-lg bg-emerald-400/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <span className="font-bold text-sm tracking-wide text-white">
              Nexus Research AI
            </span>
          </div>

          {/* Bold Display Headline */}
          <div className="space-y-1 mb-8">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
              Autonomous
            </h1>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-emerald-400 leading-tight">
              Research Intelligence
            </h2>
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
              Platform
            </h3>
          </div>

          {/* 3 Key Feature Bullets with Teal Circular Badges */}
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center shrink-0 mt-0.5 border border-emerald-500/30">
                <Bot className="w-3.5 h-3.5" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-white tracking-wide">
                  Automated Researcher Ingestion
                </h4>
                <p className="text-[11px] text-slate-300/80 leading-relaxed mt-0.5">
                  Daily agent harvesting LinkedIn profiles, subject matter experts, and research credentials.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center shrink-0 mt-0.5 border border-emerald-500/30">
                <Database className="w-3.5 h-3.5" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-white tracking-wide">
                  Open Microdata & MCP Harvester
                </h4>
                <p className="text-[11px] text-slate-300/80 leading-relaxed mt-0.5">
                  Weekly crawler ingesting verified open-source datasets, surveys, and African repositories.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center shrink-0 mt-0.5 border border-emerald-500/30">
                <Coins className="w-3.5 h-3.5" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-white tracking-wide">
                  Verified Open Funding Scout
                </h4>
                <p className="text-[11px] text-slate-300/80 leading-relaxed mt-0.5">
                  Autonomous daily grant discovery preserving source authenticity and application deadlines.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footnote */}
        <div className="relative z-10 pt-8 mt-6 border-t border-slate-800/80 text-[10px] text-slate-400">
          <span>© 2026 Research Saturday Nexus. All rights reserved. System Infrastructure 104.3</span>
        </div>
      </div>

      {/* RIGHT PANEL: Clean White Authentication Form matching reference */}
      <div className="bg-white p-8 sm:p-10 flex flex-col justify-center">
        <div className="max-w-sm mx-auto w-full">
          
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              Welcome Back
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Sign in to your account to continue
            </p>
          </div>

          {ssoMessage && (
            <div className="mb-4 p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs flex items-center gap-2 animate-in fade-in">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>{ssoMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@institution.ac.ke"
                  required
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-600/30 focus:border-teal-700 transition-colors"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-[11px] font-semibold text-slate-700">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => alert('Password recovery link dispatched to your verified institutional inbox.')}
                  className="text-[11px] font-medium text-teal-700 hover:text-teal-800 hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="w-full pl-9 pr-10 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-600/30 focus:border-teal-700 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Keep me signed in */}
            <div className="flex items-center">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={keepSignedIn}
                  onChange={(e) => setKeepSignedIn(e.target.checked)}
                  className="w-3.5 h-3.5 rounded text-teal-700 border-slate-300 focus:ring-teal-600 cursor-pointer"
                />
                <span className="text-xs text-slate-600 select-none">
                  Keep me signed in
                </span>
              </label>
            </div>

            {/* Primary Sign In Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 bg-[#0e3f3b] hover:bg-[#092d2a] text-white font-semibold text-xs rounded-lg transition-colors shadow-sm flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {isLoading ? (
                <span>Signing in...</span>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-[10px] uppercase">
              <span className="bg-white px-2 text-slate-400 font-medium tracking-wider">
                Or continue with SSO
              </span>
            </div>
          </div>

          {/* SSO Buttons */}
          <div className="grid grid-cols-2 gap-2.5">
            {/* Google */}
            <button
              type="button"
              onClick={() => handleSSO('Google')}
              className="flex items-center justify-center gap-2 py-2 px-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-xs font-medium text-slate-700 shadow-2xs"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Google</span>
            </button>

            {/* Microsoft */}
            <button
              type="button"
              onClick={() => handleSSO('Microsoft')}
              className="flex items-center justify-center gap-2 py-2 px-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-xs font-medium text-slate-700 shadow-2xs"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 23 23">
                <path fill="#f35325" d="M1 1h10v10H1z" />
                <path fill="#81bc06" d="M12 1h10v10H12z" />
                <path fill="#05a6f0" d="M1 12h10v10H1z" />
                <path fill="#ffba08" d="M12 12h10v10H12z" />
              </svg>
              <span>Microsoft</span>
            </button>
          </div>

          {/* Account Request & Quick Guest Explore */}
          <div className="mt-6 text-center space-y-2">
            <p className="text-[11px] text-slate-500">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => alert('Institutional account request submitted. An invitation token will be sent to your Dean or Research Directorate.')}
                className="font-semibold text-teal-700 hover:text-teal-800 hover:underline"
              >
                Request an Account
              </button>
            </p>

            <div className="pt-2">
              <button
                type="button"
                onClick={onExploreAsGuest}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/70 px-3 py-1.5 rounded-md transition-colors"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Explore Platform as Guest Researcher</span>
              </button>
            </div>
          </div>

        </div>
      </div>

    </div>
  );

  if (isModal) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
        {content}
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-teal-50/70 via-slate-50 to-emerald-50/50 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
      {content}
    </div>
  );
};
