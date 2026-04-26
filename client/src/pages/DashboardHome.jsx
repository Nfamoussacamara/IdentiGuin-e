import React, { useState, useEffect } from 'react';
import { Star, Trophy } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const DashboardHome = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  const stats = [
    { name: 'Soumis', value: 0, color: '#3b82f6', icon: <Star className="text-blue-500" size={18} /> },
    { name: 'En traitement', value: 0, color: '#fbbf24', icon: <Star className="text-amber-400" size={18} /> },
    { name: 'Rejeté', value: 1, color: '#ef4444', icon: <Star className="text-red-500" size={18} /> },
    { name: 'Accepté', value: 0, color: '#10b981', icon: <Star className="text-green-500" size={18} /> },
  ];

  const dataStatut = [
    { name: 'Soumis', value: 0 }, { name: 'En traitement', value: 0 },
    { name: 'Accepté', value: 0 }, { name: 'Rejeté', value: 1 },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => <div key={i} className="h-24 skeleton rounded-[0.75rem]"></div>)}
        </div>
        <div className="h-96 skeleton rounded-[0.75rem]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="admin-card p-5 flex items-center space-x-4">
            <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center border border-gray-100 shadow-sm">{stat.icon}</div>
            <div>
              <p className="text-2xl font-black text-gray-800">{stat.value}</p>
              <p className="text-[11px] font-black text-blue-600 uppercase tracking-wider">{stat.name}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="admin-card p-6">
          <h2 className="text-sm font-bold text-gray-800 mb-6">Projets par statut</h2>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dataStatut}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#999'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#999'}} />
                <Tooltip cursor={{fill: 'transparent'}} />
                <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={35} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="admin-card p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-sm font-bold text-gray-800">Les projets</h2>
          </div>
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50">
                <th className="pb-3">Nom du projet</th>
                <th className="pb-3 text-right">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              <tr className="text-sm">
                <td className="py-4 font-bold text-[#23965F]">TouriGuinée</td>
                <td className="py-4 text-right">
                  <span className="text-red-500 font-bold uppercase text-[10px]">Rejeté</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
