import React from 'react';
import { ChevronLeft, ChevronRight, LayoutGrid, List } from 'lucide-react';

interface ScrollableSectionProps {
  title: string;
  icon: React.ReactNode;
  countLabel: string;
  accentColor?: 'emerald' | 'amber' | 'blue' | 'purple';
  childrenRail: React.ReactNode;
  childrenList: React.ReactNode;
  itemCount: number;
  defaultMode?: 'rail' | 'list';
  listMaxHeight?: string;
  headerRightText?: string;
  className?: string;
}

export const ScrollableSection: React.FC<ScrollableSectionProps> = ({
  title,
  icon,
  countLabel,
  accentColor = 'emerald',
  childrenRail,
  childrenList,
  itemCount,
  defaultMode = 'list',
  listMaxHeight = 'max-h-[500px]',
  headerRightText,
  className = ''
}) => {
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const [viewMode, setViewMode] = React.useState<'rail' | 'list'>(defaultMode);
  const [canScrollLeft, setCanScrollLeft] = React.useState(false);
  const [canScrollRight, setCanScrollRight] = React.useState(true);
  const [activeIndex, setActiveIndex] = React.useState(0);

  const checkScrollState = () => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 15);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 15);

    // Calculate approximate active index
    const cardWidth = 380;
    const idx = Math.min(Math.round(scrollLeft / cardWidth), itemCount - 1);
    setActiveIndex(Math.max(0, idx));
  };

  React.useEffect(() => {
    checkScrollState();
    const el = scrollContainerRef.current;
    if (el) {
      el.addEventListener('scroll', checkScrollState, { passive: true });
    }
    window.addEventListener('resize', checkScrollState);
    return () => {
      if (el) el.removeEventListener('scroll', checkScrollState);
      window.removeEventListener('resize', checkScrollState);
    };
  }, [itemCount, viewMode]);

  const handleScroll = (direction: 'left' | 'right') => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const scrollAmount = direction === 'left' ? -380 : 380;
    el.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  const scrollToCard = (index: number) => {
    const el = scrollContainerRef.current;
    if (!el) return;
    el.scrollTo({ left: index * 380, behavior: 'smooth' });
  };

  const accentBorderClass = {
    emerald: 'focus-visible:ring-emerald-500',
    amber: 'focus-visible:ring-amber-500',
    blue: 'focus-visible:ring-blue-500',
    purple: 'focus-visible:ring-purple-500',
  }[accentColor];

  const dotActiveClass = {
    emerald: 'bg-emerald-600 w-6',
    amber: 'bg-amber-600 w-6',
    blue: 'bg-blue-600 w-6',
    purple: 'bg-purple-600 w-6',
  }[accentColor];

  return (
    <section className={`space-y-3 pt-4 ${className}`}>
      {/* Header bar with controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1 border-b border-slate-100">
        <div className="flex items-center gap-2.5 flex-wrap">
          {icon}
          <h2 className="text-base font-bold text-slate-900 tracking-tight">
            {title}
          </h2>
          <span className="text-xs text-slate-500 font-mono tabular-nums bg-slate-100 px-2 py-0.5 rounded-full">
            {countLabel}
          </span>
          {headerRightText && (
            <span className="text-xs text-slate-500 font-mono hidden sm:inline border-l border-slate-200 pl-2">
              {headerRightText}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
          {/* View Mode Toggle: Rail vs List */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs">
            <button
              type="button"
              onClick={() => setViewMode('rail')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md font-medium transition-all ${
                viewMode === 'rail'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Horizontal Scroll Rail"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Scroll Rail</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md font-medium transition-all ${
                viewMode === 'list'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Vertical Scroll List"
            >
              <List className="w-3.5 h-3.5" />
              <span>Scroll List</span>
            </button>
          </div>

          {/* Scroll Navigation Buttons (active in rail view) */}
          {viewMode === 'rail' && (
            <div className="flex items-center gap-1 pl-1">
              <button
                type="button"
                onClick={() => handleScroll('left')}
                disabled={!canScrollLeft}
                aria-label="Scroll left"
                className={`p-1.5 rounded-lg border border-slate-200 transition-colors ${
                  canScrollLeft
                    ? 'bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900 active:scale-95 shadow-xs cursor-pointer'
                    : 'bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed'
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => handleScroll('right')}
                disabled={!canScrollRight}
                aria-label="Scroll right"
                className={`p-1.5 rounded-lg border border-slate-200 transition-colors ${
                  canScrollRight
                    ? 'bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900 active:scale-95 shadow-xs cursor-pointer'
                    : 'bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed'
                }`}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Content Container */}
      {viewMode === 'rail' ? (
        <div className="relative group">
          {/* Subtle left scroll fade indicator */}
          {canScrollLeft && (
            <div className="pointer-events-none absolute left-0 top-0 bottom-3 w-8 bg-gradient-to-r from-white to-transparent z-10 rounded-l-xl" />
          )}

          {/* Horizontally Scrollable Rail */}
          <div
            ref={scrollContainerRef}
            tabIndex={0}
            className={`flex items-stretch gap-4 overflow-x-auto pb-4 pt-1 snap-x snap-mandatory custom-scrollbar scroll-smooth outline-none ${accentBorderClass}`}
          >
            {childrenRail}
          </div>

          {/* Subtle right scroll fade indicator */}
          {canScrollRight && (
            <div className="pointer-events-none absolute right-0 top-0 bottom-3 w-8 bg-gradient-to-l from-white to-transparent z-10 rounded-r-xl" />
          )}

          {/* Scroll progress dot indicators */}
          {itemCount > 1 && (
            <div className="flex items-center justify-between pt-1 px-1 text-xs text-slate-400">
              <span className="text-[11px] font-medium tracking-wide text-slate-500">
                Swipe or scroll horizontally · {itemCount} items
              </span>
              <div className="flex items-center gap-1.5">
                {Array.from({ length: itemCount }).map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => scrollToCard(idx)}
                    aria-label={`Jump to item ${idx + 1}`}
                    className={`h-1.5 rounded-full transition-all duration-200 ${
                      activeIndex === idx ? dotActiveClass : 'bg-slate-200 w-2 hover:bg-slate-300'
                    }`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Vertically Scrollable List */
        <div className="relative">
          <div className={`${listMaxHeight} overflow-y-auto space-y-3 pr-1.5 custom-scrollbar scroll-smooth`}>
            {childrenList}
          </div>
          <div className="text-[11px] text-slate-500 pt-2.5 px-1 flex items-center justify-between border-t border-slate-100 mt-2">
            <span className="flex items-center gap-1.5 font-medium text-slate-600">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
              Scroll list to view all {itemCount} scored entries
            </span>
            <span className="font-mono text-slate-400 text-[10px]">
              Continuous Scroll Active
            </span>
          </div>
        </div>
      )}
    </section>
  );
};
