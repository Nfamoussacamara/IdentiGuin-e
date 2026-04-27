import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Clock, CheckCircle2, XCircle, ExternalLink, Search, Filter } from 'lucide-react';
import { useDashboardData } from '@/hooks/useDashboardData';

const MyDocuments: React.FC = () => {
  const { demandes, loading } = useDashboardData();

  const getStatusStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case 'validé':
      case 'termine':
        return 'bg-green-light text-green border-green/20';
      case 'en_attente':
      case 'en attente':
        return 'bg-amber-50 text-amber-600 border-amber-200';
      case 'rejeté':
      case 'rejete':
        return 'bg-red-light text-red border-red/20';
      default:
        return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'validé':
      case 'termine':
        return <CheckCircle2 size={14} />;
      case 'en_attente':
      case 'en attente':
        return <Clock size={14} />;
      case 'rejeté':
      case 'rejete':
        return <XCircle size={14} />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-black text-dark">Mes Documents</h1>
          <p className="text-text-muted font-body">Gérez et téléchargez vos documents d'identité certifiés.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Rechercher un document..." 
              className="pl-10 pr-4 py-2 bg-white border border-border rounded-xl text-sm focus:ring-2 focus:ring-green/20 focus:border-green outline-none w-64 transition-all"
            />
          </div>
          <button className="p-2 bg-white border border-border rounded-xl text-dark hover:bg-gray-50 transition-colors">
            <Filter size={20} />
          </button>
        </div>
      </div>

      <div className="bg-white border border-border rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-border">
                <th className="px-6 py-4 text-xs font-display font-bold text-gray-500 uppercase tracking-wider">Référence</th>
                <th className="px-6 py-4 text-xs font-display font-bold text-gray-500 uppercase tracking-wider">Type de Document</th>
                <th className="px-6 py-4 text-xs font-display font-bold text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-xs font-display font-bold text-gray-500 uppercase tracking-wider">Statut</th>
                <th className="px-6 py-4 text-xs font-display font-bold text-gray-500 uppercase tracking-wider">Blockchain</th>
                <th className="px-6 py-4 text-xs font-display font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                [1, 2, 3].map((i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={6} className="px-6 py-8"><div className="h-4 bg-gray-100 rounded w-full"></div></td>
                  </tr>
                ))
              ) : demandes.length > 0 ? (
                demandes.map((doc: any, idx: number) => (
                  <motion.tr 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    key={doc.reference} 
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <span className="font-mono text-xs font-bold text-green bg-green/5 px-2 py-1 rounded">
                        {doc.reference}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-green/10 flex items-center justify-center text-green">
                          <FileText size={16} />
                        </div>
                        <span className="font-body font-semibold text-dark text-sm">{doc.type_document}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-body text-sm text-text-muted">{doc.date_demande}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase border ${getStatusStyle(doc.statut)}`}>
                        {getStatusIcon(doc.statut)}
                        {doc.statut.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {doc.hash_blockchain ? (
                        <div className="flex items-center gap-2 text-xs font-mono text-gray-400">
                          <span className="truncate w-24">{doc.hash_blockchain}</span>
                          <div className="w-2 h-2 rounded-full bg-green animate-pulse"></div>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-300 italic">Non ancré</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 text-gray-400 hover:text-green transition-colors" title="Voir les détails">
                        <ExternalLink size={18} />
                      </button>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-gray-300">
                        <FileText size={24} />
                      </div>
                      <p className="text-gray-400 font-body text-sm">Aucun document trouvé.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MyDocuments;
