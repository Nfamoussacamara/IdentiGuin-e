import { useRef, useState, useEffect } from 'react';

/**
 * Hook pour créer un effet magnétique sur un élément.
 * @param {number} strength - La force de l'attraction (par défaut 0.5)
 */
export const useMagnetic = (strength = 0.5) => {
  const ref = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: any) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = (ref.current as any).getBoundingClientRect();
    
    // Calcul du centre de l'élément
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    
    // Distance entre la souris et le centre
    const deltaX = clientX - centerX;
    const deltaY = clientY - centerY;
    
    // Appliquer la force
    setPosition({ x: deltaX * strength, y: deltaY * strength });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return {
    ref,
    position,
    handleMouseMove,
    handleMouseLeave
  };
};
