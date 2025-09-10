import { useEffect, useRef, useState } from 'react';
import { Home, FolderOpen, User, Mail, FileDown, Sun, Moon } from 'lucide-react';

const NAV_COLLAPSED_WIDTH = 56; // 14 * 4px

const items = [
  { id: 'hero', label: 'Home', icon: Home, href: '#hero' },
  { id: 'projects', label: 'Projects', icon: FolderOpen, href: '#projects' },
  { id: 'about', label: 'About', icon: User, href: '#about' },
  { id: 'contact', label: 'Contact', icon: Mail, href: '#contact' },
];

function sr(text) {
  return <span className="sr-only">{text}</span>;
}

const RightNav = ({ darkMode, toggleDarkMode }) => {
  const [expanded, setExpanded] = useState(false);
  const [pinned, setPinned] = useState(false);
  const navRef = useRef(null);

  // Default expanded & pinned on desktop
  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth >= 640) {
      setPinned(true);
      setExpanded(true);
    }
  }, []);

  // Collapse on outside click if not pinned
  useEffect(() => {
    const onDocClick = (e) => {
      if (!navRef.current) return;
      if (!navRef.current.contains(e.target) && !pinned) setExpanded(false);
    };
    document.addEventListener('click', onDocClick);
    return () => document.removeEventListener('click', onDocClick);
  }, [pinned]);

  const baseContainer = `
    fixed right-0 top-0 h-screen z-[1000001] hidden sm:flex pointer-events-auto
    motion-safe:transition-all motion-safe:duration-200 motion-reduce:transition-none
    `;

  const widthClass = expanded || pinned ? 'w-56' : 'w-14';

  const itemBase = `
    group relative w-full flex items-center gap-3 rounded-xl
    px-3 py-2 text-sm text-gray-700 dark:text-gray-200
    hover:bg-gray-100 dark:hover:bg-gray-800
    focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500
    motion-safe:transition-colors motion-safe:duration-150 motion-reduce:transition-none
  `;

  const tooltipBase = `
    pointer-events-none absolute right-full mr-2 whitespace-nowrap rounded-md
    bg-gray-900 text-white text-xs px-2 py-1 shadow-lg
    opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0
    group-focus-visible:opacity-100 group-focus-visible:translate-x-0
    motion-safe:transition-all motion-safe:duration-150 motion-reduce:transition-none
  `;

  const NavItem = ({ icon: Icon, label, href }) => (
    <li>
      <a
        href={href}
        aria-label={label}
        className={itemBase}
        tabIndex={0}
      >
        <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
        <span className={`truncate ${expanded || pinned ? 'block' : 'hidden'}`}>{label}</span>
        {/* Tooltip label when collapsed */}
        <span className={`${tooltipBase} ${expanded || pinned ? 'hidden' : 'block'}`}>{label}</span>
        {sr(label)}
      </a>
    </li>
  );

  return (
    <>
      {/* Desktop right vertical nav */}
      <nav
        ref={navRef}
        role="navigation"
        aria-label="Primary"
        className={`${baseContainer} ${widthClass}`}
        onMouseEnter={() => !pinned && setExpanded(true)}
        onMouseLeave={() => !pinned && setExpanded(false)}
      >
        <div className="flex h-full w-full flex-col items-stretch justify-between bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-l border-gray-200 dark:border-gray-800 shadow-xl">
          {/* Top section */}
          <ul className="mt-20 flex flex-col gap-1 px-2">
            {items.map((it) => (
              <NavItem key={it.id} icon={it.icon} label={it.label} href={it.href} />
            ))}
            {/* Resume download */}
            <li>
              <a
                href="https://cdn.builder.io/o/assets%2F6b324b93e5b14ce98e023877f74fee60%2F401928e148f74147b69e09cce45c4ef5?alt=media&token=8b16cb9b-7d3a-4435-a8fe-b7f2d26ab013&apiKey=6b324b93e5b14ce98e023877f74fee60"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Resume"
                className={itemBase}
              >
                <FileDown className="h-5 w-5" aria-hidden="true" />
                <span className={`truncate ${expanded || pinned ? 'block' : 'hidden'}`}>Resume</span>
                <span className={`${tooltipBase} ${expanded || pinned ? 'hidden' : 'block'}`}>Resume</span>
                {sr('Resume download')}
              </a>
            </li>
          </ul>

          {/* Bottom controls */}
          <div className="mb-6 px-2 flex flex-col gap-2">
            <button
              type="button"
              aria-label={darkMode ? 'Light theme' : 'Dark theme'}
              onClick={toggleDarkMode}
              className={`${itemBase} justify-start`}
            >
              {darkMode ? (
                <Sun className="h-5 w-5" aria-hidden="true" />
              ) : (
                <Moon className="h-5 w-5" aria-hidden="true" />
              )}
              <span className={`truncate ${expanded || pinned ? 'block' : 'hidden'}`}>Theme</span>
              <span className={`${tooltipBase} ${expanded || pinned ? 'hidden' : 'block'}`}>Theme</span>
              {sr('Toggle theme')}
            </button>

            <button
              type="button"
              aria-pressed={pinned}
              aria-label={pinned ? 'Collapse sidebar' : 'Expand sidebar'}
              onClick={() => setPinned((v) => !v)}
              className={`${itemBase} justify-start`}
            >
              <div className="h-5 w-5 rounded-sm border border-gray-300 dark:border-gray-700 flex items-center justify-center text-xs">
                {pinned ? '−' : '+'}
              </div>
              <span className={`truncate ${expanded || pinned ? 'block' : 'hidden'}`}>{pinned ? 'Collapse' : 'Expand'}</span>
              <span className={`${tooltipBase} ${expanded || pinned ? 'hidden' : 'block'}`}>{pinned ? 'Collapse' : 'Expand'}</span>
              {sr(pinned ? 'Collapse sidebar' : 'Expand sidebar')}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile bottom bar */}
      <nav
        role="navigation"
        aria-label="Primary mobile"
        className="md:hidden fixed bottom-2 left-1/2 -translate-x-1/2 z-50 w-[min(92%,28rem)] rounded-2xl border border-gray-200 dark:border-gray-800 bg-white/90 dark:bg-gray-900/80 backdrop-blur-md shadow-lg"
      >
        <ul className="grid grid-cols-5">
          {items.map((it) => (
            <li key={it.id} className="contents">
              <a
                href={it.href}
                aria-label={it.label}
                className="flex items-center justify-center p-3 text-gray-700 dark:text-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                <it.icon className="h-5 w-5" aria-hidden="true" />
                {sr(it.label)}
              </a>
            </li>
          ))}
          <li className="contents">
            <button
              type="button"
              aria-label={darkMode ? 'Light theme' : 'Dark theme'}
              onClick={toggleDarkMode}
              className="flex items-center justify-center p-3 text-gray-700 dark:text-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 w-full"
            >
              {darkMode ? (
                <Sun className="h-5 w-5" aria-hidden="true" />
              ) : (
                <Moon className="h-5 w-5" aria-hidden="true" />
              )}
              {sr('Toggle theme')}
            </button>
          </li>
        </ul>
      </nav>
    </>
  );
};

export default RightNav;
