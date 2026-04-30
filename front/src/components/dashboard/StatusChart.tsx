import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import type { IStats } from '@/types';
import { DashboardCard } from './DashboardCards';

interface StatusChartProps {
  stats: IStats;
}

/**
 * Graphique de répartition des documents par statut.
 * Intégré dans un DashboardCard pour respecter les bordures de la référence.
 */
export const StatusChart = ({ stats }: StatusChartProps) => {
  const chartData = [
    { name: 'Soumis', value: stats.SOUMIS, color: '#3b82f6' },
    { name: 'En cours', value: stats.EN_TRAITEMENT, color: '#fbbf24' },
    { name: 'Rejeté', value: stats.REJETE, color: '#ef4444' },
    { name: 'Accepté', value: stats.ACCEPTE, color: '#10b981' },
  ];

  return (
    <DashboardCard title="Statistiques de traitement">
      <div className="h-[300px] w-full mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e9ecef" />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 11, fill: '#6c757d', fontWeight: 500 }} 
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 11, fill: '#6c757d' }} 
            />
            <Tooltip 
              cursor={{ fill: '#f8f9fa' }} 
              contentStyle={{ borderRadius: '8px', border: '1px solid #e9ecef', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
            <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={40}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </DashboardCard>
  );
};
