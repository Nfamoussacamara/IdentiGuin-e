import type { IDemande } from '@/types';

interface RecentDocumentsListProps {
  demandes: IDemande[];
}

export const RecentDocumentsList = ({ demandes }: RecentDocumentsListProps) => {
  return (
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
            {demandes.length > 0 ? (
              demandes.slice(0, 5).map((d) => (
                <tr key={d.id} className="text-sm hover:bg-gray-50 transition-colors">
                  <td className="py-4">
                    <p className="font-bold text-[#23965F]">
                      {d.type_document === 'ACTE_NAISSANCE' ? 'Acte de Naissance' : d.type_document}
                    </p>
                    <p className="text-[10px] text-gray-400 font-mono">{d.reference}</p>
                  </td>
                  <td className="py-4 text-right">
                    <span
                      className={`font-bold uppercase text-[10px] px-2 py-1 rounded ${
                        d.statut === 'ACCEPTE'
                          ? 'text-green-600 bg-green-50'
                          : d.statut === 'REJETE'
                          ? 'text-red-600 bg-red-50'
                          : 'text-blue-600 bg-blue-50'
                      }`}
                    >
                      {d.statut.replace('_', ' ')}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={2} className="py-8 text-center text-gray-400 text-xs italic">
                  Aucune demande enregistrée
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
