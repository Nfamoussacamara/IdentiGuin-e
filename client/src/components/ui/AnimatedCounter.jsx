import { useEffect, useRef, useState } from 'react';

const AnimatedCounter = ({ value, duration = 1.5 }) => {
  const ref = useRef(null);
  const [displayed, setDisplayed] = useState('0');
  const [hasAnimated, setHasAnimated] = useState(false);

  // Parse final numeric value from the string
  const parseFinalNum = (v) => {
    if (typeof v !== 'string') return Number(v) || 0;
    if (v.includes('/')) return parseInt(v.split('/')[0], 10); // e.g. "150/180" → 150
    if (v.includes('%')) return parseInt(v.replace(/[^0-9]/g, ''), 10); // "70%" → 70, "<25%" → 25
    if (v.includes('GNF')) return 500000;
    return parseInt(v.replace(/[^0-9]/g, ''), 10) || 0;
  };

  // Format the animated number back to its original format
  const format = (num, v) => {
    const rounded = Math.round(num);
    if (typeof v !== 'string') return String(rounded);
    if (v.includes('/')) return `${rounded}/180`;
    if (v.startsWith('<') && v.includes('%')) return `<${rounded}%`;
    if (v.includes('%')) return `${rounded}%`;
    if (v.includes('GNF')) return `${rounded.toLocaleString('fr-FR')} GNF`;
    return String(rounded);
  };

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          const finalNum = parseFinalNum(value);
          const startTime = performance.now();
          const totalDuration = duration * 1000;

          const tick = (now) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / totalDuration, 1);
            // easeOut cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = finalNum * eased;
            setDisplayed(format(current, value));
            if (progress < 1) requestAnimationFrame(tick);
            else setDisplayed(format(finalNum, value));
          };

          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.4 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [value, duration, hasAnimated]);

  return <span ref={ref}>{displayed}</span>;
};

export default AnimatedCounter;
