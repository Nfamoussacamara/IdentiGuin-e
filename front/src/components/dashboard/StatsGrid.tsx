import { Star, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import type { IStats } from '@/types';
import AnimatedCounter from '../ui/AnimatedCounter';
import { StatsCard } from './DashboardCards';

interface StatsGridProps {
  stats: IStats;
}

/**
 * Grille de statistiques utilisant les composants StatsCard premium.
 * Les couleurs et icônes sont alignées sur la référence "Reference Dashboard".
 */
export const StatsGrid = ({ stats }: StatsGridProps) => {
  const statsConfig = [
    { 
      name: 'Soumis', 
      value: stats.SOUMIS, 
      variant: 'blue' as const, 
      icon: <FileText size={22} /> 
    },
    { 
      name: 'En traitement', 
      value: stats.EN_TRAITEMENT, 
      variant: 'orange' as const, 
      icon: <Star size={22} /> 
    },
    { 
      name: 'Rejeté', 
      value: stats.REJETE, 
      variant: 'red' as const, 
      icon: <AlertCircle size={22} /> 
    },
    { 
      name: 'Accepté', 
      value: stats.ACCEPTE, 
      variant: 'green' as const, 
      icon: <CheckCircle size={22} /> 
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {statsConfig.map((stat) => (
        <StatsCard 
          key={stat.name}
          label={stat.name}
          variant={stat.variant}
          icon={stat.icon}
          value={<AnimatedCounter value={stat.value} duration={1} />}
        />
      ))}
    </div>
  );
};
