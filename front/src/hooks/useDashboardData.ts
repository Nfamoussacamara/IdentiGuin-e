import { useQuery } from '@tanstack/react-query';
import { getDashboardStats, getDemandes } from '@/api/documents';
import type { IStats, IDemande } from '@/types';


export const useDashboardData = () => {
  const { data: stats, isLoading: loadingStats, error: errorStats } = useQuery<IStats>({
    queryKey: ['dashboardStats'],
    queryFn: getDashboardStats,
  });

  const { data: demandes, isLoading: loadingDemandes, error: errorDemandes } = useQuery<IDemande[]>({
    queryKey: ['dashboardDemandes'],
    queryFn: getDemandes,
  });

  const loading = loadingStats || loadingDemandes;
  const error = errorStats || errorDemandes ? "Impossible de charger les données du tableau de bord." : null;

  return {
    loading,
    stats: stats || { SOUMIS: 0, EN_TRAITEMENT: 0, REJETE: 0, ACCEPTE: 0 },
    demandes: demandes || [],
    error
  };
};
