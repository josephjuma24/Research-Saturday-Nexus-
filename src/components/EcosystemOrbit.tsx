import React, { useEffect, useRef, useState } from 'react';
import {
  Users,
  Factory,
  Banknote,
  Rocket,
  Lightbulb,
  Landmark,
  GraduationCap
} from 'lucide-react';

/**
 * "Research thrives in ecosystems" ring from the Research Saturday Kenya poster,
 * animated as a slow elliptical orbit around the login card. The login card sits
 * at the hub ("Research to Impact"); the seven ecosystem actors circle it.
 *
 * The ellipse is sized from the hub element so the card always sits inside the ring
 * with clearance. When the viewport is too small for that, the hub is scaled down
 * proportionally; below MIN_HUB_SCALE the orbit hides and the card returns to normal.
 *
 * Positions are written straight to the DOM each frame so React does not re-render
 * during the animation. Hovering a node eases the orbit to a stop and shows its role.
 */

interface EcosystemNode {
  label: string;
  role: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  tone: 'navy' | 'crimson';
}

// Clockwise from the top, as on the poster
const NODES: EcosystemNode[] = [
  { label: 'Researchers', role: 'Generate evidence and new knowledge', icon: Users, tone: 'crimson' },
  { label: 'Industry', role: 'Applies findings and co-creates solutions', icon: Factory, tone: 'navy' },
  { label: 'Funding', role: 'Resources ideas from proposal to scale', icon: Banknote, tone: 'crimson' },
  { label: 'Innovators', role: 'Turn evidence into products and services', icon: Rocket, tone: 'navy' },
  { label: 'Mentors', role: 'Guide methods, careers and quality', icon: Lightbulb, tone: 'crimson' },
  { label: 'Policymakers', role: 'Translate evidence into public decisions', icon: Landmark, tone: 'navy' },
  { label: 'Institutions', role: 'Host, govern and sustain research', icon: GraduationCap, tone: 'crimson' }
];

// Connector style from node i to node i+1: solid navy or dotted crimson, as on the poster
const CONNECTORS: Array<'solid' | 'dotted'> = ['solid', 'dotted', 'solid', 'dotted', 'solid', 'dotted', 'dotted'];

const NODE_SIZE = 72;
// Smaller nodes on shorter screens (most laptops) so the ring still fits around the card
const NODE_SIZE_COMPACT = 56;
const COMPACT_BELOW_HEIGHT = 900;

const TIP_PLACEMENT_CLASSES = {
  left: 'right-full mr-4 top-1/2 -translate-y-1/2',
  right: 'left-full ml-4 top-1/2 -translate-y-1/2',
  'below-left': 'left-0 top-full mt-9',
  'below-right': 'right-0 top-full mt-9'
};
const SECONDS_PER_REVOLUTION = 90;
const MIN_WIDTH = 1024;
const MIN_HEIGHT = 620;
const MIN_HUB_SCALE = 0.78;
// Caps how far wider than the card the orbit may run on large screens
const MAX_ORBIT_STRETCH = 1.6;
// Gap between the card's corner and the orbit path, enough for a node to pass
const hubClearance = (nodeSize: number) => nodeSize / 2 + 22;
// Room the outermost nodes and their labels need from the viewport edge
const edgeMarginX = (nodeSize: number) => nodeSize / 2 + 40;
const edgeMarginY = (nodeSize: number) => nodeSize / 2 + 38;

interface EcosystemOrbitProps {
  /** The element the orbit circles: the login card wrapper */
  hubRef: React.RefObject<HTMLElement | null>;
}

