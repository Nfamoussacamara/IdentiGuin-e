import type { IDemande } from '@/types';
import { DashboardCard } from './DashboardCards';

interface RecentDocumentsListProps {
  demandes: IDemande[];
}

/**
 * Liste des documents récents stylisée selon la référence "Reference Dashboard".
 * Utilise le conteneur DashboardCard pour une cohérence visuelle totale.
 */
export const RecentDocumentsList = ({ demandes }: RecentDocumentsListProps) => {
  return (
    <DashboardCard title="Les documents">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-[11px] font-bold text-gray-400 uppercase tracking-wider border-b border-dashboard-border">
              <th className="pb-4">Type / Référence</th>
              <th className="pb-4 text-right">Statut</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-dashboard-border">
            {demandes.length > 0 ? (
              demandes.slice(0, 5).map((d) => (
                <tr key={d.id} className="text-sm hover:bg-dashboard-bg transition-colors group">
                  <td className="py-4">
                    <p className="font-bold text-dashboard-sidebar group-hover:text-green-700">
                      {d.type_document.replace('_', ' ')}
                    </p>
                    <p className="text-[11px] text-gray-400 font-mono tracking-tighter">{d.reference}</p>
                  </td>
                  <td className="py-4 text-right">
                    <span
                      className={`font-bold uppercase text-[10px] px-3 py-1 rounded-full ${
                        d.statut === 'PRET' || d.statut === 'ACCEPTE'
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
                <td colSpan={2} className="py-12 text-center text-gray-400 text-sm italic">
                  Aucune demande enregistrée
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </DashboardCard>
  );
};
