import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Home, FolderOpen, User, Mail, FileDown, Sun, Moon } from 'lucide-react';
import useDockPosition from '@/hooks/use-dock-position.js';

const NAV_WIDTH = 56; // w-14
const ICON_SIZE = 20;

const items = [
  { id: 'hero', label: 'Home', icon: Home, href: '#hero' },
  { id: 'projects', label: 'Projects', icon: FolderOpen, href: '#projects' },
  { id: 'about', label: 'About', icon: User, href: '#about' },
  { id: 'contact', label: 'Contact', icon: Mail, href: '#contact' },
];

const Tooltip = ({ children }) => (
  <span
    className="pointer-events-none absolute right-full mr-2 rounded-full bg-black/80 text-white text-xs px-2 py-1 shadow-lg backdrop-blur-sm opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 group-focus-visible:opacity-100 group-focus-visible:translate-x-0 motion-safe:transition-all motion-safe:duration-150"
    role="tooltip"
  >
    {children}
  </span>
);

const DockButton = ({ href, label, Icon, onClick, reduced }) => {
  const ref = useRef(null);
  const [style, setStyle] = useState({ transform: 'translateZ(0)' });

  useEffect(() => {
    if (reduced) return; // accessibility: no tilt
    const el = ref.current;
    if (!el) return;
    let rafId = 0;
    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
      const y = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
      const rx = (-y * 8).toFixed(2);
      const ry = (x * 8).toFixed(2);
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => setStyle({ transform: `rotateX(${rx}deg) rotateY(${ry}deg) translateZ(0)` }));
    };
    const reset = () => setStyle({ transform: 'rotateX(0deg) rotateY(0deg) translateZ(0)' });
    el.addEventListener('mousemove', onMove, { passive: true });
    el.addEventListener('mouseleave', reset);
    return () => {
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', reset);
      cancelAnimationFrame(rafId);
    };
  }, [reduced]);

  const className = 'group relative mx-auto w-12 h-12 flex items-center justify-center rounded-2xl text-gray-100 hover:text-white bg-white/12 hover:bg-white/20 dark:bg-white/10 dark:hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 shadow-[0_6px_20px_rgba(0,0,0,0.35)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.5),0_6px_18px_rgba(125,90,255,0.18)] backdrop-blur-md will-change-transform';

  return (
    <a ref={ref} href={href} aria-label={label} onClick={onClick} className={className} style={style} tabIndex={0}>
      <Icon className="h-5 w-5 transform-gpu transition-transform duration-150 group-hover:scale-110" aria-hidden="true" size={ICON_SIZE} />
      <span className="sr-only">{label}</span>
      <Tooltip>{label}</Tooltip>
    </a>
  );
};

const RightDock = ({ darkMode, toggleDarkMode }) => {
  const reduced = useReducedMotion();
  const { layout, isBottom } = useDockPosition();

  const containerCommon = 'fixed z-[1000001] pointer-events-auto select-none hidden sm:block';
  const glass = 'rounded-xl border border-white/30 bg-black/30 dark:bg-black/30 backdrop-blur-md shadow-2xl shadow-black/50 ring-1 ring-cyan-400/25';

  const transition = reduced ? { duration: 0 } : { type: 'spring', stiffness: 120, damping: 18 };

  const positionClass = isBottom
    ? 'bottom-3 left-1/2 -translate-x-1/2 w-[min(92%,28rem)] px-2 py-1'
    : 'right-3 top-0 h-screen w-14 px-1 py-16';

  return (
    <>
      {/* Desktop/right -> Bottom dock */}
      <motion.nav
        role="navigation"
        aria-label="Primary"
        className={`${containerCommon} ${glass} ${positionClass}`}
        layout
        transition={transition}
        style={{ willChange: 'transform, opacity' }}
      >
        <ul className={`flex ${isBottom ? 'flex-row items-center gap-2' : 'flex-col items-center gap-2'} w-full h-full ${isBottom ? 'justify-center' : 'justify-start pt-20'}`}>
          {items.map((it) => (
            <li key={it.id} className="contents">
              <DockButton href={it.href} label={it.label} Icon={it.icon} reduced={reduced} />
            </li>
          ))}
          <li className="contents">
            <DockButton href={"https://cdn.builder.io/o/assets%2F6b324b93e5b14ce98e023877f74fee60%2F401928e148f74147b69e09cce45c4ef5?alt=media&token=8b16cb9b-7d3a-4435-a8fe-b7f2d26ab013&apiKey=6b324b93e5b14ce98e023877f74fee60"} label="Resume" Icon={FileDown} reduced={reduced} />
          </li>
          <li className="contents">
            <button
              type="button"
              aria-label={darkMode ? 'Light theme' : 'Dark theme'}
              onClick={toggleDarkMode}
              className="group relative mx-auto w-11 h-11 flex items-center justify-center rounded-2xl text-gray-200 hover:text-white bg-white/10 hover:bg-white/15 dark:bg-white/10 dark:hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 shadow-[0_6px_20px_rgba(0,0,0,0.35)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.45),0_6px_18px_rgba(0,168,255,0.14)] backdrop-blur-md"
            >
              {darkMode ? (
                <Sun className="h-5 w-5" aria-hidden="true" />
              ) : (
                <Moon className="h-5 w-5" aria-hidden="true" />
              )}
              <span className="sr-only">Theme</span>
              <Tooltip>Theme</Tooltip>
            </button>
          </li>
        </ul>
      </motion.nav>

      {/* Mobile: bottom dock only */}
      <nav
        role="navigation"
        aria-label="Primary mobile"
        className="md:hidden fixed bottom-2 left-1/2 -translate-x-1/2 z-[1000001] w-[min(92%,28rem)] rounded-2xl border border-white/10 bg-black/20 backdrop-blur-md"
      >
        <ul className="grid grid-cols-5">
          {items.map((it) => (
            <li key={it.id} className="contents">
              <a
                href={it.href}
                aria-label={it.label}
                className="group flex items-center justify-center p-3 text-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                <it.icon className="h-5 w-5" aria-hidden="true" />
                <span className="sr-only">{it.label}</span>
              </a>
            </li>
          ))}
          <li className="contents">
            <button
              type="button"
              aria-label={darkMode ? 'Light theme' : 'Dark theme'}
              onClick={toggleDarkMode}
              className="flex items-center justify-center p-3 text-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 w-full"
            >
              {darkMode ? <Sun className="h-5 w-5" aria-hidden="true" /> : <Moon className="h-5 w-5" aria-hidden="true" />}
              <span className="sr-only">Toggle theme</span>
            </button>
          </li>
        </ul>
      </nav>
    </>
  );
};

export default RightDock;
