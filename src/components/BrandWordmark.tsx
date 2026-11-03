import React from 'react';

interface BrandWordmarkProps {
  /** Reversed colours for navy backgrounds */
  onDark?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
  className?: string;
}

const SIZE_CLASSES = {
  sm: { word: 'text-lg', tag: 'text-[8px] tracking-[0.14em]' },
  md: { word: 'text-2xl', tag: 'text-[9px] tracking-[0.16em]' },
  lg: { word: 'text-4xl', tag: 'text-[11px] tracking-[0.2em]' }
};

/**
 * Text-set IwazoLab wordmark ("Iwazo" navy, "Lab." crimson) with tagline and the
 * crimson–navy–crimson rule. Swap for the official logo file when one is added to /public.
 */
export const BrandWordmark: React.FC<BrandWordmarkProps> = ({
  onDark = false,
  size = 'md',
  showTagline = true,
  className = ''
}) => {
  const s = SIZE_CLASSES[size];
  return (
    <div className={`inline-flex flex-col ${className}`}>
      <span className={`${s.word} font-black tracking-tight leading-none`}>
        <span className={onDark ? 'text-white' : 'text-brand-navy'}>Iwazo</span>
        <span className={onDark ? 'text-crimson-300' : 'text-brand-crimson'}>Lab.</span>
      </span>
      {showTagline && (
        <>
          <span className={`${s.tag} font-semibold uppercase mt-1 whitespace-nowrap ${onDark ? 'text-white/80' : 'text-brand-charcoal/80'}`}>
            Research • Innovate • Empower
          </span>
          <div className={`brand-rule mt-1.5 ${onDark ? 'brand-rule-on-dark' : ''}`}>
            <span />
            <span />
            <span />
          </div>
        </>
      )}
    </div>
  );
};

/** Compact square mark: navy tile with a crimson corner, for tight spaces. */
export const BrandMark: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`relative w-9 h-9 rounded-lg bg-brand-navy text-white flex items-center justify-center font-black text-sm tracking-tight shadow-sm shrink-0 overflow-hidden ${className}`}>
    <span className="relative z-10">RS</span>
    <span className="absolute -bottom-3 -right-3 w-7 h-7 rounded-full bg-brand-crimson" />
  </div>
);
