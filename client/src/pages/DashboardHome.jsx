import React, { useState, useEffect } from 'react';
import { Star, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getDashboardStats, getDemandes } from '../api/documents';

const DashboardHome = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ SOUMIS: 0, EN_TRAITEMENT: 0, REJETE: 0, ACCEPTE: 0 });
  const [demandes, setDemandes] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, demandesRes] = await Promise.all([
          getDashboardStats(),
          getDemandes()
        ]);
        setStats(statsRes);
        setDemandes(demandesRes);
      } catch (error) {
        console.error("Erreur lors de la récupération des données dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const statsCards = [
    { name: 'Soumis', value: stats.SOUMIS, color: '#3b82f6', icon: <FileText className="text-blue-500" size={18} /> },
    { name: 'En traitement', value: stats.EN_TRAITEMENT, color: '#fbbf24', icon: <Star className="text-amber-400" size={18} /> },
    { name: 'Rejeté', value: stats.REJETE, color: '#ef4444', icon: <AlertCircle className="text-red-500" size={18} /> },
    { name: 'Accepté', value: stats.ACCEPTE, color: '#10b981', icon: <CheckCircle className="text-green-500" size={18} /> },
  ];

  const chartData = [
    { name: 'Soumis', value: stats.SOUMIS },
    { name: 'En cours', value: stats.EN_TRAITEMENT },
    { name: 'Accepté', value: stats.ACCEPTE },
    { name: 'Rejeté', value: stats.REJETE },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => <div key={i} className="h-24 skeleton rounded-[0.75rem]"></div>)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
           <div className="h-64 skeleton rounded-[0.75rem]"></div>
           <div className="h-64 skeleton rounded-[0.75rem]"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Statistiques Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat) => (
          <div key={stat.name} className="admin-card p-5 flex items-center space-x-4">
            <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center border border-gray-100 shadow-sm">{stat.icon}</div>
            <div>
              <p className="text-2xl font-black text-gray-800">{stat.value}</p>
              <p className="text-[11px] font-black text-gray-400 uppercase tracking-wider">{stat.name}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Graphique */}
        <div className="admin-card p-6">
          <h2 className="text-sm font-bold text-gray-800 mb-6">Volumes par statut</h2>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#999'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#999'}} />
                <Tooltip cursor={{fill: 'transparent'}} />
                <Bar dataKey="value" fill="#23965F" radius={[4, 4, 0, 0]} barSize={35} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Liste des Demandes Réelles */}
        <div className="admin-card p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-sm font-bold text-gray-800">Mes documents récents</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50">
                  <th className="pb-3">Type / Réf</th>
                  <th className="pb-3 text-right">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {demandes.length > 0 ? demandes.slice(0, 5).map((d) => (
                  <tr key={d.id} className="text-sm hover:bg-gray-50 transition-colors">
                    <td className="py-4">
                       <p className="font-bold text-[#23965F]">{d.type_document === 'ACTE_NAISSANCE' ? 'Acte de Naissance' : d.type_document}</p>
                       <p className="text-[10px] text-gray-400 font-mono">{d.reference}</p>
                    </td>
                    <td className="py-4 text-right">
                      <span className={`font-bold uppercase text-[10px] px-2 py-1 rounded ${
                        d.statut === 'ACCEPTE' ? 'text-green-600 bg-green-50' : 
                        d.statut === 'REJETE' ? 'text-red-600 bg-red-50' : 'text-blue-600 bg-blue-50'
                      }`}>
                        {d.statut.replace('_', ' ')}
                      </span>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="2" className="py-8 text-center text-gray-400 text-xs italic">Aucune demande enregistrée</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
