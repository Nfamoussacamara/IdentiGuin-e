import { Star, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import { IStats } from '../../api/documents';
import AnimatedCounter from '../ui/AnimatedCounter';

interface StatsGridProps {
  stats: IStats;
}

export const StatsGrid = ({ stats }: StatsGridProps) => {
  const statsCards = [
    { name: 'Soumis', value: stats.SOUMIS, color: '#3b82f6', icon: <FileText className="text-blue-500" size={18} /> },
    { name: 'En traitement', value: stats.EN_TRAITEMENT, color: '#fbbf24', icon: <Star className="text-amber-400" size={18} /> },
    { name: 'Rejeté', value: stats.REJETE, color: '#ef4444', icon: <AlertCircle className="text-red-500" size={18} /> },
    { name: 'Accepté', value: stats.ACCEPTE, color: '#10b981', icon: <CheckCircle className="text-green-500" size={18} /> },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statsCards.map((stat) => (
        <div key={stat.name} className="admin-card p-5 flex items-center space-x-4">
          <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center border border-gray-100 shadow-sm">
            {stat.icon}
          </div>
          <div>
            <p className="text-2xl font-black text-gray-800">
              <AnimatedCounter value={stat.value} duration={1} />
            </p>
            <p className="text-[11px] font-black text-gray-400 uppercase tracking-wider">{stat.name}</p>
          </div>
        </div>
      ))}
    </div>
  );
};
