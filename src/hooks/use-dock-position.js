import { useEffect, useState } from 'react';

export default function useDockPosition(threshold = 80) {
  const [isBottom, setIsBottom] = useState(false);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY || document.documentElement.scrollTop;
        setIsBottom(y > threshold);
        ticking = false;
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [threshold]);

  return { layout: isBottom ? 'bottom' : 'right', isBottom };
}
