import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { IStats } from '../../api/documents';

interface StatusChartProps {
  stats: IStats;
}

export const StatusChart = ({ stats }: StatusChartProps) => {
  const chartData = [
    { name: 'Soumis', value: stats.SOUMIS },
    { name: 'En cours', value: stats.EN_TRAITEMENT },
    { name: 'Accepté', value: stats.ACCEPTE },
    { name: 'Rejeté', value: stats.REJETE },
  ];

  return (
    <div className="admin-card p-6">
      <h2 className="text-sm font-bold text-gray-800 mb-6">Volumes par statut</h2>
      <div className="h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#999' }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#999' }} />
            <Tooltip cursor={{ fill: 'transparent' }} />
            <Bar dataKey="value" fill="#23965F" radius={[4, 4, 0, 0]} barSize={35} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
