import React, { useRef, useState } from 'react';
import { BrandWordmark } from './BrandWordmark.tsx';
import { EcosystemOrbit } from './EcosystemOrbit.tsx';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 

  Bot, 
  Database, 
  Coins, 
  ArrowRight, 
  Users,
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
  const hubRef = useRef<HTMLDivElement>(null);

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
    <div className="w-full max-w-4xl lg:max-w-[50rem] bg-white rounded-3xl shadow-2xl shadow-brand-navy/20 overflow-hidden grid grid-cols-1 md:grid-cols-2 border border-slate-200/80 relative z-10">
      
      {/* Optional Close Button if onClose is provided */}
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 px-2.5 py-1.5 text-slate-500 hover:text-slate-900 bg-white/90 hover:bg-slate-100 rounded-full border border-slate-200 transition-colors flex items-center gap-1.5 text-[11px] font-medium shadow-2xs"
          aria-label="Return to Nexus Platform"
          title="Return to Nexus Platform"
        >
          <span className="hidden sm:inline lg:hidden">Return to Workspace</span>
          <X className="w-3.5 h-3.5" />
        </button>
      )}

      {/* LEFT PANEL: IwazoLab navy field with crimson sweep, after the Research Saturday Kenya poster */}
      <div className="bg-brand-navy text-white p-8 sm:p-10 lg:p-8 flex flex-col justify-between relative overflow-hidden">
        {/* Curved crimson + white bands echoing the poster */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 400 600" preserveAspectRatio="none" aria-hidden="true">
          <path d="M400 0 C 300 170, 330 420, 470 640 L 470 0 Z" fill="#8A0F23" opacity="0.9" />
          <path d="M400 0 C 318 170, 348 420, 488 640 L 488 0 Z" fill="#0B195E" />
        </svg>
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.08]"
          style={{ backgroundImage: 'radial-gradient(#FFFFFF 1px, transparent 1px)', backgroundSize: '14px 14px' }}
          aria-hidden="true"
        />

        {/* Headline and capabilities, centred in the space above the footnote */}
        <div className="relative z-10 flex-1 flex flex-col justify-center">
          {/* Display Headline */}
          <div className="mb-7 lg:mb-5">
            {/* Event hashtag as a single-line display headline */}
            <h1
              className="inline-block whitespace-nowrap rounded-lg bg-white px-3 py-1.5 font-black tracking-tight leading-none text-brand-navy shadow-sm text-[clamp(1.2rem,5.8vw,1.6rem)] md:text-[1.45rem] lg:text-[1.75rem]"
              aria-label="#ResearchSaturdayKE"
            >
              <span className="text-brand-crimson">#</span>ResearchSaturday<span className="text-brand-crimson">KE</span>
            </h1>
            <p className="mt-2.5 text-sm italic text-white/85">Research. Reimagined.</p>
            <div className="brand-rule brand-rule-on-dark w-28 mt-3" aria-hidden="true"><span /><span /><span /></div>
          </div>

          {/* Platform capabilities */}
          <div className="space-y-3.5 lg:space-y-3">
            {[
              { icon: Bot, title: 'Automated Researcher Ingestion', body: 'Daily agent harvesting LinkedIn profiles, subject matter experts, and research credentials.' },
              { icon: Database, title: 'Open Microdata & MCP Harvester', body: 'Weekly crawler ingesting verified open-source datasets, surveys, and African repositories.' },
              { icon: Coins, title: 'Verified Open Funding Scout', body: 'Autonomous daily grant discovery preserving source authenticity and application deadlines.' }
            ].map(({ icon: Icon, title, body }) => (
              <div key={title} className="flex items-start lg:items-center gap-3" title={body}>
                <div className="w-7 h-7 rounded-full bg-white text-brand-navy flex items-center justify-center shrink-0 mt-0.5 lg:mt-0 ring-2 ring-brand-crimson">
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white tracking-wide">{title}</h4>
                  {/* Descriptions collapse to a hover title on large screens so the card fits inside the orbit */}
                  <p className="text-[11px] text-white/70 leading-relaxed mt-0.5 lg:hidden">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footnote */}
        <div className="relative z-10 pt-6 mt-7 lg:pt-4 lg:mt-5 border-t border-white/15">
          <p className="text-sm font-bold leading-snug text-white">
            Research dies in isolation.
            <br />
            Impact happens in <span className="rounded bg-white px-1.5 text-brand-crimson">ecosystems.</span>
          </p>
          <p className="mt-3 text-[10px] text-white/50">
            © 2026 IwazoLab Solutions Limited · Research Saturday Nexus
          </p>
        </div>
      </div>

      {/* RIGHT PANEL: Clean White Authentication Form matching reference */}
      <div className="bg-white p-8 sm:p-10 lg:p-8 flex flex-col justify-center">
        <div className="max-w-sm mx-auto w-full">
          
          <BrandWordmark size="sm" className="mb-6 md:hidden" />
          <div className="mb-6">
            <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-crimson mb-1">
              Nexus Intelligence Platform
            </div>
            <h2 className="text-2xl font-black text-brand-navy tracking-tight">
              Welcome back<span className="text-brand-crimson">.</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Sign in to your account to continue
            </p>
          </div>

          {ssoMessage && (
            <div className="mb-4 p-2.5 bg-emerald-50 border border-brand-crimson text-emerald-800 rounded-lg text-xs flex items-center gap-2 animate-in fade-in">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>{ssoMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 lg:space-y-3.5">
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
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-navy/20 focus:border-brand-navy focus:bg-white transition-colors"
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
                  className="text-[11px] font-medium text-brand-crimson hover:text-crimson-800 hover:underline"
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
                  className="w-full pl-9 pr-10 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-navy/20 focus:border-brand-navy focus:bg-white transition-colors"
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
                  className="w-3.5 h-3.5 rounded accent-brand-navy border-slate-300 focus:ring-brand-navy cursor-pointer"
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
              className="w-full py-2.5 px-4 bg-brand-navy hover:bg-brand-crimson text-white font-bold text-xs rounded-lg transition-colors shadow-sm flex items-center justify-center gap-2 disabled:opacity-60"
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
          <div className="relative my-5 lg:my-4">
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
          <div className="mt-6 lg:mt-5 text-center space-y-2">
            <p className="text-[11px] text-slate-500">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => alert('Institutional account request submitted. An invitation token will be sent to your Dean or Research Directorate.')}
                className="font-semibold text-brand-crimson hover:text-crimson-800 hover:underline"
              >
                Request an Account
              </button>
            </p>

            <div className="pt-2 lg:pt-1">
              <button
                type="button"
                onClick={onExploreAsGuest}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/70 px-3 py-1.5 rounded-md transition-colors"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-brand-crimson" />
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
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-navy/70 backdrop-blur-xs animate-in fade-in duration-200">
        {content}
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-white flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
      {/* Poster backdrop: navy field top-left and bottom-right, separated by crimson sweeps */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 1440 900" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0 0 H560 C 330 160, 150 420, 0 640 Z" fill="#0B195E" />
        <path d="M560 0 H600 C 360 170, 180 430, 0 690 V 640 C 150 420, 330 160, 560 0 Z" fill="#8A0F23" />
        <path d="M1440 900 H760 C 1040 820, 1290 640, 1440 360 Z" fill="#0B195E" />
        <path d="M1440 300 V 360 C 1290 640, 1040 820, 760 900 H 700 C 1000 810, 1270 620, 1440 300 Z" fill="#8A0F23" />
      </svg>
      {/* Ecosystem actors orbiting the login card, which stands in as the "Research to Impact" hub */}
      <EcosystemOrbit hubRef={hubRef} />
      <div ref={hubRef} className="relative z-10 w-full max-w-4xl lg:max-w-[50rem] transition-transform duration-500 ease-out">
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20 hidden lg:flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-navy text-white shadow-lg ring-4 ring-white">
          <Users className="w-3.5 h-3.5" />
          <span className="text-[11px] font-black tracking-[0.18em] uppercase">
            Research <span className="font-medium normal-case tracking-normal text-white/80">to</span> Impact
          </span>
        </div>
        {content}
      </div>
      <p className="lg:hidden relative z-10 mt-6 px-4 py-1.5 rounded-full bg-white/95 shadow-sm text-[11px] font-bold tracking-[0.25em] uppercase text-brand-navy">
        Research • Innovate • Empower
      </p>
    </div>
  );
};