export const EcosystemOrbit: React.FC<EcosystemOrbitProps> = ({ hubRef }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<Array<HTMLDivElement | null>>([]);
  const arcRefs = useRef<Array<SVGPathElement | null>>([]);
  const spokeRefs = useRef<Array<SVGLineElement | null>>([]);
  const discRef = useRef<SVGEllipseElement>(null);
  const hoveredRef = useRef<number | null>(null);

  const [hovered, setHovered] = useState<number | null>(null);
  // Tooltips open on the side facing away from the login card so they are never covered
  // and drop below the node when there is no room beside it near the screen edge.
  const [tipPlacement, setTipPlacement] = useState<'left' | 'right' | 'below-left' | 'below-right'>('right');
  const [visible, setVisible] = useState(false);
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    hoveredRef.current = hovered;
  }, [hovered]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const baseSpeed = reduceMotion ? 0 : (Math.PI * 2) / SECONDS_PER_REVOLUTION;

    let width = 0;
    let height = 0;
    let cx = 0;
    let cy = 0;
    let rx = 0;
    let ry = 0;
    let nodeSize = NODE_SIZE;
    let angle = -Math.PI / 2; // first node starts at the top
    let speed = baseSpeed;
    let last = performance.now();
    let frame = 0;

    const measure = () => {
      width = container.clientWidth;
      height = container.clientHeight;
      cx = width / 2;
      cy = height / 2;
      rx = width * 0.44;
      ry = height * 0.4;

      nodeSize = height < COMPACT_BELOW_HEIGHT ? NODE_SIZE_COMPACT : NODE_SIZE;
      const clearance = hubClearance(nodeSize);
      const hub = hubRef.current;
      let fits = width >= MIN_WIDTH && height >= MIN_HEIGHT;

      if (hub && fits) {
        // offset* values ignore the scale transform applied below
        const halfW = hub.offsetWidth / 2;
        const halfH = hub.offsetHeight / 2;
        cx = hub.offsetLeft + halfW;
        cy = hub.offsetTop + halfH;

        const maxRx = Math.min(cx, width - cx) - edgeMarginX(nodeSize);
        const maxRy = Math.min(cy, height - cy) - edgeMarginY(nodeSize);

        // Smallest ellipse (for a given width) whose path clears the scaled card's
        // corners by the clearance: corner (a, b) satisfies a²/rx² + b²/ry² = 1.
        const fitAt = (scale: number) => {
          const a = halfW * scale + clearance;
          const b = halfH * scale + clearance;
          // Prefer a ring close to the card's proportions; widen to the full
          // available width only when that is what it takes to fit the height.
          for (const fitRx of [Math.min(maxRx, a * MAX_ORBIT_STRETCH), maxRx]) {
            if (a >= fitRx) continue;
            const fitRy = b / Math.sqrt(1 - (a / fitRx) ** 2);
            if (fitRy <= maxRy) return { rx: fitRx, ry: fitRy };
          }
          return null;
        };

        // Largest scale (up to 1) that fits, by bisection
        let best = fitAt(1);
        let scale = 1;
        if (!best) {
          let lo = MIN_HUB_SCALE;
          let hi = 1;
          best = fitAt(lo);
          scale = lo;
          if (best) {
            for (let i = 0; i < 12; i++) {
              const mid = (lo + hi) / 2;
              const fit = fitAt(mid);
              if (fit) { lo = mid; best = fit; scale = mid; } else { hi = mid; }
            }
          }
        }

        if (best) {
          rx = best.rx;
          ry = best.ry;
          hub.style.transform = scale < 1 ? `scale(${scale})` : '';
        } else {
          fits = false;
        }
      }

      if (hub && !fits) hub.style.transform = '';
      setVisible(fits);
      setCompact(nodeSize === NODE_SIZE_COMPACT);
      nodeRefs.current.forEach((node) => {
        if (node) {
          node.style.width = `${nodeSize}px`;
          node.style.height = `${nodeSize}px`;
        }
      });
    };

    const step = (count: number) => (Math.PI * 2 * count) / NODES.length;
    const point = (a: number) => ({
      x: cx + rx * Math.cos(a),
      y: cy + ry * Math.sin(a)
    });

    const draw = () => {
      const gap = (nodeSize / 2 + 10) / Math.min(rx, ry);

      if (discRef.current) {
        discRef.current.setAttribute('cx', String(cx));
        discRef.current.setAttribute('cy', String(cy));
        discRef.current.setAttribute('rx', String(rx + nodeSize));
        discRef.current.setAttribute('ry', String(ry + nodeSize));
      }

      NODES.forEach((_, i) => {
        const a = angle + step(i);
        const p = point(a);

        const node = nodeRefs.current[i];
        if (node) {
          node.style.transform = `translate(${p.x - nodeSize / 2}px, ${p.y - nodeSize / 2}px)`;
        }

        const arc = arcRefs.current[i];
        if (arc) {
          const from = point(a + gap);
          const to = point(a + step(1) - gap);
          arc.setAttribute('d', `M ${from.x} ${from.y} A ${rx} ${ry} 0 0 1 ${to.x} ${to.y}`);
        }

        const spoke = spokeRefs.current[i];
        if (spoke) {
          const dx = cx - p.x;
          const dy = cy - p.y;
          const len = Math.hypot(dx, dy) || 1;
          const ux = dx / len;
          const uy = dy / len;
          const start = nodeSize / 2 + 14;
          spoke.setAttribute('x1', String(p.x + ux * start));
          spoke.setAttribute('y1', String(p.y + uy * start));
          spoke.setAttribute('x2', String(p.x + ux * (start + 34)));
          spoke.setAttribute('y2', String(p.y + uy * (start + 34)));
        }
      });
    };

    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.1);
      last = now;
      // Ease towards a stop while a node is hovered, and back up to cruising speed after
      const target = hoveredRef.current === null ? baseSpeed : 0;
      speed += (target - speed) * Math.min(dt * 4, 1);
      angle += speed * dt;
      draw();
      frame = requestAnimationFrame(tick);
    };

    const observer = new ResizeObserver(() => {
      measure();
      draw();
    });
    observer.observe(container);
    if (hubRef.current) observer.observe(hubRef.current);
    measure();
    draw();
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      if (hubRef.current) hubRef.current.style.transform = '';
    };
  }, [hubRef]);

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 z-[1] pointer-events-none transition-opacity duration-700 ${visible ? 'opacity-100' : 'opacity-0'}`}
      aria-hidden="true"
    >
      <svg className="absolute inset-0 w-full h-full overflow-visible">
        <ellipse ref={discRef} fill="#EEF1FA" fillOpacity={0.16} />
        {CONNECTORS.map((style, i) => (
          <path
            key={`arc-${i}`}
            ref={(el) => { arcRefs.current[i] = el; }}
            fill="none"
            stroke={style === 'solid' ? '#0B195E' : '#8A0F23'}
            strokeWidth={5}
            strokeLinecap="round"
            strokeDasharray={style === 'solid' ? undefined : '0 13'}
          />
        ))}
        {NODES.map((_, i) => (
          <line
            key={`spoke-${i}`}
            ref={(el) => { spokeRefs.current[i] = el; }}
            stroke="#0B195E"
            strokeOpacity={0.55}
            strokeWidth={3.5}
            strokeLinecap="round"
            strokeDasharray="0 11"
          />
        ))}
      </svg>

      {visible && NODES.map((node, i) => {
        const Icon = node.icon;
        const isHovered = hovered === i;
        return (
          <div
            key={node.label}
            ref={(el) => { nodeRefs.current[i] = el; }}
            className="absolute left-0 top-0 pointer-events-auto will-change-transform"
            style={{ width: compact ? NODE_SIZE_COMPACT : NODE_SIZE, height: compact ? NODE_SIZE_COMPACT : NODE_SIZE }}
            onMouseEnter={(e) => {
              const container = containerRef.current;
              if (container) {
                const box = e.currentTarget.getBoundingClientRect();
                const bounds = container.getBoundingClientRect();
                const onLeft = box.left + box.width / 2 < bounds.left + bounds.width / 2;
                const room = onLeft ? box.left - bounds.left : bounds.right - box.right;
                const TIP_SPACE = 216;
                if (onLeft) setTipPlacement(room >= TIP_SPACE ? 'left' : 'below-left');
                else setTipPlacement(room >= TIP_SPACE ? 'right' : 'below-right');
              }
              setHovered(i);
            }}
            onMouseLeave={() => setHovered((h) => (h === i ? null : h))}
          >
            <div
              className={`w-full h-full rounded-full bg-white ${compact ? 'border-[3px]' : 'border-[4px]'} border-brand-navy flex items-center justify-center shadow-lg shadow-brand-navy/20 transition-all duration-300 cursor-default ${
                isHovered ? 'scale-110 ring-4 ring-crimson-200 shadow-xl' : ''
              }`}
            >
              <Icon
                className={`${compact ? 'w-5 h-5' : 'w-7 h-7'} ${node.tone === 'crimson' ? 'text-brand-crimson' : 'text-brand-navy'}`}
                strokeWidth={2.2}
              />
            </div>

            <div className="absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap px-2.5 py-0.5 rounded-full bg-white/95 shadow-sm text-[10px] font-black tracking-[0.12em] uppercase text-brand-navy">
              {node.label}
            </div>

            <div
              className={`absolute w-48 rounded-lg bg-brand-navy text-white text-[11px] leading-snug px-3 py-2 shadow-xl border-l-4 border-brand-crimson transition-opacity duration-200 ${
                TIP_PLACEMENT_CLASSES[tipPlacement]
              } ${isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            >
              {node.role}.
            </div>
          </div>
        );
      })}
    </div>
  );
};
