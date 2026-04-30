import { useEffect, useRef, useState } from 'react';

const AnimatedCounter = ({ value, duration = 1.5 }: { value: string | number, duration?: number }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const [displayed, setDisplayed] = useState<string>('0');
  const [hasAnimated, setHasAnimated] = useState<boolean>(false);

  // Parse final numeric value from the string
  const parseFinalNum = (v: string | number): number => {
    if (typeof v !== 'string') return Number(v) || 0;
    if (v.includes('/')) return parseInt(v.split('/')[0], 10); // e.g. "150/180" → 150
    if (v.includes('%')) return parseInt(v.replace(/[^0-9]/g, ''), 10); // "70%" → 70, "<25%" → 25
    if (v.includes('GNF')) return 500000;
    return parseInt(v.replace(/[^0-9]/g, ''), 10) || 0;
  };

  // Format the animated number back to its original format
  const formatResult = (num: number, v: string | number): string => {
    if (typeof v === 'number') return num.toString();
    const isPercentage = v.includes('%');
    const isLessThan = v.includes('<');
    const hasPlus = v.includes('+');
    const hasSlash = v.includes('/');
    
    let result = num.toString();
    if (isLessThan) result = '<' + result;
    if (hasPlus) result = result + '+';
    if (isPercentage) result = result + '%';
    if (hasSlash) result = result + '/' + v.split('/')[1];

    return result;
  };

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          
          let startTimestamp: number | null = null;
          const target = parseFinalNum(value);
          
          const step = (timestamp: number) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / (duration * 1000), 1);
            // Ease out cubic
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            
            const currentNum = Math.floor(easeProgress * target);
            setDisplayed(formatResult(currentNum, value));
            
            if (progress < 1) {
              window.requestAnimationFrame(step);
            } else {
              setDisplayed(value.toString()); // Ensure it finishes precisely
            }
          };
          
          window.requestAnimationFrame(step);
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [value, duration, hasAnimated]);

  return <span ref={ref}>{displayed}</span>;
};

export default AnimatedCounter;
